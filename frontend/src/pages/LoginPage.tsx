/**
 * Login Page - Professional authentication interface
 */
import { useState, FormEvent } from 'react';
import { authAPI } from '../api/client';
import type { LoginCredentials } from '../types';

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);

      // Store token and user info in localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response));

      // Call parent callback
      onLoginSuccess(response);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo and Title */}
        <div className="login-header">
          <div className="login-logo">
            <img src="/Web_Logo.png" alt="Bridge Logo" className="logo-image" />
            <div>
              <h1 className="login-title">Bridge</h1>
              <p className="login-subtitle">Safety Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter your username"
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="login-footer">
          <details className="demo-credentials">
            <summary>Demo Credentials</summary>
            <div className="demo-list">
              <div className="demo-item">
                <strong>Apex Construction Ltd</strong>
                <code>sarah.johnson / password123</code>
              </div>
              <div className="demo-item">
                <strong>TechBuild Solutions</strong>
                <code>emma.davis / password123</code>
              </div>
              <div className="demo-item">
                <strong>SafeWorks Industrial</strong>
                <code>lisa.martinez / password123</code>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
