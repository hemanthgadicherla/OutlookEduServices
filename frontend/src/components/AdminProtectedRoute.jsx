import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaHome, FaSignInAlt } from 'react-icons/fa';
import { getUser } from '../utils/auth';

const AdminProtectedRoute = ({ children }) => {
  const user = getUser();

  // Not logged in at all → go to admin login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but NOT an admin → show access denied page
  if (user.role !== 'admin') {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: '#0f172a' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center px-4"
          style={{ maxWidth: 480 }}
        >
          {/* Lock icon */}
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              border: '2px solid rgba(239,68,68,0.3)'
            }}
          >
            <FaLock size={40} style={{ color: '#f87171' }} />
          </div>

          <h2 className="fw-bold mb-2" style={{ color: '#fff' }}>
            Access Denied
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
            You are not an admin.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 32 }}>
            This area is restricted to administrators only. If you believe this is a mistake,
            please contact support.
          </p>

          {/* User info pill */}
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div
              className="d-flex align-items-center justify-content-center fw-bold rounded-circle"
              style={{ width: 28, height: 28, background: '#6366f1', color: '#fff', fontSize: 12 }}
            >
              {(user.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
              Signed in as <strong style={{ color: '#fff' }}>{user.email}</strong>
            </span>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/"
              className="btn rounded-3 px-4 py-2 d-flex align-items-center gap-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 14 }}
            >
              <FaHome size={13} /> Go to Home
            </Link>
            <Link
              to="/admin/login"
              className="btn rounded-3 px-4 py-2 d-flex align-items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14 }}
            >
              <FaSignInAlt size={13} /> Admin Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Verified admin → render the protected page
  return children;
};

export default AdminProtectedRoute;
