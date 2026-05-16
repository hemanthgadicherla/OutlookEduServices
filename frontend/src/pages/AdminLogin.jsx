import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminAuthAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = {
  initial:    { opacity: 0, y: 30 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // Already logged in as admin → go to dashboard
  useEffect(() => {
    const user = getUser();
    if (user?.role === 'admin') navigate('/admin/dashboard', { replace: true });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await adminAuthAPI.login(email.trim().toLowerCase(), password);

      if (!res.success) {
        setError(res.message || 'Invalid credentials');
        return;
      }

      // Store both tokens — adminToken gates admin routes, userToken for shared helpers
      localStorage.setItem('adminToken', res.token);
      localStorage.setItem('userToken',  res.token);

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}
    >
      <div className="w-100" style={{ maxWidth: 420, padding: '0 16px' }}>
        <motion.div className="card border-0 shadow-lg" {...fadeUp}>
          <div className="card-body p-4 p-md-5">

            {/* header */}
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#dc3545,#b02a37)'
                }}
              >
                <FaLock size={22} color="#fff" />
              </div>
              <h2 className="fw-bold mb-1">Admin Login</h2>
              <p className="text-muted small mb-0">Restricted access — authorised personnel only</p>
            </div>

            {/* error */}
            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>

              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="admin_email">Email</label>
                <input
                  id="admin_email"
                  type="email"
                  className="form-control"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="admin_password">Password</label>
                <div className="input-group">
                  <input
                    id="admin_password"
                    type={showPwd ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPwd(!showPwd)}
                    tabIndex={-1}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Signing in...</>
                ) : (
                  <><FaLock className="me-2" />Sign In</>
                )}
              </button>

            </form>

          </div>
        </motion.div>

        <p className="text-center text-secondary small mt-3">
          Not an admin?{' '}
          <a href="/" className="text-light text-decoration-none">Go to main site</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
