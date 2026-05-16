import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await userAuthAPI.register(
        form.email.trim().toLowerCase(),
        form.password,
        form.full_name.trim(),
        form.phone.trim()
      );

      if (!response.success) {
        setError(response.message || 'Registration failed');
        return;
      }

      localStorage.setItem('userToken', response.token);
      navigate(response.redirect || '/');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await userAuthAPI.getGoogleOAuthUrl();
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError('Could not initiate Google sign up. Please try again.');
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
            <h2 className="text-center mb-4">Create Account</h2>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup}>
              {/* FULL NAME */}
              <div className="mb-3">
                <label htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              {/* PHONE */}
              <div className="mb-3">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="[6-9][0-9]{9}"
                  title="Enter a valid 10-digit Indian mobile number"
                  autoComplete="tel"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-3">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="text-center my-3">
              <span className="text-muted">OR</span>
            </div>

            {/* GOOGLE SIGNUP */}
            <button
              type="button"
              className="btn btn-danger w-100"
              onClick={handleGoogleSignup}
            >
              Continue with Google
            </button>

            {/* LOGIN LINK */}
            <p className="text-center mt-3">
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
