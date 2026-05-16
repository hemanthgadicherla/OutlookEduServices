import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { courseAPI } from '../services/api';
import { isLoggedIn } from '../utils/auth';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    courseAPI.getCourses()
      .then((res) => {
        if (res.success !== false) setCourses(Array.isArray(res) ? res : res.data || []);
      })
      .catch(console.error);
  }, []);

  const handleEnroll = (courseId) => {
    if (!isLoggedIn()) {
      navigate(`/login?redirect=${encodeURIComponent(`/course_registration?course=${courseId}`)}`);
      return;
    }
    navigate(`/course_registration?course=${courseId}`);
  };

  return (
    <div
      className="courses-page py-5 position-relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#050505,#111827)' }}
    >
      {/* GOLD GLOW */}
      <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'rgba(255,193,7,0.12)', borderRadius: '50%', filter: 'blur(120px)', top: '-120px', left: '-120px', zIndex: 1 }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(255,193,7,0.08)', borderRadius: '50%', filter: 'blur(120px)', bottom: '-100px', right: '-100px', zIndex: 1 }} />

      <div className="container position-relative" style={{ zIndex: 2 }}>

        {/* HEADER */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="px-4 py-2 mb-3 d-inline-block" style={{ borderRadius: '40px', background: 'rgba(255,193,7,0.12)', color: '#ffc107', border: '1px solid rgba(255,193,7,0.3)', letterSpacing: '1px', fontWeight: '600' }}>
            PROFESSIONAL COURSES
          </span>
          <h1 className="fw-bold text-white mb-3" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)' }}>
            Upgrade Your Skills With
            <span style={{ color: '#ffc107' }}> Industry Training</span>
          </h1>
          <p className="mx-auto" style={{ maxWidth: '750px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.9', fontSize: '18px' }}>
            Enhance your career opportunities with practical and industry-relevant training programs designed for students and professionals.
          </p>
        </motion.div>

        {/* COURSES GRID */}
        <div className="row g-4">
          {courses.map((course, index) => (
            <div key={course.id} className="col-lg-4 col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.02 }}
                viewport={{ once: true }}
                className="position-relative overflow-hidden h-100 d-flex flex-column"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 10px 35px rgba(0,0,0,0.25)' }}
              >
                {/* IMAGE */}
                <div className="position-relative overflow-hidden">
                  <motion.img
                    src={course.image}
                    alt={course.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    className="w-100"
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />
                  {course.rating && (
                    <div className="position-absolute" style={{ top: '20px', right: '20px' }}>
                      <span className="d-flex align-items-center" style={{ background: 'rgba(255,193,7,0.95)', color: '#111', padding: '8px 14px', borderRadius: '40px', fontWeight: '700', fontSize: '14px' }}>
                        <FaStar className="me-2" />{course.rating}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h4 className="fw-bold text-white mb-3">{course.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: '1.9', fontSize: '15px' }}>{course.description}</p>

                  <div className="d-flex gap-3 mt-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '50%' }}>
                      <Link
                        to={`/course/${course.id}`}
                        className="btn w-100"
                        style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '13px 16px', borderRadius: '16px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none' }}
                      >
                        Learn More
                      </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '50%' }}>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn w-100"
                        style={{ background: '#ffc107', color: '#111', padding: '13px 16px', borderRadius: '16px', fontWeight: '700', border: 'none', boxShadow: '0 10px 25px rgba(255,193,7,0.3)' }}
                      >
                        Enroll Now
                      </button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto p-4 p-lg-5" style={{ maxWidth: '950px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', borderRadius: '35px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <h3 className="fw-bold text-white mb-3">Not Sure Which Course To Choose?</h3>
            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '17px', lineHeight: '1.8' }}>
              Get personalized career guidance and expert recommendations tailored to your goals and interests.
            </p>
            <Link to="/contact" className="btn" style={{ background: '#ffc107', color: '#111', padding: '15px 36px', borderRadius: '18px', fontWeight: '700', border: 'none', boxShadow: '0 10px 25px rgba(255,193,7,0.35)' }}>
              Get Free Consultation
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Courses;
