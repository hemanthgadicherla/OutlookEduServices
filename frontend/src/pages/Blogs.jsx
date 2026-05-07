import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockBlogs = [
      {
        id: 1,
        title: 'Study Abroad: A Complete Guide for 2024',
        excerpt: 'Planning to study abroad? This comprehensive guide covers everything you need to know about choosing the right destination, application process, visa requirements, and more.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
        author: 'EduConsult Team',
        date: '2024-01-15',
        readTime: '8 min read',
        category: 'Study Abroad'
      },
      {
        id: 2,
        title: 'Top Universities for Computer Science in 2024',
        excerpt: 'Discover the best universities worldwide offering computer science programs, their rankings, admission requirements, and career prospects.',
        image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-4.0.3',
        author: 'Dr. Sarah Johnson',
        date: '2024-01-10',
        readTime: '6 min read',
        category: 'Universities'
      },
      {
        id: 3,
        title: 'Visa Application Tips and Tricks',
        excerpt: 'Learn the essential tips for successful visa applications, common mistakes to avoid, and how to increase your chances of approval.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3',
        author: 'Michael Chen',
        date: '2024-01-05',
        readTime: '5 min read',
        category: 'Visa'
      },
      {
        id: 4,
        title: 'Scholarships for International Students',
        excerpt: 'Explore various scholarship opportunities available for international students, eligibility criteria, and application processes.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3',
        author: 'Priya Sharma',
        date: '2024-01-01',
        readTime: '7 min read',
        category: 'Scholarships'
      },
      {
        id: 5,
        title: 'Life as an International Student in Canada',
        excerpt: 'Get insights into student life in Canada, from accommodation and food to cultural adaptation and part-time work opportunities.',
        image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3',
        author: 'EduConsult Team',
        date: '2023-12-28',
        readTime: '4 min read',
        category: 'Student Life'
      },
      {
        id: 6,
        title: 'English Language Requirements for Universities',
        excerpt: 'Understanding IELTS, TOEFL, and PTE requirements for different universities and programs worldwide.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3',
        author: 'Dr. Sarah Johnson',
        date: '2023-12-20',
        readTime: '6 min read',
        category: 'Language Tests'
      }
    ];
    setBlogs(mockBlogs);
  }, []);

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
                  <p className="card-text text-muted mb-3">{blog.excerpt}</p>

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