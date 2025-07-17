import React from 'react';

const MessageBubble = ({ message, sender, timestamp }) => {
  const isUser = sender === 'user';
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-content">
        {message}
      </div>
      {timestamp && (
        <div 
          style={{ 
            fontSize: '0.75rem', 
            opacity: 0.7, 
            marginTop: '0.25rem',
            textAlign: isUser ? 'right' : 'left'
          }}
        >
          {formatTimestamp(timestamp)}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
