import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span>DeepPuse is typing</span>
    <div className="typing-dots">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  </div>
);

const ChatWindow = ({ messages, isLoading, currentConversation }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const renderWelcomeMessage = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      color: '#6b7280'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '600', 
        color: '#111827',
        marginBottom: '0.5rem'
      }}>
        Welcome to DeepPuse
      </h2>
      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        How can I help you today?
      </p>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        maxWidth: '400px',
        margin: '0 auto',
        fontSize: '0.875rem'
      }}>
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          "Explain quantum computing in simple terms"
        </div>
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          "Write a creative story about space exploration"
        </div>
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          "Help me plan a healthy meal for the week"
        </div>
      </div>
    </div>
  );

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        renderWelcomeMessage()
      ) : (
        <>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id || index}
              message={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
