import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    // Focus input when component mounts
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please wait..." : "Ask anything..."}
          className="chat-input"
          disabled={isLoading || disabled}
          rows={1}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!message.trim() || isLoading || disabled}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      
      {/* Terms notice */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: '#6b7280', 
        marginTop: '0.5rem',
        maxWidth: '800px',
        margin: '0.5rem auto 0'
      }}>
        By messaging DeepPuse, you agree to our Terms and have read our Privacy Policy.
      </div>
    </div>
  );
};

export default ChatInput;
