import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaBookOpen, FaClipboardList,
  FaCertificate, FaBell, FaUser, FaCog, FaSignOutAlt,
  FaBars, FaTimes
} from 'react-icons/fa';
import { getUser, logout as clearTokens } from '../utils/auth';

const NAV = [
  { name: 'Dashboard',     path: '/lms',               icon: FaTachometerAlt },
  { name: 'My Courses',    path: '/lms/courses',        icon: FaBookOpen },
  { name: 'Exams',         path: '/lms/exams',          icon: FaClipboardList },
  { name: 'Certificates',  path: '/lms/certificates',   icon: FaCertificate },
  { name: 'Notifications', path: '/lms/notifications',  icon: FaBell },
  { name: 'Profile',       path: '/account',            icon: FaUser },
  { name: 'Settings',      path: '/lms/settings',       icon: FaCog },
];

const LMSSidebar = ({ notifCount = 0 }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearTokens();
    navigate('/login', { replace: true });
  };

  const avatarLetter = (user?.full_name?.[0] || user?.email?.[0] || 'S').toUpperCase();

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      {/* Logo */}
      <div className="p-3 pb-2 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <img
            src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
            alt="Outlook Edu Services"
            style={{ height: 44, objectFit: 'contain', width: '100%' }}
          />
        </Link>
      </div>

      {/* User info */}
      <div className="px-3 py-3 d-flex align-items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          className="d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
          style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: 15 }}
        >
          {avatarLetter}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="fw-semibold text-white small" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.full_name || 'Student'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1 px-2 py-3" style={{ overflowY: 'auto' }}>
        {NAV.map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path ||
            (path !== '/lms' && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className="d-flex align-items-center gap-2 text-decoration-none mb-1 px-3 py-2 rounded-3 position-relative"
              style={{
                color:      active ? '#fff' : 'rgba(255,255,255,0.6)',
                background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                fontSize:   14,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s'
              }}
            >
              <Icon size={15} />
              <span>{name}</span>
              {name === 'Notifications' && notifCount > 0 && (
                <span
                  className="ms-auto badge rounded-pill"
                  style={{ background: '#ef4444', fontSize: 10, minWidth: 18 }}
                >
                  {notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-3">
        <button
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 w-100 border-0 px-3 py-2 rounded-3 text-decoration-none"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', fontSize: 14, cursor: 'pointer' }}
        >
          <FaSignOutAlt size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="d-none d-lg-flex flex-column"
        style={{
          width: 240, minHeight: '100vh', flexShrink: 0,
          background: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto'
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile toggle button */}
      <button
        className="d-lg-none position-fixed btn"
        style={{ top: 12, left: 12, zIndex: 1100, background: '#0f172a', color: '#fff', borderRadius: 8, padding: '6px 10px' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <FaBars size={18} />
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
                background: '#0f172a', zIndex: 1300, overflowY: 'auto'
              }}
            >
              <button
                className="btn position-absolute"
                style={{ top: 10, right: 10, color: 'rgba(255,255,255,0.5)', background: 'transparent', border: 'none' }}
                onClick={() => setMobileOpen(false)}
              >
                <FaTimes size={18} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LMSSidebar;
