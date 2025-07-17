import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import auth from './utils/auth';
import './styles/main.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return auth.isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to chat if already authenticated)
const PublicRoute = ({ children }) => {
  return auth.isAuthenticated() ? <Navigate to="/chat" replace /> : children;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              auth.isAuthenticated() ? 
                <Navigate to="/chat" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
