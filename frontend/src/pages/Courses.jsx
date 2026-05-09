import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaClock, FaUsers, FaStar, FaRupeeSign } from 'react-icons/fa';
import { supabase } from "../services/supabase";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {

  const { data, error } =
    await supabase
      .from("courses")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    console.log(error);

    return;
  }

  setCourses(data);
};

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