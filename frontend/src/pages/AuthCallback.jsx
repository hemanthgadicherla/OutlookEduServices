import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page handles the redirect from the backend after Google OAuth.
// Backend sends: /auth/callback?token=...&role=...&redirect=...
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const redirect = params.get('redirect') || '/';

    if (token) {
      localStorage.setItem('userToken', token);
      if (role === 'admin') localStorage.setItem('adminToken', token);
      navigate(decodeURIComponent(redirect), { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Completing login...</p>
    </div>
  );
};

export default AuthCallback;
