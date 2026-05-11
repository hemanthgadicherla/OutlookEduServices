import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { supabase } from "../services/supabase";

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
  try {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    };

    console.log("Submitting Contact Form:", payload);

    const { error } = await supabase
      .from("contact_messages")
      .insert([payload]);

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(error.message);
      return;
    }

    toast.success("Message sent successfully!");
    reset();

    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("Failed to send message.");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      details: ['+91 89770 11804'],
      color: 'text-primary'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: ['contact@outlookeduservices.com'],
      color: 'text-success'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      details: ['Unit A Floor, Ahmed Mansion, 2, Santosh Nagar Main Rd, opposite Pillar Number 60, Central Excise Colony, New Santoshnagar, Santosh Nagar, Hyderabad, Telangana 500059'],
      color: 'text-info'
    },
  ];

  const faqs = [
    {
      question: 'How do I start the application process?',
      answer: 'Contact us for a free consultation. We\'ll assess your profile and guide you through the entire process.'
    },
    {
      question: 'What documents do I need for visa application?',
      answer: 'Required documents vary by country and visa type. Generally, you\'ll need passport, photos, financial statements, and educational certificates.'
    },
    {
      question: 'How long does visa processing take?',
      answer: 'Processing times vary from 1-12 weeks depending on the country and visa type. We\'ll provide specific timelines during consultation.'
    },
    {
      question: 'Do you provide scholarship assistance?',
      answer: 'Yes, we help identify and apply for scholarships, grants, and financial aid opportunities for international students.'
    }
  ];

  return (
    <div className="contact-page py-5">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-5 py-5 px-4 rounded-4 shadow-lg"
          {...fadeInUp}
          style={{
            background: "linear-gradient(135deg, #111827, #1f2937)",
            border: "1px solid rgba(255, 215, 0, 0.15)"
          }}
        >
          <h1
            className="display-4 fw-bold mb-4"
            style={{ color: "#FFD700" }}
          >
            Contact Outlook Edu Services
          </h1>

          <p
            className="lead mx-auto"
            style={{
              maxWidth: "750px",
              color: "#d1d5db"
            }}
          >
            Connect with our expert counselors for personalized guidance on
            admissions, visas, scholarships, and global career opportunities.
            Begin your international education journey with confidence.
          </p>
        </motion.div>

        <div className="row">
          {/* Contact Form */}
          <motion.div
            className="col-lg-8 mb-5"
            {...fadeInUp}
          >
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <h3 className="card-title fw-bold mb-4">Send us a Message</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
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
                  </div>

                  <div className="row">
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

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Subject *</label>
                      <select
                        className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                        {...register('subject', { required: 'Please select a subject' })}
                      >
                        <option value="">Select a subject...</option>
                        <option value="study-abroad">Study Abroad Consultation</option>
                        <option value="visa-services">Visa Services</option>
                        <option value="courses">Course Information</option>
                        <option value="scholarships">Scholarships</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Message *</label>
                    <textarea
                      className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                      rows="5"
                      {...register('message', { required: 'Message is required' })}
                      placeholder="Tell us about your requirements..."
                    ></textarea>
                    {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="col-lg-4"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="contact-info">
              {contactInfo.map((info, index) => (
                <div key={index} className="card border-0 shadow-sm mb-4">
                  <div className="card-body text-center p-4">
                    <div className={`${info.color} mb-3`} style={{ fontSize: '2rem' }}>
                      {info.icon}
                    </div>
                    <h5 className="card-title fw-bold mb-3">{info.title}</h5>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="mb-1">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-5 py-5"
          {...fadeInUp}
        >
          <div className="text-center mb-5">
            <h2
              className="display-5 fw-bold mb-3"
              style={{ color: "#FFD700" }}
            >
              Frequently Asked Questions
            </h2>

            <p
              className="lead text-white mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Find answers to common questions about studying abroad,
              admissions, visas, scholarships, and our consultancy services.
            </p>
          </div>

          <div className="row">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="col-lg-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="card border-0 shadow-lg h-100 rounded-4"
                  style={{
                    background: "linear-gradient(135deg, #111827, #1f2937)",
                    border: "1px solid rgba(255, 215, 0, 0.15)"
                  }}
                >
                  <div className="card-body p-4">
                    <h5
                      className="fw-bold mb-3"
                      style={{ color: "#FFD700" }}
                    >
                      {faq.question}
                    </h5>

                    <p
                      className="mb-0"
                      style={{ color: "#d1d5db" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="mt-5"
          {...fadeInUp}
        >
          <div className="card border-0 shadow-lg">
            <div className="card-body p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60932.247006029866!2d78.44358199452678!3d17.35095583587202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99c54aba72ff%3A0x98459efd5767c1c8!2sOutlook%20Educational%20Services%20Private%20Limited!5e0!3m2!1sen!2sin!4v1778262012321!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;