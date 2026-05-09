import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Study In', path: '/study-abroad' },
    { name: 'Visit Visa', path: '/visit-visa' },
    { name: 'Courses', path: '/courses' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.nav
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#000000',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
            alt="Outlook Edu Services"
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link text-white ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex">
            <Link to="/login" className="btn btn-outline-primary me-2">
              <FaUser className="me-1" />
              Login
            </Link>
            <Link to="/registration" className="btn btn-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;