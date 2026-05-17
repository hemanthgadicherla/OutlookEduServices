import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaBookOpen, FaChevronDown, FaIdCard } from 'react-icons/fa';
import { userAuthAPI } from '../services/api';
import { getUser, logout as clearTokens } from '../utils/auth';

const Navbar = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);
  const [user, setUser]               = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef                   = useRef(null);
  const location                      = useLocation();
  const navigate                      = useNavigate();

  // ── scroll ───────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── refresh auth state on every route change ─────────────────
  useEffect(() => {
    setUser(getUser());
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // ── re-read user when profile is updated from Account page ───
  useEffect(() => {
    const handler = () => setUser(getUser());
    window.addEventListener('userProfileUpdated', handler);
    return () => window.removeEventListener('userProfileUpdated', handler);
  }, []);

  // ── close dropdown on outside click ──────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── logout ───────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await userAuthAPI.logout(); } catch { /* non-fatal */ }
    clearTokens();
    setUser(null);
    setDropdownOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home',     path: '/' },
    { name: 'About',    path: '/about' },
    { name: 'Study In', path: '/study-abroad' },
    { name: 'Visas',    path: '/visit-visa' },
    { name: 'Courses',  path: '/courses' },
    { name: 'Blogs',    path: '/blogs' },
    { name: 'Contact',  path: '/contact' },
  ];

  const avatarLetter = user
    ? (user.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
    : '';

  // Show photo if available, otherwise show initial letter
  const AvatarCircle = ({ size = 30, fontSize = 13 }) => (
    <span
      className="d-flex align-items-center justify-content-center fw-bold overflow-hidden"
      style={{ width: size, height: size, borderRadius: '50%', background: '#0d6efd', fontSize, flexShrink: 0, color: '#fff' }}
    >
      {user?.avatar_url
        ? <img src={user.avatar_url} alt={user.full_name || 'avatar'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        : avatarLetter
      }
    </span>
  );

  return (
    <motion.nav
      className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#000000', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
    >
      <div className="container">

        {/* brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
            alt="Outlook Edu Services"
            style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ color: '#fff' }}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>

          {/* centre nav links */}
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link text-white ${location.pathname === item.path ? 'active fw-semibold' : ''}`}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* right-side auth */}
          <div className="d-flex align-items-center gap-2">

            {/* ── LOGGED OUT ── */}
            {!user && (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm" onClick={() => setIsOpen(false)}>
                  <FaUser className="me-1" /> Login
                </Link>
                <Link to="/registration" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}

            {/* ── LOGGED IN ── */}
            {user && (
              <>
                {/* avatar dropdown (desktop) */}
                <div className="position-relative d-none d-lg-block" ref={dropdownRef}>
                  <button
                    className="btn btn-sm d-flex align-items-center gap-2 px-2 py-1"
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <AvatarCircle size={30} fontSize={13} />
                    <span className="small" style={{ maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.full_name || user.email}
                    </span>                    <FaChevronDown
                      size={11}
                      style={{ transition: 'transform .2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0,  scale: 1 }}
                        exit={{    opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="position-absolute end-0 mt-2 py-1"
                        style={{
                          minWidth: 220,
                          background: '#fff',
                          borderRadius: 10,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          zIndex: 1050
                        }}
                      >
                        {/* user info */}
                        <div className="px-3 py-2 border-bottom">
                          <div className="fw-semibold text-dark small" style={{ maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.full_name || 'My Account'}
                          </div>
                          <div className="text-muted" style={{ fontSize: 11, maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user.email}
                          </div>
                        </div>

                        {/* view account */}
                        <Link
                          to="/account"
                          className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-dark small"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaIdCard size={13} className="text-primary" /> View Account
                        </Link>

                        {/* my courses */}
                        <Link
                          to="/lms"
                          className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-dark small"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <FaBookOpen size={13} className="text-primary" /> My Courses
                        </Link>

                        <div className="border-top my-1" />

                        {/* logout */}
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger small w-100 border-0 bg-transparent"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt size={13} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* mobile: avatar row + links */}
                <div className="d-flex d-lg-none flex-column w-100 gap-2 mt-2">
                  <div className="d-flex align-items-center gap-2 px-1 text-white small">
                    <AvatarCircle size={28} fontSize={12} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.full_name || user.email}
                    </span>
                  </div>
                  <Link to="/account"      className="btn btn-outline-light btn-sm" onClick={() => setIsOpen(false)}>
                    <FaIdCard className="me-1" /> View Account
                  </Link>
                  <Link to="/lms"          className="btn btn-outline-light btn-sm" onClick={() => setIsOpen(false)}>
                    <FaBookOpen className="me-1" /> My Courses
                  </Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
