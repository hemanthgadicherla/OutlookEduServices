import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminAuthAPI } from '../services/api';

const fadeUp = {
  initial:    { opacity: 0, y: 30 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const AdminSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name:       '',
    email:           '',
    phone:           '',
    password:        '',
    confirm_password:'',
    secret_key:      ''
  });

  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { full_name, email, phone, password, confirm_password, secret_key } = form;

    // ── validation ──────────────────────────────────────────────
    if (!full_name || !email || !phone || !password || !confirm_password || !secret_key) {
      setError('All fields are required');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Phone must be a valid 10-digit Indian mobile number (starts with 6–9)');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await adminAuthAPI.signup(
        email.trim().toLowerCase(),
        password,
        full_name.trim(),
        phone.trim(),
        secret_key.trim()
      );

      if (!res.success) {
        setError(res.message || 'Signup failed');
        return;
      }

      // Store token and go straight to dashboard
      if (res.token) {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('userToken',  res.token);
      }

      setSuccess('Admin account created! Redirecting to dashboard…');
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 1500);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}
    >
      <div className="w-100" style={{ maxWidth: 480, padding: '0 16px' }}>
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
                <FaUserShield size={22} color="#fff" />
              </div>
              <h2 className="fw-bold mb-1">Create Admin Account</h2>
              <p className="text-muted small mb-0">All fields are required</p>
            </div>

            {/* alerts */}
            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">{error}</div>
            )}
            {success && (
              <div className="alert alert-success py-2 small mb-3" role="alert">{success}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="as_name">Full Name</label>
                <input
                  id="as_name"
                  name="full_name"
                  type="text"
                  className="form-control"
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="as_email">Email</label>
                <input
                  id="as_email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="as_phone">Phone Number</label>
                <input
                  id="as_phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={10}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="as_password">Password</label>
                <div className="input-group">
                  <input
                    id="as_password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="as_confirm">Confirm Password</label>
                <div className="input-group">
                  <input
                    id="as_confirm"
                    name="confirm_password"
                    type={showConfirm ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Re-enter your password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Admin Secret Key */}
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="as_secret">Admin Secret Key</label>
                <input
                  id="as_secret"
                  name="secret_key"
                  type="password"
                  className="form-control"
                  placeholder="Enter the admin secret key"
                  value={form.secret_key}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <div className="form-text">Contact your system administrator for this key.</div>
              </div>

              <button
                type="submit"
                className="btn btn-danger w-100 py-2 fw-semibold"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Creating account…</>
                ) : (
                  <><FaUserShield className="me-2" />Create Admin Account</>
                )}
              </button>

            </form>

          </div>
        </motion.div>

        <p className="text-center text-secondary small mt-3">
          Already have an account?{' '}
          <Link to="/admin/login" className="text-light text-decoration-none">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
