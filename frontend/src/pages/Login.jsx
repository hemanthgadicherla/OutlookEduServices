import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { userAuthAPI } from '../services/api';
import { getUser } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Already logged in → redirect away
  useEffect(() => {
    if (getUser()) {
      const redirect = searchParams.get('redirect') || '/';
      navigate(decodeURIComponent(redirect), { replace: true });
    }
  }, []);

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

      // honour ?redirect= param (e.g. from course enroll button)
      const redirectTo = searchParams.get('redirect');
      if (redirectTo) {
        navigate(decodeURIComponent(redirectTo), { replace: true });
      } else {
        navigate(response.redirect || '/', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="card shadow border-0 p-4">

              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted small">Log in to your account</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center text-muted small mt-4 mb-0">
                Don't have an account?{' '}
                <Link to="/registration" className="fw-semibold text-decoration-none">Register</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
