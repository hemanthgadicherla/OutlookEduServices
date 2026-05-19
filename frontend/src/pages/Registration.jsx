import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { userAuthAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = {
  initial:    { opacity: 0, y: 30 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const Registration = () => {
  const navigate = useNavigate();

  const [loading,     setLoading]     = useState(false);
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState(''); // inline error from backend

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onBlur' });

  const passwordValue = watch('password', '');

  // Redirect if already logged in (safe — inside useEffect, not during render)
  useEffect(() => {
    if (getUser()) navigate('/', { replace: true });
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');

    try {
      const res = await userAuthAPI.register(
        data.email.trim().toLowerCase(),
        data.password,
        data.full_name.trim(),
        data.phone.trim()
      );

      if (!res.success) {
        // Show the exact backend message inline
        setServerError(res.message || 'Registration failed. Please try again.');
        return;
      }

      // Auto-login: store token and go home
      localStorage.setItem('userToken', res.token);
      if (res.role === 'admin') localStorage.setItem('adminToken', res.token);

      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      setServerError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <motion.div className="card border-0 shadow-lg" {...fadeUp}>
              <div className="card-body p-4 p-md-5">

                {/* header */}
                <div className="text-center mb-4">
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 56, height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#0d6efd,#6610f2)'
                    }}
                  >
                    <FaUserPlus size={22} color="#fff" />
                  </div>
                  <h2 className="fw-bold mb-1">Create Account</h2>
                  <p className="text-muted small mb-0">Sign up to get started</p>
                </div>

                {/* server-side error banner */}
                {serverError && (
                  <div className="alert alert-danger py-2 small mb-3" role="alert">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                  {/* full name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="full_name">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                      placeholder="Your full name"
                      autoComplete="name"
                      {...register('full_name', {
                        required: 'Full name is required',
                        minLength: { value: 2, message: 'At least 2 characters required' }
                      })}
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback">{errors.full_name.message}</div>
                    )}
                  </div>

                  {/* email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="reg_email">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      id="reg_email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  {/* phone */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="reg_phone">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      id="reg_phone"
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="10-digit mobile number (e.g. 9876543210)"
                      autoComplete="tel"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Enter a valid 10-digit Indian mobile number (starts with 6–9)'
                        }
                      })}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone.message}</div>
                    )}
                  </div>

                  {/* password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="reg_password">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="reg_password"
                        type={showPwd ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Minimum 6 characters"
                        autoComplete="new-password"
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
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
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password.message}</div>
                      )}
                    </div>
                  </div>

                  {/* confirm password */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="confirm_password">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="confirm_password"
                        type={showConfirm ? 'text' : 'password'}
                        className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        {...register('confirm_password', {
                          required: 'Please confirm your password',
                          validate: (val) =>
                            val === passwordValue || 'Passwords do not match'
                        })}
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
                      {errors.confirm_password && (
                        <div className="invalid-feedback">{errors.confirm_password.message}</div>
                      )}
                    </div>
                  </div>

                  {/* T&C + Privacy Policy checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        id="reg_terms"
                        type="checkbox"
                        className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                        {...register('terms', {
                          required: 'You must accept the Terms & Conditions to continue'
                        })}
                      />
                      <label className="form-check-label small" htmlFor="reg_terms">
                        I have read and agree to the{' '}
                        <Link to="/terms-and-conditions" target="_blank" className="text-primary fw-semibold">
                          Terms &amp; Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" target="_blank" className="text-primary fw-semibold">
                          Privacy Policy
                        </Link>
                        <span className="text-danger"> *</span>
                      </label>
                      {errors.terms && (
                        <div className="invalid-feedback">{errors.terms.message}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" />
                        Create Account
                      </>
                    )}
                  </button>

                </form>

                <p className="text-center text-muted small mt-4 mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none">
                    Log in
                  </Link>
                </p>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
