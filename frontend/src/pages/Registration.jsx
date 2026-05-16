import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaCheckCircle, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { registrationAPI, paymentAPI, userAuthAPI, courseAPI } from '../services/api';

// ─── helpers ────────────────────────────────────────────────────
const getToken  = () => localStorage.getItem('userToken');
const parseJwt  = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
};

const fadeUp = {
  initial:   { opacity: 0, y: 40 },
  animate:   { opacity: 1, y: 0 },
  exit:      { opacity: 0, y: -20 },
  transition:{ duration: 0.4 }
};

// ────────────────────────────────────────────────────────────────

const Registration = () => {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  // which panel is active: 'signup' | 'course-registration' | 'success'
  const [view, setView]               = useState('loading');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses]         = useState([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // { id, email, full_name }

  const signupForm = useForm();
  const regForm    = useForm();

  // ── on mount: decide which view to show ──────────────────────
  useEffect(() => {
    const init = async () => {
      // 1. load courses from backend
      try {
        const res = await courseAPI.getCourses();
        if (res.success) setCourses(res.data);
      } catch { /* non-fatal */ }

      // 2. check if user is already logged in
      const token = getToken();
      if (token) {
        const payload = parseJwt(token);
        if (payload && payload.exp * 1000 > Date.now()) {
          setLoggedInUser({ id: payload.id, email: payload.email, full_name: payload.full_name || '' });
          setView('course-registration');
          return;
        }
        // expired token — clear it
        localStorage.removeItem('userToken');
      }

      setView('signup');
    };
    init();
  }, []);

  // ── pre-select course from ?course=id query param ────────────
  useEffect(() => {
    if (!courses.length) return;
    const courseId = searchParams.get('course');
    if (courseId) {
      const found = courses.find(c => c.id === parseInt(courseId));
      if (found) setSelectedCourse(found);
    }
  }, [courses, searchParams]);

  // ── pre-fill reg form when user is known ─────────────────────
  useEffect(() => {
    if (loggedInUser && view === 'course-registration') {
      regForm.setValue('full_name', loggedInUser.full_name || '');
      regForm.setValue('email',     loggedInUser.email     || '');
    }
  }, [loggedInUser, view]);

  // ════════════════════════════════════════════════════════════
  // SIGN UP HANDLER
  // ════════════════════════════════════════════════════════════
  const handleSignup = async (data) => {
    setIsLoading(true);
    try {
      const res = await userAuthAPI.register(
        data.email.trim().toLowerCase(),
        data.password,
        data.full_name.trim(),
        data.phone.trim()
      );

      if (!res.success) {
        toast.error(res.message || 'Sign up failed');
        return;
      }

      // store token and move to course registration
      localStorage.setItem('userToken', res.token);
      const payload = parseJwt(res.token);
      setLoggedInUser({
        id:        payload?.id    || '',
        email:     data.email.trim().toLowerCase(),
        full_name: data.full_name.trim()
      });
      toast.success('Account created! Now register for a course.');
      setView('course-registration');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════
  // COURSE REGISTRATION + PAYMENT HANDLER
  // ════════════════════════════════════════════════════════════
  const handleCourseRegistration = async (data) => {
    setIsLoading(true);
    try {
      const course      = selectedCourse || courses.find(c => c.title === data.selected_course);
      const courseName  = course?.title || data.selected_course;
      const coursePrice = course?.price || 10000;

      // 1. create registration
      const regRes = await registrationAPI.createRegistration({
        full_name:       data.full_name,
        email:           data.email,
        phone:           data.phone,
        course_id:       course?.id   || undefined,
        selected_course: courseName,
        country:         data.country || '',
        message:         data.message || '',
        user_id:         loggedInUser?.id || undefined
      });

      if (!regRes.success) {
        toast.error(regRes.message || 'Registration failed');
        return;
      }

      const registrationId = regRes.data.id;

      // 2. create Razorpay order
      const orderRes = await paymentAPI.createOrder(coursePrice, registrationId);
      if (!orderRes.success) {
        toast.error('Failed to initiate payment. Please try again.');
        return;
      }

      // 3. open Razorpay checkout
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      orderRes.order.amount,
        currency:    orderRes.order.currency,
        order_id:    orderRes.order.id,
        name:        'EduConsult',
        description: `Payment for ${courseName}`,
        handler: async (response) => {
          // 4. verify payment
          const verifyRes = await paymentAPI.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
            registrationId
          });

          if (verifyRes.success) {
            setView('success');
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name:    data.full_name,
          email:   data.email,
          contact: data.phone
        },
        theme: { color: '#0A2540' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════
  // RENDER — loading skeleton
  // ════════════════════════════════════════════════════════════
  if (view === 'loading') {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // RENDER — success screen
  // ════════════════════════════════════════════════════════════
  if (view === 'success') {
    return (
      <div className="container py-5">
        <motion.div className="text-center" {...fadeUp}>
          <FaCheckCircle size={80} className="text-success mb-4" />
          <h2 className="display-5 fw-bold text-success mb-3">Payment Successful!</h2>
          <p className="lead mb-2">Your registration is complete.</p>
          <p className="text-muted mb-4">You will receive a confirmation email shortly.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/lms')}>
              Go to My Courses
            </button>
            <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // RENDER — main card (signup OR course registration)
  // ════════════════════════════════════════════════════════════
  return (
    <div className="registration-page py-5 bg-light">
      <div className="container">

        {/* ── step indicator ── */}
        <motion.div className="text-center mb-4" {...fadeUp}>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            {/* step 1 */}
            <div className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold small
              ${view === 'signup' ? 'bg-primary text-white' : 'bg-success text-white'}`}>
              <FaUserPlus />
              <span>1. Create Account</span>
            </div>

            <div className="text-muted">→</div>

            {/* step 2 */}
            <div className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-semibold small
              ${view === 'course-registration' ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>
              <FaCreditCard />
              <span>2. Register &amp; Pay</span>
            </div>
          </div>

          <h1 className="display-5 fw-bold mb-1">
            {view === 'signup' ? 'Create Your Account' : 'Course Registration'}
          </h1>
          <p className="text-muted">
            {view === 'signup'
              ? 'Sign up first, then choose your course and pay securely.'
              : `Welcome${loggedInUser?.full_name ? `, ${loggedInUser.full_name.split(' ')[0]}` : ''}! Select a course and complete your enrollment.`}
          </p>
        </motion.div>

        <div className="row justify-content-center">
          <div className="col-lg-7">
            <AnimatePresence mode="wait">

              {/* ══════════════════════════════════════════════
                  PANEL A — SIGN UP
              ══════════════════════════════════════════════ */}
              {view === 'signup' && (
                <motion.div key="signup" className="card border-0 shadow-lg" {...fadeUp}>
                  <div className="card-body p-4 p-md-5">

                    <form onSubmit={signupForm.handleSubmit(handleSignup)} noValidate>

                      {/* full name */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="su_full_name">Full Name *</label>
                        <input
                          id="su_full_name"
                          type="text"
                          className={`form-control ${signupForm.formState.errors.full_name ? 'is-invalid' : ''}`}
                          placeholder="Your full name"
                          autoComplete="name"
                          {...signupForm.register('full_name', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                        />
                        {signupForm.formState.errors.full_name && (
                          <div className="invalid-feedback">{signupForm.formState.errors.full_name.message}</div>
                        )}
                      </div>

                      {/* email */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="su_email">Email Address *</label>
                        <input
                          id="su_email"
                          type="email"
                          className={`form-control ${signupForm.formState.errors.email ? 'is-invalid' : ''}`}
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...signupForm.register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                          })}
                        />
                        {signupForm.formState.errors.email && (
                          <div className="invalid-feedback">{signupForm.formState.errors.email.message}</div>
                        )}
                      </div>

                      {/* phone */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="su_phone">Phone Number *</label>
                        <input
                          id="su_phone"
                          type="tel"
                          className={`form-control ${signupForm.formState.errors.phone ? 'is-invalid' : ''}`}
                          placeholder="10-digit mobile number"
                          autoComplete="tel"
                          {...signupForm.register('phone', {
                            required: 'Phone number is required',
                            pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian number' }
                          })}
                        />
                        {signupForm.formState.errors.phone && (
                          <div className="invalid-feedback">{signupForm.formState.errors.phone.message}</div>
                        )}
                      </div>

                      {/* password */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold" htmlFor="su_password">Password *</label>
                        <input
                          id="su_password"
                          type="password"
                          className={`form-control ${signupForm.formState.errors.password ? 'is-invalid' : ''}`}
                          placeholder="Minimum 6 characters"
                          autoComplete="new-password"
                          {...signupForm.register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'At least 6 characters' }
                          })}
                        />
                        {signupForm.formState.errors.password && (
                          <div className="invalid-feedback">{signupForm.formState.errors.password.message}</div>
                        )}
                      </div>

                      <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                        {isLoading
                          ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Creating account...</>
                          : <><FaUserPlus className="me-2" />Create Account &amp; Continue</>}
                      </button>
                    </form>

                    <hr className="my-4" />

                    <p className="text-center text-muted mb-0 small">
                      Already have an account?{' '}
                      <Link to="/login" className="fw-semibold">
                        <FaSignInAlt className="me-1" />Log in
                      </Link>
                      {' '}and come back here to register.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ══════════════════════════════════════════════
                  PANEL B — COURSE REGISTRATION
              ══════════════════════════════════════════════ */}
              {view === 'course-registration' && (
                <motion.div key="course-reg" className="card border-0 shadow-lg" {...fadeUp}>
                  <div className="card-body p-4 p-md-5">

                    {/* selected course banner */}
                    {selectedCourse && (
                      <div className="alert alert-primary d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <div className="fw-bold">{selectedCourse.title}</div>
                          <div className="small">₹{selectedCourse.price.toLocaleString()}</div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedCourse(null)}
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <form onSubmit={regForm.handleSubmit(handleCourseRegistration)} noValidate>

                      <div className="row">
                        {/* full name */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold" htmlFor="cr_full_name">Full Name *</label>
                          <input
                            id="cr_full_name"
                            type="text"
                            className={`form-control ${regForm.formState.errors.full_name ? 'is-invalid' : ''}`}
                            placeholder="Your full name"
                            {...regForm.register('full_name', { required: 'Full name is required' })}
                          />
                          {regForm.formState.errors.full_name && (
                            <div className="invalid-feedback">{regForm.formState.errors.full_name.message}</div>
                          )}
                        </div>

                        {/* phone */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold" htmlFor="cr_phone">Phone Number *</label>
                          <input
                            id="cr_phone"
                            type="tel"
                            className={`form-control ${regForm.formState.errors.phone ? 'is-invalid' : ''}`}
                            placeholder="10-digit mobile number"
                            {...regForm.register('phone', {
                              required: 'Phone number is required',
                              pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' }
                            })}
                          />
                          {regForm.formState.errors.phone && (
                            <div className="invalid-feedback">{regForm.formState.errors.phone.message}</div>
                          )}
                        </div>
                      </div>

                      {/* email */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="cr_email">Email Address *</label>
                        <input
                          id="cr_email"
                          type="email"
                          className={`form-control ${regForm.formState.errors.email ? 'is-invalid' : ''}`}
                          placeholder="you@example.com"
                          {...regForm.register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                          })}
                        />
                        {regForm.formState.errors.email && (
                          <div className="invalid-feedback">{regForm.formState.errors.email.message}</div>
                        )}
                      </div>

                      {/* course selector — only shown if no course pre-selected */}
                      {!selectedCourse && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold" htmlFor="cr_course">Select Course *</label>
                          <select
                            id="cr_course"
                            className={`form-select ${regForm.formState.errors.selected_course ? 'is-invalid' : ''}`}
                            {...regForm.register('selected_course', { required: 'Please select a course' })}
                            onChange={(e) => {
                              const found = courses.find(c => c.title === e.target.value);
                              setSelectedCourse(found || null);
                            }}
                          >
                            <option value="">Choose a course...</option>
                            {courses.map(c => (
                              <option key={c.id} value={c.title}>
                                {c.title} — ₹{Number(c.price).toLocaleString()}
                              </option>
                            ))}
                          </select>
                          {regForm.formState.errors.selected_course && (
                            <div className="invalid-feedback">{regForm.formState.errors.selected_course.message}</div>
                          )}
                        </div>
                      )}

                      {/* country */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold" htmlFor="cr_country">Country</label>
                        <select id="cr_country" className="form-select" {...regForm.register('country')}>
                          <option value="">Select your country...</option>
                          {['India','USA','UK','Canada','Australia','Germany','UAE','Singapore','Other'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* message */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold" htmlFor="cr_message">Message (Optional)</label>
                        <textarea
                          id="cr_message"
                          className="form-control"
                          rows="2"
                          placeholder="Any questions or additional info..."
                          {...regForm.register('message')}
                        />
                      </div>

                      {/* secure payment note */}
                      <div className="d-flex align-items-center gap-2 text-muted small mb-4 p-3 bg-light rounded">
                        <FaLock className="text-success flex-shrink-0" />
                        <span>Payments are processed securely via Razorpay. We never store your card details.</span>
                      </div>

                      <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                        {isLoading
                          ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Processing...</>
                          : <><FaCreditCard className="me-2" />Proceed to Payment</>}
                      </button>
                    </form>

                    {/* not you? */}
                    <p className="text-center text-muted small mt-3 mb-0">
                      Not you?{' '}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        onClick={() => {
                          localStorage.removeItem('userToken');
                          setLoggedInUser(null);
                          setView('signup');
                        }}
                      >
                        Sign out and use a different account
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
