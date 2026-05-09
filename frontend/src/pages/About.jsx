import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { number: '5000+', label: 'Students Guided' },
    { number: '50+', label: 'Partner Universities' },
    { number: '98%', label: 'Visa Success Rate' },
    { number: '15+', label: 'Years Experience' }
  ];

  const team = [
    {
      name: 'Khaja Nadeemuddin',
      role: 'Founder & CEO',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246829/Nadeem_pb3abd.jpg',
      bio: 'PhD in Education with 15+ years in international admissions.'
    },
    {
      name: 'Jeelani',
      role: 'Head of Visa Services',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246935/Jeelani_jhjvqf.jpg',
      bio: 'Former immigration officer with expertise in global visa processes.'
    },
    {
      name: 'Noman',
      role: 'Consultant & Career Advisor',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246886/Noman_txa66z.jpg',
      bio: 'Masters from Oxford University, specializes in career guidance.'
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <div className="container">
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-4">About EduConsult</h1>
            <p className="lead text-black mb-0">
              Outlook Edu Services is your reliable partner in securing visas for the United States and other countries, helping you achieve your international education and career goals.
              At Outlook Edu Services, we understand that pursuing education or work abroad is a significant step, filled with both opportunities and challenges
              We specialize in guiding clients through the complex visa application process, ensuring all requirements are met for a successful outcome.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <motion.div
              className="col-lg-6"
              {...fadeInUp}
            >
              <h2 className="display-5 fw-bold mb-4">Our Mission</h2>
              <p className="lead mb-4">
                To democratize access to quality international education by providing personalized,
                transparent, and comprehensive guidance to students worldwide.
              </p>
              <p>
                We believe that every student deserves the opportunity to study at world-class institutions
                and build a successful global career. Our mission is to bridge the gap between aspirations
                and achievements through expert guidance and unwavering support.
              </p>
            </motion.div>
            <motion.div
              className="col-lg-6"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Students collaborating"
                className="img-fluid rounded shadow"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-light py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Our Impact</h2>
            <p className="lead text-muted">Numbers that speak for themselves</p>
          </motion.div>

          <div className="row">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="col-lg-3 col-md-6 mb-4 text-center"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-card">
                  <h3 className="display-4 fw-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Meet Our Team</h2>
            <p className="lead text-muted">Experts dedicated to your success</p>
          </motion.div>

          <div className="row">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="col-lg-4 mb-4"
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h5 className="card-title fw-bold">{member.name}</h5>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="card-text text-muted">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-primary text-white py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            {...fadeInUp}
          >
            <h2 className="display-5 fw-bold">Our Values</h2>
            <p className="lead">What drives us every day</p>
          </motion.div>

          <div className="row">
            <div className="col-lg-4 mb-4">
              <motion.div
                className="text-center"
                {...fadeInUp}
              >
                <div className="mb-3">
                  <i className="fas fa-handshake fa-3x"></i>
                </div>
                <h4 className="fw-bold mb-3">Integrity</h4>
                <p>Transparent processes, honest advice, and ethical practices in everything we do.</p>
              </motion.div>
            </div>

            <div className="col-lg-4 mb-4">
              <motion.div
                className="text-center"
                {...fadeInUp}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-3">
                  <i className="fas fa-lightbulb fa-3x"></i>
                </div>
                <h4 className="fw-bold mb-3">Innovation</h4>
                <p>Staying ahead with cutting-edge solutions and personalized approaches.</p>
              </motion.div>
            </div>

            <div className="col-lg-4 mb-4">
              <motion.div
                className="text-center"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-3">
                  <i className="fas fa-users fa-3x"></i>
                </div>
                <h4 className="fw-bold mb-3">Community</h4>
                <p>Building lasting relationships and supporting each other in our journey.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;