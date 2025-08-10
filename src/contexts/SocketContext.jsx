import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socketManager from '../Utils/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastError, setLastError] = useState(null);
  const [reconnectTimer, setReconnectTimer] = useState(null);
  
  // Get user from Redux store (adjust this based on your Redux structure)
  const user = useSelector((store) => store.user);

  // Enhanced token detection function
  const getAuthToken = useCallback(() => {
    try {
      // Method 1: From cookies
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find(row => row.startsWith('token='));
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        if (token && token !== 'undefined' && token !== 'null') {
          console.log('Token found in cookies');
          return token;
        }
      }

      // Method 2: From localStorage (but not in Claude artifacts due to restrictions)
      if (typeof window !== 'undefined' && window.localStorage) {
        const localToken = localStorage.getItem('token');
        if (localToken && localToken !== 'undefined' && localToken !== 'null') {
          console.log('Token found in localStorage');
          return localToken;
        }

        // Method 4: Check for other common token names
        const altTokenNames = ['authToken', 'accessToken', 'jwt', 'auth_token'];
        for (const tokenName of altTokenNames) {
          const altToken = localStorage.getItem(tokenName);
          if (altToken && altToken !== 'undefined' && altToken !== 'null') {
            console.log(`Token found in storage as '${tokenName}'`);
            return altToken;
          }
        }
      }

      // Method 3: From sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const sessionToken = sessionStorage.getItem('token');
        if (sessionToken && sessionToken !== 'undefined' && sessionToken !== 'null') {
          console.log('Token found in sessionStorage');
          return sessionToken;
        }
      }

      console.log('No valid authentication token found');
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }, []);

  // Clear any existing reconnect timers
  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      setReconnectTimer(null);
    }
  }, [reconnectTimer]);

  // Connection retry logic
  const connectWithRetry = useCallback((token, attempt = 1) => {
    // Clear any existing timers
    clearReconnectTimer();

    if (attempt > 3) {
      console.error('Max socket connection attempts exceeded');
      setLastError('Failed to connect after 3 attempts');
      setConnectionAttempts(0);
      return;
    }

    console.log(`Socket connection attempt ${attempt}/3`);
    setConnectionAttempts(attempt);
    setLastError(null);

    try {
      // Disconnect existing socket before creating new one
      if (socketManager && socketManager.isSocketConnected()) {
        socketManager.disconnect();
      }

      const socketInstance = socketManager.connect(token);
      
      if (socketInstance) {
        setSocket(socketInstance);
        setupSocketEventListeners(socketInstance, token, attempt);
      } else {
        console.error('Socket manager returned null socket instance');
        // Retry after delay
        const timer = setTimeout(() => connectWithRetry(token, attempt + 1), 2000 * attempt);
        setReconnectTimer(timer);
      }
    } catch (error) {
      console.error('Error during socket connection:', error);
      setLastError(error.message);
      // Retry after delay with exponential backoff
      const timer = setTimeout(() => connectWithRetry(token, attempt + 1), 2000 * attempt);
      setReconnectTimer(timer);
    }
  }, [clearReconnectTimer]);

  // Setup socket event listeners
  const setupSocketEventListeners = useCallback((socketInstance, token, attempt) => {
    // Remove any existing listeners to prevent duplicates
    socketInstance.removeAllListeners();

    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setConnectionAttempts(0);
      setLastError(null);
      clearReconnectTimer();
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Auto-reconnect for certain disconnect reasons, but not for auth issues
      if (reason === 'io server disconnect' || reason === 'transport close') {
        console.log('Server disconnected, attempting to reconnect...');
        const timer = setTimeout(() => {
          if (token) {
            connectWithRetry(token, 1);
          }
        }, 1000);
        setReconnectTimer(timer);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setLastError(error.message);
      
      // Don't retry on authentication errors
      if (error.message && error.message.toLowerCase().includes('auth')) {
        console.error('Authentication error, not retrying');
        setConnectionAttempts(0);
        return;
      }
      
      // Retry connection after delay if we haven't exceeded max attempts
      if (attempt < 3) {
        const timer = setTimeout(() => connectWithRetry(token, attempt + 1), 2000 * attempt);
        setReconnectTimer(timer);
      }
    });

    socketInstance.on('userOnline', (data) => {
      if (data && data.userId) {
        console.log('User came online:', data.userId);
        setOnlineUsers(prev => new Set([...prev, data.userId]));
      }
    });

    socketInstance.on('userOffline', (data) => {
      if (data && data.userId) {
        console.log('User went offline:', data.userId);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    });

    // Handle authentication errors specifically
    socketInstance.on('auth_error', (error) => {
      console.error('Socket authentication error:', error);
      setLastError('Authentication failed - please login again');
      setIsConnected(false);
      setConnectionAttempts(0);
      // Don't retry on auth errors - user needs to login again
    });

    // Handle general errors
    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
      setLastError(error.message || 'Socket error occurred');
    });
  }, [connectWithRetry, clearReconnectTimer]);

  useEffect(() => {
    console.log('SocketContext useEffect triggered');
    console.log('User data:', user);

    // Check if we should attempt socket connection
    const shouldConnect = user && (user._id || user.id);

    if (shouldConnect) {
      console.log('User is authenticated, attempting socket connection...');
      
      const token = getAuthToken();

      if (token) {
        console.log('Authentication token found, initializing socket connection for user:', user.firstName || user.name || 'Unknown');
        connectWithRetry(token);
      } else {
        console.warn('No authentication token found. Please ensure you are logged in.');
        setLastError('No authentication token found');
      }
    } else {
      console.log('User not authenticated or user data missing, skipping socket connection');
      
      // Clean up existing connection if user logged out
      if (socketManager && socketManager.isSocketConnected()) {
        console.log('User logged out, disconnecting socket...');
        socketManager.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
        setConnectionAttempts(0);
        setLastError(null);
        clearReconnectTimer();
      }
    }

    // Cleanup function
    return () => {
      clearReconnectTimer();
    };
  }, [user, getAuthToken, connectWithRetry, clearReconnectTimer]); // Dependencies array

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      console.log('SocketProvider unmounting, cleaning up...');
      clearReconnectTimer();
      if (socketManager && socketManager.isSocketConnected()) {
        socketManager.disconnect();
      }
    };
  }, [clearReconnectTimer]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    console.log('Manual reconnect triggered');
    clearReconnectTimer();
    
    if (user && (user._id || user.id)) {
      const token = getAuthToken();
      if (token) {
        // Disconnect first if connected
        if (socketManager && socketManager.isSocketConnected()) {
          socketManager.disconnect();
        }
        setSocket(null);
        setIsConnected(false);
        setConnectionAttempts(0);
        setLastError(null);
        connectWithRetry(token);
      } else {
        setLastError('No authentication token found for reconnection');
      }
    } else {
      setLastError('No user data available for reconnection');
    }
  }, [user, getAuthToken, connectWithRetry, clearReconnectTimer]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    socketManager,
    connectionAttempts,
    lastError,
    reconnect,
    // Helper function to check if a user is online
    isUserOnline: (userId) => onlineUsers.has(userId),
    // Helper to get connection status
    getConnectionStatus: () => {
      if (isConnected) return 'Connected';
      if (connectionAttempts > 0) return `Connecting... (${connectionAttempts}/3)`;
      if (lastError) return `Error: ${lastError}`;
      return 'Disconnected';
    },
    // Helper to get debug info
    getDebugInfo: () => ({
      user: !!user,
      userId: user?._id || user?.id,
      token: !!getAuthToken(),
      socketExists: !!socket,
      isConnected,
      connectionAttempts,
      lastError,
      onlineUsersCount: onlineUsers.size
    })
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;