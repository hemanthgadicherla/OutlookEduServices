import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPassport, FaClock, FaCheckCircle, FaFileAlt } from 'react-icons/fa';

const VisitVisa = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const visaTypes = [
    {
      type: 'Tourist Visa',
      description: 'For leisure travel, sightseeing, and short visits.',
      duration: '30-90 days',
      processing: '2-4 weeks',
      validity: '6 months to 1 year',
      icon: <FaPassport />
    },
    {
      type: 'Business Visa',
      description: 'For business meetings, conferences, and short-term work.',
      duration: '30-90 days',
      processing: '1-3 weeks',
      validity: '3-6 months',
      icon: <FaFileAlt />
    },
    {
      type: 'Student Visa',
      description: 'For pursuing education and academic programs abroad.',
      duration: 'Course duration',
      processing: '4-8 weeks',
      validity: '1-5 years',
      icon: <FaCheckCircle />
    },
    {
      type: 'Work Visa',
      description: 'For employment and long-term professional opportunities.',
      duration: '1-5 years',
      processing: '6-12 weeks',
      validity: '2-10 years',
      icon: <FaClock />
    }
  ];

  const countries = [
    { name: 'USA', flag: '🇺🇸', processingTime: '2-4 weeks', successRate: '95%' },
    { name: 'UK', flag: '🇬🇧', processingTime: '3-5 weeks', successRate: '92%' },
    { name: 'Canada', flag: '🇨🇦', processingTime: '2-6 weeks', successRate: '94%' },
    { name: 'Australia', flag: '🇦🇺', processingTime: '4-8 weeks', successRate: '91%' },
    { name: 'New Zealand', flag: '🇳🇿', processingTime: '2-4 weeks', successRate: '96%' },
    { name: 'Ireland', flag: '🇮🇪', processingTime: '1-2 weeks', successRate: '98%' },
    { name: 'Europe', flag: '🇪🇺', processingTime: '1-2 weeks', successRate: '93%' }
  ];

  const process = [
    'Document verification and preparation',
    'Application form completion',
    'Biometric data submission',
    'Embassy interview scheduling',
    'Visa fee payment',
    'Collection and travel planning'
  ];

  return (
    <div className="visit-visa-page">
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <div className="container">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-4">Visa Services</h1>
            <p className="lead text-black mb-4">
              Expert visa assistance for all your international travel needs.
              From tourist visas to work permits, we've got you covered.
            </p>
            <Link to="/contact" className="btn btn-dark btn-lg">
              Get Visa Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Visa Types */}
      <section className="py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Visa Categories</h2>
            <p className="lead text-muted">Comprehensive visa services for every need</p>
          </motion.div>

          <div className="row">
            {visaTypes.map((visa, index) => (
              <motion.div
                key={index}
                className="col-lg-3 col-md-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body text-center p-4">
                    <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                      {visa.icon}
                    </div>
                    <h5 className="card-title fw-bold mb-3">{visa.type}</h5>
                    <p className="card-text text-muted mb-3">{visa.description}</p>

                    <div className="visa-details">
                      <div className="mb-2">
                        <small className="text-muted d-block">Stay Duration</small>
                        <strong>{visa.duration}</strong>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted d-block">Processing Time</small>
                        <strong>{visa.processing}</strong>
                      </div>
                      <div className="mb-3">
                        <small className="text-muted d-block">Validity</small>
                        <strong>{visa.validity}</strong>
                      </div>
                    </div>

                    <Link to="/contact" className="btn btn-primary">
                      Apply Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="bg-light py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Popular Destinations</h2>
            <p className="lead text-muted">Visa processing times and success rates</p>
          </motion.div>

          <div className="row">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                className="col-lg-4 col-md-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="country-flag mb-3" style={{ fontSize: '3rem' }}>
                      {country.flag}
                    </div>
                    <h5 className="card-title fw-bold mb-3">{country.name}</h5>

                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted d-block">Processing</small>
                        <strong className="text-primary">{country.processingTime}</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Success Rate</small>
                        <strong className="text-success">{country.successRate}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <motion.div
              className="col-lg-6"
              {...fadeInUp}
            >
              <h2 className="display-5 fw-bold mb-4">Our Process</h2>
              <p className="lead mb-4">
                Streamlined visa application process with expert guidance at every step.
              </p>

              <div className="process-list">
                {process.map((step, index) => (
                  <motion.div
                    key={index}
                    className="d-flex align-items-start mb-3"
                    {...fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="process-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1"
                         style={{ width: '30px', height: '30px', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0 }}>
                      {index + 1}
                    </div>
                    <p className="mb-0">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="col-lg-6"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3"
                alt="Visa processing"
                className="img-fluid rounded shadow"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h2 className="display-5 fw-bold mb-3">Start Your Visa Application</h2>
            <p className="lead mb-4">
              Get expert assistance with your visa application. Our success rate speaks for itself.
            </p>
            <Link to="/contact" className="btn btn-light btn-lg">
              Free Visa Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VisitVisa;