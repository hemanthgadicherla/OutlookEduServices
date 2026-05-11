import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { supabase } from "../services/supabase";

const Registration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const courses = [
    { id: 1, title: 'Digital Marketing Mastery', price: 25000 },
    { id: 2, title: 'SAP FICO Certification', price: 35000 },
    { id: 3, title: 'IELTS Preparation', price: 15000 },
    { id: 4, title: 'Data Science Fundamentals', price: 45000 },
    { id: 5, title: 'Business English', price: 20000 },
    { id: 6, title: 'Web Development Bootcamp', price: 40000 }
  ];

  useEffect(() => {
    const courseId = searchParams.get('course');
    if (courseId) {
      const course = courses.find(c => c.id === parseInt(courseId));
      setSelectedCourse(course);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create registration in database
      const registrationData = {
        ...data,
        selected_course: selectedCourse?.title || data.selected_course,
        payment_status: 'pending'
      };

      const { data: registration, error } =
        await supabase
        .from("registrations")
        .insert([
       {
          name: data.full_name,
          email: data.email,
          phone: data.phone,

          course_name:
            selectedCourse?.title
            || data.selected_course,

          amount:
            selectedCourse?.price
            || 10000,

          payment_status: "pending",
        },
      ])
      .select()
      .single();

  if (error) {

    console.log(error);

    toast.error("Registration failed");

  return;
}

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: (selectedCourse?.price || 10000) * 100,
        currency: "INR",
        name: 'EduConsult',
        description: `Payment for ${selectedCourse?.title || data.selected_course}`,
        handler: async (response) => {
          // Verify payment
          await supabase
            .from("registrations")
            .update({
            payment_status: "completed",
            payment_id: response.razorpay_payment_id,
          })
        .eq("id", registration.id);

          setPaymentSuccess(true);
          toast.success('Payment successful! Registration complete.');
        },
        prefill: {
          name: data.full_name,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: '#0A2540'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (paymentSuccess) {
    return (
      <div className="container py-5">
        <motion.div
          className="text-center"
          {...fadeInUp}
        >
          <FaCheckCircle size={80} className="text-success mb-4" />
          <h2 className="display-5 fw-bold text-success mb-3">Payment Successful!</h2>
          <p className="lead mb-4">
            Your registration has been completed successfully. You will receive a confirmation email shortly.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="registration-page py-5 bg-light">
      <div className="container">
        <motion.div
          className="text-center mb-5"
          {...fadeInUp}
        >
          <h1 className="display-4 fw-bold mb-3">Course Registration</h1>
          <p className="lead text-muted">
            Fill out the form below to enroll in your selected course
          </p>
        </motion.div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div
              className="card border-0 shadow-lg"
              {...fadeInUp}
            >
              <div className="card-body p-5">
                {selectedCourse && (
                  <div className="selected-course bg-primary text-white p-3 rounded mb-4">
                    <h5 className="mb-2">Selected Course: {selectedCourse.title}</h5>
                    <p className="mb-0">Price: ₹{selectedCourse.price.toLocaleString()}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                        {...register('full_name', { required: 'Full name is required' })}
                        placeholder="Enter your full name"
                      />
                      {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Phone Number *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[6-9]\d{9}$/,
                            message: 'Please enter a valid 10-digit phone number'
                          }
                        })}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </div>

                  {!selectedCourse && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Select Course *</label>
                      <select
                        className={`form-select ${errors.selected_course ? 'is-invalid' : ''}`}
                        {...register('selected_course', { required: 'Please select a course' })}
                      >
                        <option value="">Choose a course...</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.title}>
                            {course.title} - ₹{course.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                      {errors.selected_course && <div className="invalid-feedback">{errors.selected_course.message}</div>}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold">Country</label>
                    <select
                      className="form-select"
                      {...register('country')}
                    >
                      <option value="">Select your country...</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Message (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register('message')}
                      placeholder="Any additional information or questions..."
                    ></textarea>
                  </div>

                  <div className="payment-info bg-light p-3 rounded mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaLock className="text-success me-2" />
                      <span className="fw-bold">Secure Payment</span>
                    </div>
                    <p className="text-muted small mb-0">
                      Your payment information is encrypted and secure. We use Razorpay for safe transactions.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard className="me-2" />
                        Proceed to Payment
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

export default Registration;