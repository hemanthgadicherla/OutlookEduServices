import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // =========================
  // HANDLE OAUTH CALLBACK
  // After Google redirect, backend sends ?token=&role=&redirect=
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const redirect = params.get('redirect');

    if (token) {
      localStorage.setItem('userToken', token);
      if (role === 'admin') localStorage.setItem('adminToken', token);
      navigate(redirect || '/');
    }

    const oauthError = params.get('error');
    if (oauthError) setError('Google login failed. Please try again.');
  }, []);

  // =========================
  // EMAIL LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await userAuthAPI.login(email.trim().toLowerCase(), password);

      if (!response.success) {
        setError(response.message || 'Invalid email or password');
        return;
      }

      localStorage.setItem('userToken', response.token);
      if (response.role === 'admin') localStorage.setItem('adminToken', response.token);

      navigate(response.redirect || '/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // Backend returns the OAuth URL; we redirect the browser to it.
  // =========================
  const handleGoogleLogin = async () => {
    try {
      const response = await userAuthAPI.getGoogleOAuthUrl();
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError('Could not initiate Google login. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center mb-4">Login</h2>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            {/* EMAIL LOGIN */}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="text-center my-3">
              <span className="text-muted">OR</span>
            </div>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              className="btn btn-danger w-100"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </button>

            {/* REGISTER */}
            <p className="text-center mt-3">
              Don't have an account?{' '}
              <Link to="/registration">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
