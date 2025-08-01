import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSocket } from '../contexts/SocketContext';

const DebugInfo = ({ currentUser, targetUser, messages, loading }) => {
  const { targetUserId } = useParams();
  const userFromStore = useSelector((store) => store.user);
  const { isConnected, socketManager } = useSocket();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-20 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 opacity-90">
      <h4 className="font-bold mb-2 text-yellow-400">🐛 Debug Info</h4>
      
      <div className="space-y-1">
        <div><strong>Target User ID:</strong> {targetUserId}</div>
        <div><strong>Loading:</strong> {loading.toString()}</div>
        <div><strong>Socket Connected:</strong> {isConnected.toString()}</div>
        
        <hr className="my-2 border-gray-600" />
        
        <div><strong>Current User (Store):</strong></div>
        <div className="ml-2 text-green-400">
          {userFromStore ? `${userFromStore.firstName} (${userFromStore._id})` : 'null'}
        </div>
        
        <div><strong>Current User (State):</strong></div>
        <div className="ml-2 text-blue-400">
          {currentUser ? `${currentUser.firstName} (${currentUser._id})` : 'null'}
        </div>
        
        <div><strong>Target User:</strong></div>
        <div className="ml-2 text-purple-400">
          {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'null'}
        </div>
        
        <div><strong>Messages Count:</strong> {messages.length}</div>
        
        <hr className="my-2 border-gray-600" />
        
        <div><strong>Cookies:</strong></div>
        <div className="ml-2 text-orange-400 break-all">
          {document.cookie.includes('token') ? '✅ Token exists' : '❌ No token'}
        </div>
      </div>
    </div>
  );
};

export default DebugInfo;