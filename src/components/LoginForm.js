import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import auth from '../utils/auth';
import ErrorNotification from './ErrorNotification';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await api.login(formData);
      
      if (result.success) {
        // Store auth token and user info
        auth.setToken(result.data.token);
        auth.setUser(result.data.user);
        
        // Navigate to chat page
        navigate('/chat');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setError(`${provider} login is not implemented yet. Please use email/password.`);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">DeepPuse</h1>
          <p className="login-subtitle">Welcome back</p>
        </div>

        {error && (
          <ErrorNotification 
            message={error} 
            type="error" 
            onClose={() => setError('')}
          />
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="#" onClick={(e) => {
            e.preventDefault();
            setError('Registration is not implemented yet. Use demo credentials: demo@deeppuse.com / demo123');
          }}>Sign up</a>
        </div>

        <div className="auth-divider">OR</div>

        <div className="social-login">
          <button 
            type="button" 
            className="btn-social"
            onClick={() => handleSocialLogin('Google')}
          >
            <span>G</span>
            Continue with Google
          </button>
          
          <button 
            type="button" 
            className="btn-social"
            onClick={() => handleSocialLogin('Microsoft')}
          >
            <span>M</span>
            Continue with Microsoft Account
          </button>
          
          <button 
            type="button" 
            className="btn-social"
            onClick={() => handleSocialLogin('Apple')}
          >
            <span>🍎</span>
            Continue with Apple
          </button>
          
          <button 
            type="button" 
            className="btn-social"
            onClick={() => handleSocialLogin('Phone')}
          >
            <span>📱</span>
            Continue with phone
          </button>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: demo@deeppuse.com<br />
          Password: demo123
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
