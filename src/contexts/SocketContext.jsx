import React, { createContext, useContext, useEffect, useState } from 'react';
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
  
  // Get user from Redux store (adjust this based on your Redux structure)
  const user = useSelector((store) => store.user);

  // Enhanced token detection function
  const getAuthToken = () => {
    // Method 1: From cookies
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      console.log('Token found in cookies');
      return token;
    }

    // Method 2: From localStorage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      console.log('Token found in localStorage');
      return localToken;
    }

    // Method 3: From sessionStorage
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      console.log('Token found in sessionStorage');
      return sessionToken;
    }

    // Method 4: Check for other common token names
    const altTokenNames = ['authToken', 'accessToken', 'jwt', 'auth_token'];
    for (const tokenName of altTokenNames) {
      const altToken = localStorage.getItem(tokenName) || sessionStorage.getItem(tokenName);
      if (altToken) {
        console.log(`Token found in storage as '${tokenName}'`);
        return altToken;
      }
    }

    console.log('No authentication token found in cookies, localStorage, or sessionStorage');
    return null;
  };

  // Connection retry logic
  const connectWithRetry = (token, attempt = 1) => {
    if (attempt > 3) {
      console.error('Max socket connection attempts exceeded');
      setLastError('Failed to connect after 3 attempts');
      return;
    }

    console.log(`Socket connection attempt ${attempt}/3`);
    setConnectionAttempts(attempt);

    try {
      const socketInstance = socketManager.connect(token);
      
      if (socketInstance) {
        setSocket(socketInstance);
        setupSocketEventListeners(socketInstance, token, attempt);
      } else {
        console.error('Socket manager returned null socket instance');
        // Retry after delay
        setTimeout(() => connectWithRetry(token, attempt + 1), 2000);
      }
    } catch (error) {
      console.error('Error during socket connection:', error);
      setLastError(error.message);
      // Retry after delay
      setTimeout(() => connectWithRetry(token, attempt + 1), 2000);
    }
  };

  // Setup socket event listeners
  const setupSocketEventListeners = (socketInstance, token, attempt) => {
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      setConnectionAttempts(0);
      setLastError(null);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      
      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect') {
        console.log('Server disconnected, attempting to reconnect...');
        setTimeout(() => connectWithRetry(token, 1), 1000);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      setLastError(error.message);
      
      // Retry connection after delay
      setTimeout(() => connectWithRetry(token, attempt + 1), 2000);
    });

    socketInstance.on('userOnline', (data) => {
      console.log('User came online:', data.userId);
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    socketInstance.on('userOffline', (data) => {
      console.log('User went offline:', data.userId);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    // Handle authentication errors specifically
    socketInstance.on('auth_error', (error) => {
      console.error('Socket authentication error:', error);
      setLastError('Authentication failed');
      setIsConnected(false);
      // Don't retry on auth errors - user needs to login again
    });
  };

  useEffect(() => {
    console.log('SocketContext useEffect triggered');
    console.log('User data:', user);
    console.log('User exists:', !!user);
    console.log('User ID:', user?._id);

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
        console.log('Available cookies:', document.cookie);
        console.log('LocalStorage keys:', Object.keys(localStorage));
        console.log('SessionStorage keys:', Object.keys(sessionStorage));
        setLastError('No authentication token found');
      }
    } else {
      console.log('User not authenticated or user data missing, skipping socket connection');
      console.log('User state:', { exists: !!user, hasId: !!(user?._id || user?.id) });
    }

    // Cleanup function
    return () => {
      if (socketManager && socketManager.isSocketConnected()) {
        console.log('Cleaning up socket connection...');
        socketManager.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
        setConnectionAttempts(0);
        setLastError(null);
      }
    };
  }, [user]); // Re-run when user changes (login/logout)

  // Manual reconnect function
  const reconnect = () => {
    console.log('Manual reconnect triggered');
    if (user) {
      const token = getAuthToken();
      if (token) {
        // Disconnect first if connected
        if (socketManager.isSocketConnected()) {
          socketManager.disconnect();
        }
        connectWithRetry(token);
      } else {
        setLastError('No authentication token found for reconnection');
      }
    } else {
      setLastError('No user data available for reconnection');
    }
  };

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