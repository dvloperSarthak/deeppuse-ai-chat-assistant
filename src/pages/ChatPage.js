import React, { useState, useEffect } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ErrorNotification from '../components/ErrorNotification';
import api from '../utils/api';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const result = await api.getConversations();
    if (result.success) {
      setConversations(result.data);
      
      // If no current conversation and conversations exist, select the first one
      if (!currentConversation && result.data.length > 0) {
        selectConversation(result.data[0]);
      }
    } else {
      setError(result.error);
    }
  };

  const selectConversation = async (conversation) => {
    setCurrentConversation(conversation);
    
    // Load messages for this conversation
    if (conversation.id) {
      const result = await api.getMessages(conversation.id);
      if (result.success) {
        setMessages(result.data);
      } else {
        setError(result.error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  const createNewConversation = async () => {
    const result = await api.createConversation();
    if (result.success) {
      const newConversation = result.data;
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
    } else {
      setError(result.error);
    }
  };

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    // Create user message
    const userMessage = {
      id: Date.now(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // If no current conversation, create one
      let conversationId = currentConversation?.id;
      if (!conversationId) {
        const newConvResult = await api.createConversation();
        if (newConvResult.success) {
          conversationId = newConvResult.data.id;
          setCurrentConversation(newConvResult.data);
          setConversations(prev => [newConvResult.data, ...prev]);
        } else {
          throw new Error(newConvResult.error);
        }
      }

      // Send message to API
      const result = await api.sendMessage(conversationId, messageContent);
      
      if (result.success) {
        // Add AI response to messages
        const aiMessage = {
          id: Date.now() + 1,
          content: result.data.response,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Update conversation in sidebar if title changed
        if (result.data.conversation) {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversationId 
                ? { ...conv, ...result.data.conversation }
                : conv
            )
          );
        }
      } else {
        setError(result.error);
        // Remove user message on error
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      // Remove user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="chat-page">
      {error && (
        <ErrorNotification 
          message={error} 
          type="error" 
          onClose={() => setError('')}
        />
      )}
      
      <ChatSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="chat-main">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              style={{
                display: window.innerWidth <= 768 ? 'block' : 'none',
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ☰
            </button>
            
            <h1 className="chat-title">
              {currentConversation?.title || 'New Chat'}
            </h1>
          </div>
        </div>
        
        <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          currentConversation={currentConversation}
        />
        
        <ChatInput 
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default ChatPage;
