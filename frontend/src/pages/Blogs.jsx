import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { supabase } from "../services/supabase";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {

  fetchBlogs();

}, []);

const fetchBlogs = async () => {

  const { data, error } =
    await supabase
      .from("blogs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    console.log(error);

    return;
  }

  setBlogs(data);
};

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const categories = ['All', 'Study Abroad', 'Universities', 'Visa', 'Scholarships', 'Student Life', 'Language Tests'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <div className="blogs-page py-5">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-5"
          {...fadeInUp}
        >
          <h1 className="display-4 fw-bold mb-3">Educational Insights</h1>
          <p className="lead text-muted">
            Stay informed with the latest trends, tips, and guides for international education
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="d-flex justify-content-center flex-wrap mb-5"
          {...fadeInUp}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`btn me-2 mb-2 ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blogs Grid */}
        <div className="row">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              className="col-lg-4 col-md-6 mb-4"
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-img-wrapper">
                  <img
                    src={blog.image}
                    className="card-img-top"
                    alt={blog.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-img-overlay d-flex align-items-start justify-content-end p-3">
                    <span className="badge bg-primary">{blog.category}</span>
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-3">{blog.title}</h5>
                  <p className="card-text text-muted mb-3">{blog.content}</p>

                  <div className="blog-meta mb-3">
                    <div className="d-flex align-items-center text-muted small mb-2">
                      <FaUser className="me-1" />
                      <span className="me-3">{blog.author}</span>
                      <FaCalendarAlt className="me-1" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-muted small">{blog.readTime}</span>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="btn btn-primary d-flex align-items-center"
                    >
                      Read More
                      <FaArrowRight className="ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="text-center mt-5 bg-light rounded p-5"
          {...fadeInUp}
        >
          <h3 className="mb-3">Stay Updated</h3>
          <p className="text-muted mb-4">
            Subscribe to our newsletter for the latest educational insights and opportunities
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  aria-label="Email for newsletter"
                />
                <button className="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blogs;