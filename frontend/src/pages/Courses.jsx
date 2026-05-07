import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaUsers, FaStar, FaRupeeSign } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockCourses = [
      {
        id: 1,
        title: 'Digital Marketing Mastery',
        description: 'Complete course covering SEO, social media marketing, paid ads, and analytics.',
        duration: '3 months',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
        rating: 4.8,
        students: 1250
      },
      {
        id: 2,
        title: 'SAP FICO Certification',
        description: 'Learn SAP Financial Accounting and Controlling with real project experience.',
        duration: '4 months',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
        rating: 4.9,
        students: 890
      },
      {
        id: 3,
        title: 'IELTS Preparation',
        description: 'Comprehensive IELTS coaching with mock tests and expert feedback.',
        duration: '2 months',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3',
        rating: 4.7,
        students: 2100
      },
      {
        id: 4,
        title: 'Data Science Fundamentals',
        description: 'Learn Python, statistics, and machine learning for data science careers.',
        duration: '6 months',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3',
        rating: 4.8,
        students: 675
      },
      {
        id: 5,
        title: 'Business English',
        description: 'Professional English communication skills for corporate careers.',
        duration: '3 months',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
        rating: 4.6,
        students: 950
      },
      {
        id: 6,
        title: 'Web Development Bootcamp',
        description: 'Full-stack web development with React, Node.js, and modern tools.',
        duration: '5 months',
        price: 40000,
        image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3',
        rating: 4.9,
        students: 1100
      }
    ];
    setCourses(mockCourses);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="courses-page py-5">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-5"
          {...fadeInUp}
        >
          <h1 className="display-4 fw-bold mb-3">Professional Courses</h1>
          <p className="lead text-muted">
            Enhance your skills with our industry-relevant training programs
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="row">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              className="col-lg-4 col-md-6 mb-4"
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-img-wrapper">
                  <img
                    src={course.image}
                    className="card-img-top"
                    alt={course.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-img-overlay d-flex align-items-start justify-content-end p-3">
                    <span className="badge bg-primary">
                      <FaStar className="me-1" />
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{course.title}</h5>
                  <p className="card-text text-muted mb-3">{course.description}</p>

                  <div className="course-meta mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        <FaClock className="me-1" />
                        {course.duration}
                      </span>
                      <span className="text-muted">
                        <FaUsers className="me-1" />
                        {course.students} students
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaRupeeSign className="text-success me-1" />
                      <span className="h5 text-success fw-bold mb-0">{course.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/registration?course=${course.id}`}
                      className="btn btn-primary w-100"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-5"
          {...fadeInUp}
        >
          <div className="bg-light rounded p-4">
            <h3 className="mb-3">Not sure which course to choose?</h3>
            <p className="text-muted mb-4">
              Get personalized career guidance and course recommendations
            </p>
            <Link to="/contact" className="btn btn-accent btn-lg">
              Get Free Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Courses;