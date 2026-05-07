import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUniversity, FaGraduationCap, FaPlane } from 'react-icons/fa';

const StudyAbroad = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const countries = [
    {
      name: 'USA',
      flag: '🇺🇸',
      description: 'World-renowned universities with diverse programs and research opportunities.',
      universities: '4000+',
      popularCourses: 'Engineering, Business, Computer Science',
      avgCost: '$30,000-50,000/year',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3'
    },
    {
      name: 'UK',
      flag: '🇬🇧',
      description: 'Historic institutions with shorter course durations and global recognition.',
      universities: '160+',
      popularCourses: 'Business, Arts, Engineering',
      avgCost: '£15,000-25,000/year',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3'
    },
    {
      name: 'Canada',
      flag: '🇨🇦',
      description: 'Affordable education with post-study work opportunities and immigration pathways.',
      universities: '100+',
      popularCourses: 'Engineering, Healthcare, Business',
      avgCost: 'CAD $20,000-35,000/year',
      image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3'
    },
    {
      name: 'Australia',
      flag: '🇦🇺',
      description: 'High-quality education with excellent research facilities and work opportunities.',
      universities: '40+',
      popularCourses: 'Engineering, Medicine, Business',
      avgCost: 'AUD $25,000-40,000/year',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3'
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      description: 'Tuition-free or low-cost education with strong engineering and technical programs.',
      universities: '400+',
      popularCourses: 'Engineering, Sciences, Business',
      avgCost: '€0-500/semester',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3'
    },
    {
      name: 'Netherlands',
      flag: '🇳🇱',
      description: 'Internationally-oriented programs taught in English with innovative teaching methods.',
      universities: '60+',
      popularCourses: 'Business, Engineering, Social Sciences',
      avgCost: '€8,000-20,000/year',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Choose Your Destination',
      description: 'Research countries, universities, and programs that align with your goals.',
      icon: <FaMapMarkerAlt />
    },
    {
      step: 2,
      title: 'University Selection',
      description: 'Get personalized recommendations based on your profile and preferences.',
      icon: <FaUniversity />
    },
    {
      step: 3,
      title: 'Application Process',
      description: 'Complete documentation, SOP writing, and application submission assistance.',
      icon: <FaGraduationCap />
    },
    {
      step: 4,
      title: 'Visa & Departure',
      description: 'Visa application guidance and pre-departure orientation.',
      icon: <FaPlane />
    }
  ];

  return (
    <div className="study-abroad-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-4">Study Abroad Destinations</h1>
            <p className="lead mb-4">
              Discover world-class education opportunities in top destinations worldwide.
              Your journey to international excellence starts here.
            </p>
            <Link to="/contact" className="btn btn-light btn-lg">
              Get Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Popular Study Destinations</h2>
            <p className="lead text-muted">Explore top countries for international education</p>
          </motion.div>

          <div className="row">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                className="col-lg-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="row g-0">
                    <div className="col-md-5">
                      <img
                        src={country.image}
                        alt={country.name}
                        className="img-fluid rounded-start h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-7">
                      <div className="card-body d-flex flex-column h-100">
                        <div className="d-flex align-items-center mb-3">
                          <span className="fs-1 me-3">{country.flag}</span>
                          <h5 className="card-title fw-bold mb-0">{country.name}</h5>
                        </div>
                        <p className="card-text text-muted mb-3">{country.description}</p>

                        <div className="country-details mb-3">
                          <div className="row">
                            <div className="col-6">
                              <small className="text-muted d-block">Universities</small>
                              <strong>{country.universities}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Avg. Cost</small>
                              <strong>{country.avgCost}</strong>
                            </div>
                          </div>
                          <div className="mt-2">
                            <small className="text-muted d-block">Popular Courses</small>
                            <strong className="text-primary">{country.popularCourses}</strong>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <Link
                            to={`/country?name=${country.name.toLowerCase()}`}
                            className="btn btn-primary"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-light py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Our Process</h2>
            <p className="lead text-muted">Step-by-step guidance to your dream university</p>
          </motion.div>

          <div className="row">
            {process.map((step, index) => (
              <motion.div
                key={index}
                className="col-lg-3 col-md-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="process-step mb-3">
                    <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '60px', height: '60px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {step.step}
                    </div>
                    <div className="step-icon text-primary mb-3" style={{ fontSize: '2rem' }}>
                      {step.icon}
                    </div>
                    <h5 className="fw-bold mb-3">{step.title}</h5>
                    <p className="text-muted">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h2 className="display-5 fw-bold mb-3">Ready to Start Your Journey?</h2>
            <p className="lead mb-4">
              Get expert guidance for studying abroad. Our counselors are here to help you every step of the way.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/contact" className="btn btn-light btn-lg">
                Free Consultation
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg">
                View Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StudyAbroad;