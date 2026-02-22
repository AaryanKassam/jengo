import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    login(formData)
      .then((result) => {
        if (!result.success) {
          setError(result.error || 'Login failed.');
          return;
        }

        localStorage.setItem('isAuthenticated', 'true');
        const safeUser = {
          id: result.user?._id,
          _id: result.user?._id,
          name: result.user?.name,
          username: result.user?.username,
          email: result.user?.email,
          role: result.user?.role,
          location: result.user?.location,
          skills: result.user?.skills || []
        };
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        navigate('/dashboard');
      })
      .catch((err) => setError(err?.message || 'Login failed.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Jengo account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-action">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" className="toggle-visibility" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="#" className="forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error ? <div className="form-error" style={{ marginTop: '12px' }}>{error}</div> : null}

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
