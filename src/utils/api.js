import axios from 'axios';
import auth from './auth';

// API base URL - adjust based on your backend setup
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication endpoints
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  },

  // Chat endpoints
  sendMessage: async (conversationId, message) => {
    try {
      const response = await apiClient.post('/chat/message', {
        conversationId,
        message,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message. Please try again.',
      };
    }
  },

  // Get conversation history
  getConversations: async () => {
    try {
      const response = await apiClient.get('/chat/conversations');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load conversations.',
      };
    }
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    try {
      const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to load messages.',
      };
    }
  },

  // Create new conversation
  createConversation: async (title = 'New Chat') => {
    try {
      const response = await apiClient.post('/chat/conversations', { title });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create conversation.',
      };
    }
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await apiClient.delete(`/chat/conversations/${conversationId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete conversation.',
      };
    }
  },
};

export default api;
