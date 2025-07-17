import React from 'react';
import auth from '../utils/auth';

const ChatSidebar = ({ 
  conversations, 
  currentConversation, 
  onSelectConversation, 
  onNewConversation,
  isOpen,
  onClose 
}) => {
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
  };

  const formatConversationTitle = (conversation) => {
    if (conversation.title && conversation.title !== 'New Chat') {
      return conversation.title;
    }
    
    // Generate title from first message if available
    if (conversation.messages && conversation.messages.length > 0) {
      const firstMessage = conversation.messages.find(msg => msg.sender === 'user');
      if (firstMessage) {
        return firstMessage.content.length > 30 
          ? firstMessage.content.substring(0, 30) + '...'
          : firstMessage.content;
      }
    }
    
    return 'New Chat';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">DeepPuse</h2>
        <button 
          className="new-chat-btn"
          onClick={onNewConversation}
        >
          + New Chat
        </button>
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div style={{ 
            padding: '1rem', 
            textAlign: 'center', 
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            No conversations yet.<br />
            Start a new chat to begin!
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${
                currentConversation?.id === conversation.id ? 'active' : ''
              }`}
              onClick={() => {
                onSelectConversation(conversation);
                if (onClose) onClose(); // Close sidebar on mobile
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                <div style={{ 
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  {formatConversationTitle(conversation)}
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  opacity: 0.7
                }}>
                  {formatDate(conversation.updatedAt || conversation.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* User section at bottom */}
      <div style={{ 
        marginTop: 'auto',
        padding: '1rem',
        borderTop: '1px solid #374151'
      }}>
        {user && (
          <div style={{ 
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#d1d5db'
          }}>
            <div style={{ fontWeight: '500' }}>
              {user.name || user.email}
            </div>
            <div style={{ 
              fontSize: '0.75rem',
              opacity: 0.7
            }}>
              {user.email}
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.5rem',
            background: 'transparent',
            color: '#d1d5db',
            border: '1px solid #374151',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#374151';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#d1d5db';
          }}
        >
          Sign out
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default ChatSidebar;
