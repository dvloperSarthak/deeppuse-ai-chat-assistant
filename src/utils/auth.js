// Authentication utilities for DeepPuse

const TOKEN_KEY = 'deeppuse_token';
const USER_KEY = 'deeppuse_user';

export const auth = {
  // Store authentication token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove authentication token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Store user information
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user information
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = auth.getToken();
    return token !== null && token !== undefined && token !== '';
  },

  // Logout user
  logout: () => {
    auth.removeToken();
    window.location.href = '/login';
  },

  // Get authorization headers for API calls
  getAuthHeaders: () => {
    const token = auth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export default auth;
