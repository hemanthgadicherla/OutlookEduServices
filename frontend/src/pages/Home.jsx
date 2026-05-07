import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaPassport, FaBookOpen, FaUsers } from 'react-icons/fa';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      icon: <FaGraduationCap />,
      title: 'Study Abroad',
      description: 'Comprehensive guidance for international education opportunities.',
      link: '/study-abroad'
    },
    {
      icon: <FaPassport />,
      title: 'Visa Services',
      description: 'Expert assistance with visa applications and documentation.',
      link: '/visit-visa'
    },
    {
      icon: <FaBookOpen />,
      title: 'Courses',
      description: 'Professional training programs for career advancement.',
      link: '/courses'
    },
    {
      icon: <FaUsers />,
      title: 'Consultation',
      description: 'Personalized counseling for your educational journey.',
      link: '/contact'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'EduConsult helped me secure admission to my dream university in Canada. Their guidance was invaluable.',
      role: 'Masters in Business, Canada'
    },
    {
      name: 'Rahul Sharma',
      text: 'The visa process was made so simple with their expert assistance. Highly recommended!',
      role: 'Engineering Student, Australia'
    },
    {
      name: 'Maria Garcia',
      text: 'Professional courses helped me transition to a better career. Thank you EduConsult!',
      role: 'Digital Marketing Professional'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <div className="container">
          <motion.div
            className="row align-items-center"
            {...fadeInUp}
          >
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Your Gateway to <span className="text-info">Global Education</span>
              </h1>
              <p className="lead mb-4 text-dark">
                Premium study abroad guidance and educational consultancy services.
                Turn your dreams of international education into reality.
              </p>
              <div className="d-flex gap-3">
                <Link to="/contact" className="btn btn-secondary btn-lg">
                  Get Free Consultation
                </Link>
                <Link to="/courses" className="btn btn-outline-dark btn-lg">
                  Explore Courses
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <motion.img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Students studying"
                className="img-fluid rounded shadow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Our Services</h2>
            <p className="lead text-muted">Comprehensive educational solutions for your future</p>
          </motion.div>

          <div className="row">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="col-lg-3 col-md-6 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm hover-card">
                  <div className="card-body text-center p-4">
                    <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>
                      {service.icon}
                    </div>
                    <h5 className="card-title fw-bold">{service.title}</h5>
                    <p className="card-text text-muted">{service.description}</p>
                    <Link to={service.link} className="btn btn-primary">
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-light py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">What Our Students Say</h2>
            <p className="lead text-muted">Success stories from our satisfied clients</p>
          </motion.div>

          <div className="row">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="col-lg-4 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <p className="card-text mb-3">"{testimonial.text}"</p>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
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
              Get personalized guidance for your international education goals.
            </p>
            <Link to="/contact" className="btn btn-light btn-lg">
              Book Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;