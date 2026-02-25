import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    api.verifyEmail(token)
      .then((data) => {
        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          setStatus('success');
          setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
        } else {
          setStatus('error');
          setError(data.message || 'Verification failed');
        }
      })
      .catch((err) => {
        setStatus('error');
        setError(err?.message || 'Verification failed');
      });
  }, [token]);

  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-container auth-container--wide">
        <div className="wizard verification-sent-card">
          {status === 'verifying' && (
            <>
              <div className="wizard-title">Verifying your email…</div>
              <div className="wizard-subtitle">Please wait a moment.</div>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="wizard-title">Email verified!</div>
              <div className="wizard-subtitle">Redirecting you to your dashboard…</div>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="wizard-title">Verification failed</div>
              <div className="wizard-subtitle">{error}</div>
              <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>
                The link may have expired. You can request a new verification email when signing in.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
                Go to Sign in
              </Link>
            </>
          )}
        </div>
        <div className="auth-footer">
          <p>
            <Link to="/">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
