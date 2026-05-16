import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { registrationAPI, paymentAPI, courseAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const CourseRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const [courses, setCourses]               = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [success, setSuccess]               = useState(false);

  const user = getUser(); // { id, email, full_name, role }

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // ── guard: must be logged in ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      const courseId = searchParams.get('course');
      const returnTo = courseId ? `/course_registration?course=${courseId}` : '/course_registration';
      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`, { replace: true });
    }
  }, []);

  // ── load courses ─────────────────────────────────────────────
  useEffect(() => {
    courseAPI.getCourses()
      .then((res) => { if (res.success) setCourses(res.data || []); })
      .catch(console.error);
  }, []);

  // ── pre-select course from ?course=id ────────────────────────
  useEffect(() => {
    if (!courses.length) return;
    const courseId = searchParams.get('course');
    if (courseId) {
      const found = courses.find(c => c.id === parseInt(courseId));
      if (found) setSelectedCourse(found);
    }
  }, [courses, searchParams]);

  // ── pre-fill name + email from JWT ───────────────────────────
  useEffect(() => {
    if (user) {
      setValue('full_name', user.full_name || '');
      setValue('email',     user.email     || '');
    }
  }, [user]);

  // ── submit ───────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const course      = selectedCourse || courses.find(c => c.title === data.selected_course);
      const courseName  = course?.title || data.selected_course;
      const coursePrice = Number(course?.price) || 10000;

      // 1. create registration
      const regRes = await registrationAPI.createRegistration({
        full_name:       data.full_name,
        email:           data.email,
        phone:           data.phone,
        course_id:       course?.id || undefined,
        selected_course: courseName,
        country:         data.country || '',
        message:         data.message || '',
        user_id:         user?.id    || undefined
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
          const verifyRes = await paymentAPI.verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
            registrationId
          });
          if (verifyRes.success) {
            setSuccess(true);
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: data.full_name, email: data.email, contact: data.phone },
        theme: { color: '#0A2540' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── success screen ───────────────────────────────────────────
  if (success) {
    return (
      <div className="container py-5">
        <motion.div className="text-center" {...fadeUp}>
          <FaCheckCircle size={80} className="text-success mb-4" />
          <h2 className="display-5 fw-bold text-success mb-3">Payment Successful!</h2>
          <p className="lead mb-2">Your course registration is complete.</p>
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

  if (!user) return null; // redirecting

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">

        <motion.div className="text-center mb-4" {...fadeUp}>
          <h1 className="display-5 fw-bold mb-1">Course Registration</h1>
          <p className="text-muted">
            Welcome{user.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! Complete your enrollment below.
          </p>
        </motion.div>

        <div className="row justify-content-center">
          <div className="col-lg-7">
            <motion.div className="card border-0 shadow-lg" {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="card-body p-4 p-md-5">

                {/* selected course banner */}
                {selectedCourse && (
                  <div className="alert alert-primary d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div className="fw-bold">{selectedCourse.title}</div>
                      <div className="small">₹{Number(selectedCourse.price).toLocaleString()}</div>
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

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                  <div className="row">
                    {/* full name */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_name">Full Name *</label>
                      <input
                        id="cr_name"
                        type="text"
                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                        {...register('full_name', { required: 'Full name is required' })}
                      />
                      {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                    </div>

                    {/* phone */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_phone">Phone Number *</label>
                      <input
                        id="cr_phone"
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="10-digit mobile number"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' }
                        })}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>
                  </div>

                  {/* email — pre-filled, editable */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="cr_email">Email Address *</label>
                    <input
                      id="cr_email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
                      })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  {/* course selector — shown when no course pre-selected */}
                  {!selectedCourse && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_course">Select Course *</label>
                      <select
                        id="cr_course"
                        className={`form-select ${errors.selected_course ? 'is-invalid' : ''}`}
                        {...register('selected_course', { required: 'Please select a course' })}
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
                      {errors.selected_course && <div className="invalid-feedback">{errors.selected_course.message}</div>}
                    </div>
                  )}

                  {/* country */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="cr_country">Country</label>
                    <select id="cr_country" className="form-select" {...register('country')}>
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
                      {...register('message')}
                    />
                  </div>

                  {/* secure note */}
                  <div className="d-flex align-items-center gap-2 text-muted small mb-4 p-3 bg-light rounded border">
                    <FaLock className="text-success flex-shrink-0" />
                    <span>Payments are processed securely via Razorpay. We never store your card details.</span>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                    {isLoading
                      ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Processing...</>
                      : <><FaCreditCard className="me-2" />Proceed to Payment</>}
                  </button>
                </form>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
