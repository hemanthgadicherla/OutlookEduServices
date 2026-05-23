import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaCreditCard, FaLock, FaCheckCircle,
  FaExclamationTriangle, FaDownload, FaBookOpen
} from 'react-icons/fa';
import { registrationAPI, paymentAPI, courseAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = {
  initial:    { opacity: 0, y: 30 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// ── Invoice / Receipt component ──────────────────────────────────────────────
const PaymentInvoice = ({ invoiceData, onGoToCourses, onGoHome }) => {
  const {
    courseName,
    coursePrice,
    studentName,
    email,
    phone,
    razorpayPaymentId,
    razorpayOrderId,
    paidAt
  } = invoiceData;

  const invoiceNumber = `INV-${razorpayOrderId?.slice(-8).toUpperCase()}`;
  const formattedDate = new Date(paidAt).toLocaleString('en-IN', {
    day:    '2-digit',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => window.print();

  return (
    <div className="container py-5">
      <motion.div {...fadeUp}>

        {/* Success header */}
        <div className="text-center mb-4">
          <FaCheckCircle size={64} className="text-success mb-3" />
          <h2 className="fw-bold text-success mb-1">Payment Successful!</h2>
          <p className="text-muted">
            You are successfully registered for <strong>{courseName}</strong>
          </p>
        </div>

        {/* Invoice card */}
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div
              id="payment-invoice"
              className="card border-0 shadow-lg"
              style={{ borderTop: '4px solid #0A2540' }}
            >
              {/* Invoice header */}
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold mb-0" style={{ color: '#0A2540' }}>
                      Outlook Edu Services
                    </h5>
                    <small className="text-muted">Payment Receipt</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success px-3 py-2">PAID</span>
                    <div className="small text-muted mt-1">{invoiceNumber}</div>
                  </div>
                </div>
                <hr className="mt-3 mb-0" />
              </div>

              <div className="card-body px-4 py-3">

                {/* Course */}
                <div className="bg-light rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{courseName}</div>
                      <small className="text-muted">Course Enrollment</small>
                    </div>
                    <div className="fw-bold fs-5" style={{ color: '#0A2540' }}>
                      ₹{Number(coursePrice).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Student details */}
                <table className="table table-sm table-borderless mb-3">
                  <tbody>
                    <tr>
                      <td className="text-muted ps-0" style={{ width: '40%' }}>Student</td>
                      <td className="fw-semibold">{studentName}</td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0">Email</td>
                      <td className="fw-semibold">{email}</td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0">Phone</td>
                      <td className="fw-semibold">{phone}</td>
                    </tr>
                    <tr>
                      <td className="text-muted ps-0">Date</td>
                      <td className="fw-semibold">{formattedDate}</td>
                    </tr>
                  </tbody>
                </table>

                <hr />

                {/* Payment IDs */}
                <div className="small text-muted mb-1">
                  <span className="me-2">Payment ID:</span>
                  <code className="text-dark">{razorpayPaymentId}</code>
                </div>
                <div className="small text-muted mb-3">
                  <span className="me-2">Order ID:</span>
                  <code className="text-dark">{razorpayOrderId}</code>
                </div>

                {/* Total */}
                <div
                  className="d-flex justify-content-between align-items-center p-3 rounded"
                  style={{ background: '#0A2540', color: '#fff' }}
                >
                  <span className="fw-semibold">Amount Paid</span>
                  <span className="fw-bold fs-5">
                    ₹{Number(coursePrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-muted small text-center mt-3 mb-0">
                  A confirmation has been sent to <strong>{email}</strong>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2 mt-4 flex-wrap">
              <button
                className="btn btn-primary flex-fill"
                onClick={onGoToCourses}
              >
                <FaBookOpen className="me-2" />
                Go to My Courses
              </button>
              <button
                className="btn btn-outline-secondary flex-fill"
                onClick={handlePrint}
              >
                <FaDownload className="me-2" />
                Save / Print
              </button>
            </div>
            <button
              className="btn btn-link text-muted w-100 mt-2"
              onClick={onGoHome}
            >
              Back to Home
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const CourseRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const [courses, setCourses]           = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading]       = useState(false);
  const [invoiceData, setInvoiceData]   = useState(null); // null = not paid yet
  const [paymentError, setPaymentError] = useState('');

  // Prevent double-click / double-submit
  const isProcessingRef = useRef(false);

  const user = getUser();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // ── guard: must be logged in ─────────────────────────────────
  useEffect(() => {
    if (!user) {
      const courseId = searchParams.get('course');
      const returnTo = courseId
        ? `/course_registration?course=${courseId}`
        : '/course_registration';
      navigate(`/login?redirect=${encodeURIComponent(returnTo)}`, { replace: true });
    }
  }, []);

  // ── dynamically load Razorpay SDK only on this page ──────────
  useEffect(() => {
    if (window.Razorpay) return;
    const script = document.createElement('script');
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onerror = () => toast.error('Failed to load payment gateway. Please refresh.');
    document.body.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
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

  // ── open Razorpay checkout ────────────────────────────────────
  const openRazorpayCheckout = (orderData, formData, registrationId) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded. Please refresh the page.'));
        return;
      }

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    orderData.currency,
        order_id:    orderData.id,
        name:        'Outlook Edu Services',
        description: `Enrollment: ${selectedCourse?.title || formData.selected_course}`,
        image:       '/vite.svg',
        prefill: {
          name:    formData.full_name,
          email:   formData.email,
          contact: formData.phone
        },
        theme: { color: '#0A2540' },
        modal: {
          ondismiss: () => resolve({ cancelled: true })
        },
        handler: async (response) => {
          try {
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              registrationId
            });
            resolve({
              cancelled: false,
              verifyRes,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId:   response.razorpay_order_id
            });
          } catch (err) {
            reject(err);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        resolve({
          cancelled: false,
          failed:    true,
          error:     response.error?.description || 'Payment failed'
        });
      });
      rzp.open();
    });
  };

  // ── main submit handler ───────────────────────────────────────
  const onSubmit = async (data) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setIsLoading(true);
    setPaymentError('');

    try {
      const course     = selectedCourse || courses.find(c => c.title === data.selected_course);
      const courseName = course?.title || data.selected_course;

      // Step 1: Create or retrieve registration
      const regRes = await registrationAPI.createRegistration({
        full_name:       data.full_name,
        email:           data.email,
        phone:           data.phone,
        course_id:       course?.id   || undefined,
        selected_course: courseName,
        country:         data.country || '',
        message:         data.message || '',
        user_id:         user?.id     || undefined
      });

      if (!regRes.success) {
        toast.error(regRes.message || 'Registration failed. Please try again.');
        return;
      }

      const registrationId = regRes.data.id;

      // Step 2: Create Razorpay order (amount resolved server-side)
      const orderRes = await paymentAPI.createOrder(registrationId);
      if (!orderRes.success) {
        toast.error(orderRes.message || 'Could not initiate payment. Please try again.');
        return;
      }

      // Step 3: Open Razorpay checkout
      const result = await openRazorpayCheckout(orderRes.order, data, registrationId);

      if (result.cancelled) {
        toast.info('Payment cancelled. Your registration is saved — you can complete payment anytime.');
        return;
      }

      if (result.failed) {
        setPaymentError(result.error || 'Payment failed. Please try again.');
        toast.error('Payment failed. Please try again or use a different payment method.');
        return;
      }

      // Step 4: Show invoice on success
      const { verifyRes, razorpayPaymentId, razorpayOrderId } = result;

      if (verifyRes?.success) {
        setInvoiceData({
          courseName,
          coursePrice:      course?.price || orderRes.order.amount / 100,
          studentName:      data.full_name,
          email:            data.email,
          phone:            data.phone,
          razorpayPaymentId,
          razorpayOrderId,
          paidAt:           new Date().toISOString()
        });
        toast.success(`Successfully registered for ${courseName}!`);
      } else {
        setPaymentError('Payment verification failed. Please contact support with your payment ID.');
        toast.error(verifyRes?.message || 'Verification failed. Contact support.');
      }

    } catch (err) {
      console.error('Payment flow error:', err);
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  // ── show invoice after successful payment ─────────────────────
  if (invoiceData) {
    return (
      <PaymentInvoice
        invoiceData={invoiceData}
        onGoToCourses={() => navigate('/lms')}
        onGoHome={() => navigate('/')}
      />
    );
  }

  if (!user) return null;

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
            <motion.div
              className="card border-0 shadow-lg"
              {...fadeUp}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="card-body p-4 p-md-5">

                {/* selected course banner */}
                {selectedCourse && (
                  <div className="alert alert-primary d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div className="fw-bold">{selectedCourse.title}</div>
                      <div className="small">₹{Number(selectedCourse.price).toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedCourse(null)}
                      disabled={isLoading}
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* payment error banner */}
                {paymentError && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                    <FaExclamationTriangle className="flex-shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_name">Full Name *</label>
                      <input
                        id="cr_name"
                        type="text"
                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                        {...register('full_name', { required: 'Full name is required' })}
                      />
                      {errors.full_name && (
                        <div className="invalid-feedback">{errors.full_name.message}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_phone">Phone Number *</label>
                      <input
                        id="cr_phone"
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="10-digit mobile number"
                        disabled={isLoading}
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value:   /^[6-9]\d{9}$/,
                            message: 'Enter a valid 10-digit Indian mobile number'
                          }
                        })}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone.message}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="cr_email">Email Address *</label>
                    <input
                      id="cr_email"
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      disabled={isLoading}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address'
                        }
                      })}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>

                  {!selectedCourse && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="cr_course">Select Course *</label>
                      <select
                        id="cr_course"
                        className={`form-select ${errors.selected_course ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                        {...register('selected_course', { required: 'Please select a course' })}
                        onChange={(e) => {
                          const found = courses.find(c => c.title === e.target.value);
                          setSelectedCourse(found || null);
                        }}
                      >
                        <option value="">Choose a course...</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.title}>
                            {c.title} — ₹{Number(c.price).toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                      {errors.selected_course && (
                        <div className="invalid-feedback">{errors.selected_course.message}</div>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="cr_country">Country</label>
                    <select
                      id="cr_country"
                      className="form-select"
                      disabled={isLoading}
                      {...register('country')}
                    >
                      <option value="">Select your country...</option>
                      {['India','USA','UK','Canada','Australia','Germany','UAE','Singapore','Other'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="cr_message">Message (Optional)</label>
                    <textarea
                      id="cr_message"
                      className="form-control"
                      rows="2"
                      placeholder="Any questions or additional info..."
                      disabled={isLoading}
                      {...register('message')}
                    />
                  </div>

                  <div className="d-flex align-items-center gap-2 text-muted small mb-3 p-3 bg-light rounded border">
                    <FaLock className="text-success flex-shrink-0" />
                    <span>Payments are processed securely via Razorpay. We never store your card details.</span>
                  </div>

                  {/* T&C + Privacy Policy checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        id="cr_terms"
                        type="checkbox"
                        className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                        disabled={isLoading}
                        {...register('terms', {
                          required: 'You must accept the Terms & Conditions to proceed'
                        })}
                      />
                      <label className="form-check-label small" htmlFor="cr_terms">
                        I have read and agree to the{' '}
                        <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary fw-semibold">
                          Terms &amp; Conditions
                        </a>{' '}
                        and{' '}
                        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary fw-semibold">
                          Privacy Policy
                        </a>
                        <span className="text-danger"> *</span>
                      </label>
                      {errors.terms && (
                        <div className="invalid-feedback d-block">{errors.terms.message}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" />
                        Proceed to Payment
                        {selectedCourse && (
                          <span className="ms-2 badge bg-light text-dark">
                            ₹{Number(selectedCourse.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </>
                    )}
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
