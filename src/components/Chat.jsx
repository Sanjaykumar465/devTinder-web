import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../Utils/constants";
import socketManager from "../Utils/socket";
import DebugInfo from "./DebugInfo"; // Add this import

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current user from Redux store instead of API call
  const currentUserFromStore = useSelector((store) => store.user);

  useEffect(() => {
    if (currentUserFromStore) {
      setCurrentUser(currentUserFromStore);
    }
  }, [currentUserFromStore]);

  // Fetch target user info
  const fetchTargetUser = async () => {
    try {
      setLoading(true);
      console.log("Fetching target user:", targetUserId);
      
      const res = await axios.get(`${BASE_URL}/user/profile/${targetUserId}`, {
        withCredentials: true,
      });
      
      console.log("Target user response:", res.data);
      
      if (res.data && res.data.success && res.data.data) {
        setTargetUser(res.data.data);
        console.log("Target user set successfully:", res.data.data);
      } else {
        console.warn("Failed to fetch target user, trying connections fallback:", res.data);
        await fetchFromConnections();
      }
    } catch (err) {
      console.error("Error fetching target user:", err.response?.status, err.response?.data || err.message);
      
      // If 404, try connections fallback
      if (err.response?.status === 404) {
        console.log("User not found, trying connections fallback...");
        await fetchFromConnections();
      } else {
        // For other errors, set fallback user
        setFallbackUser();
      }
    }
  };

  // Fallback to fetch from connections
  const fetchFromConnections = async () => {
    try {
      console.log("Fetching from connections...");
      const connectionsRes = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      
      console.log("Connections response:", connectionsRes.data);
      
      if (connectionsRes.data && connectionsRes.data.data) {
        const targetConnection = connectionsRes.data.data.find(
          connection => connection._id === targetUserId
        );
        
        if (targetConnection) {
          setTargetUser(targetConnection);
          console.log("Target user found in connections:", targetConnection);
        } else {
          console.warn("Target user not found in connections");
          setFallbackUser();
        }
      } else {
        console.warn("No connections data received");
        setFallbackUser();
      }
    } catch (connectionErr) {
      console.error("Error fetching connections:", connectionErr.response?.data || connectionErr.message);
      setFallbackUser();
    }
  };

  // Set fallback user when all else fails
  const setFallbackUser = () => {
    console.log("Setting fallback user for ID:", targetUserId);
    setTargetUser({
      _id: targetUserId,
      firstName: "Unknown",
      lastName: "User",
      photoUrl: null
    });
  };

  // Fetch chat messages
  const fetchMessages = async () => {
    try {
      console.log("Fetching messages for user:", targetUserId);
      
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      
      console.log("Messages response:", res.data);
      
      if (res.data && res.data.success && res.data.data) {
        console.log("Messages loaded:", res.data.data.length);
        setMessages(res.data.data);
      } else {
        console.log("No messages found, starting with empty array");
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err.response?.status, err.response?.data || err.message);
      
      // Don't show error to user, just start with empty messages
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize socket connection
  const initializeSocket = () => {
    // Try multiple ways to get the token
    let token = null;
    
    // Method 1: From cookies
    token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    // Method 2: From localStorage (if cookies don't work)
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    // Method 3: From sessionStorage
    if (!token) {
      token = sessionStorage.getItem('token');
    }

    console.log("Token found:", token ? "Yes" : "No");

    if (token) {
      try {
        const socket = socketManager.connect(token);
        
        if (socket) {
          console.log("Socket connected successfully");
          
          // Join chat room
          socketManager.joinChat(targetUserId);

          // Listen for new messages
          socketManager.onNewMessage((data) => {
            console.log("New message received:", data);
            if (data.from === targetUserId) {
              setMessages(prev => [...prev, data.message]);
            }
          });

          // Listen for message delivery confirmation
          socketManager.onMessageDelivered((data) => {
            console.log("Message delivered:", data);
            setMessages(prev => prev.map(msg => 
              msg.temp && msg.tempId === data.messageId 
                ? { ...data.message, temp: false }
                : msg
            ));
          });

          // Listen for typing indicators
          socketManager.onUserTyping((data) => {
            if (data.userId === targetUserId) {
              setUserTyping(data.userInfo);
            }
          });

          socketManager.onUserStoppedTyping((data) => {
            if (data.userId === targetUserId) {
              setUserTyping(null);
            }
          });

          return () => {
            console.log("Cleaning up socket connection");
            socketManager.leaveChat(targetUserId);
            socketManager.off('newMessage');
            socketManager.off('messageDelivered');
            socketManager.off('userTyping');
            socketManager.off('userStoppedTyping');
          };
        } else {
          console.warn("Socket connection failed");
        }
      } catch (socketError) {
        console.error("Socket initialization error:", socketError);
      }
    } else {
      console.warn("No authentication token found - socket connection skipped");
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !currentUser) return;

    setSending(true);
    const messageToSend = newMessage.trim();
    const tempId = Date.now().toString();
    setNewMessage("");

    console.log("Sending message:", messageToSend);

    // Optimistically add message to UI
    const tempMessage = {
      _id: tempId,
      tempId: tempId,
      senderId: currentUser._id,
      receiverId: targetUserId,
      content: messageToSend,
      timestamp: new Date(),
      temp: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Try socket first for real-time delivery
      if (socketManager.isSocketConnected()) {
        console.log("Sending message via socket");
        socketManager.sendMessage(targetUserId, messageToSend);
      } else {
        console.log("Socket not connected, using HTTP fallback");
        // Fallback to HTTP request
        const res = await axios.post(`${BASE_URL}/chat/send`, {
          targetUserId,
          content: messageToSend
        }, {
          withCredentials: true,
        });

        console.log("Message sent via HTTP:", res.data);

        if (res.data && res.data.data) {
          // Replace temp message with real message
          setMessages(prev => prev.map(msg => 
            msg.temp && msg.tempId === tempId ? res.data.data : msg
          ));
        }
      }
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err.message);
      
      // Remove temp message on error and show error
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
      
      // You might want to show a toast notification here
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Handle textarea auto-resize and typing indicator
  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // Handle typing indicator
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
      socketManager.sendTyping(targetUserId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketManager.sendTyping(targetUserId, false);
      }
    }, 1000);

    // Stop typing immediately if message is empty
    if (!e.target.value.trim() && isTyping) {
      setIsTyping(false);
      socketManager.sendTyping(targetUserId, false);
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      
      // Stop typing indicator when sending
      if (isTyping) {
        setIsTyping(false);
        socketManager.sendTyping(targetUserId, false);
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing indicator when component unmounts
      if (isTyping) {
        socketManager.sendTyping(targetUserId, false);
      }
      
      // Leave chat room
      socketManager.leaveChat(targetUserId);
    };
  }, [targetUserId, isTyping]);

  useEffect(() => {
    if (targetUserId && currentUserFromStore) {
      console.log("Initializing chat for user:", targetUserId);
      console.log("Current user:", currentUserFromStore);
      
      fetchTargetUser();
      fetchMessages();
      
      // Initialize socket after component mounts
      const cleanup = initializeSocket();
      
      return cleanup;
    } else {
      console.warn("Missing required data:", { targetUserId, currentUserFromStore });
    }
  }, [targetUserId, currentUserFromStore]);

  if (loading || !targetUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50">
        <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl max-w-md mx-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mx-auto"></div>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            Loading chat...
          </p>
          <p className="text-sm text-gray-600">
            {!currentUserFromStore ? "Authenticating..." : `Connecting to ${targetUserId}...`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-50">
      {/* Debug Info - Remove this in production */}
      <DebugInfo 
        currentUser={currentUser}
        targetUser={targetUser}
        messages={messages}
        loading={loading}
      />
      {/* Chat Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/50 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/connections" 
                className="p-2 hover:bg-violet-100 rounded-full transition-colors duration-200 flex items-center"
              >
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full blur-lg opacity-30"></div>
                  {targetUser?.photoUrl ? (
                    <img
                      className="relative h-12 w-12 rounded-full object-cover border-2 border-white shadow-lg"
                      src={targetUser.photoUrl}
                      alt={`${targetUser.firstName} ${targetUser.lastName}`}
                    />
                  ) : (
                    <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-lg">
                      {targetUser?.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Loading..."}
                  </h2>
                  <p className="text-sm text-green-600 font-medium">
                    {userTyping ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-violet-100 rounded-full transition-colors duration-200">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-violet-100 rounded-full transition-colors duration-200">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?._id || 
              (typeof message.senderId === 'object' && message.senderId._id === currentUser?._id);
            
            return (
              <div
                key={message._id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {!isCurrentUser && (
                    <div className="flex-shrink-0">
                      {targetUser?.photoUrl ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={targetUser.photoUrl}
                          alt={targetUser.firstName}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm">
                          {targetUser?.firstName?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className={`group relative ${isCurrentUser ? 'ml-auto' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      } ${message.temp ? 'opacity-70' : ''}`}
                    >
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    
                    <div className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                      {message.temp && (
                        <span className="ml-1 text-violet-500">Sending...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {userTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-xs">
                <div className="flex-shrink-0">
                  {targetUser?.photoUrl ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={targetUser.photoUrl}
                      alt={targetUser.firstName}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm">
                      {targetUser?.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white/90 backdrop-blur-md border-t border-white/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-end space-x-3">
            <button className="flex-shrink-0 p-3 text-violet-600 hover:bg-violet-100 rounded-full transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                style={{ maxHeight: '120px' }}
              />
              
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-violet-600 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5H9m12 3.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending || !currentUser}
              className="flex-shrink-0 p-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;