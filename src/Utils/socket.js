import io from "socket.io-client";
import { BASE_URL } from "./constants";

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Chat-specific methods
  joinChat(targetUserId) {
    if (this.socket) {
      this.socket.emit('joinChat', targetUserId);
    }
  }

  leaveChat(targetUserId) {
    if (this.socket) {
      this.socket.emit('leaveChat', targetUserId);
    }
  }

  sendMessage(targetUserId, content) {
    if (this.socket) {
      this.socket.emit('sendMessage', {
        targetUserId,
        content
      });
    }
  }

  sendTyping(targetUserId, isTyping) {
    if (this.socket) {
      this.socket.emit('typing', {
        targetUserId,
        isTyping
      });
    }
  }

  markAsRead(targetUserId, messageIds) {
    if (this.socket) {
      this.socket.emit('markAsRead', {
        targetUserId,
        messageIds
      });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  onMessageDelivered(callback) {
    if (this.socket) {
      this.socket.on('messageDelivered', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('userTyping', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('userStoppedTyping', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('userOnline', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('userOffline', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;