import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { logout as clearTokens } from '../utils/auth';

// ── Global fetch interceptor ─────────────────────────────────────────────────
// Patches window.fetch once to detect SESSION_INVALIDATED 401 responses.
// Fires a custom DOM event that SessionGuard listens to.

let interceptorInstalled = false;

const installInterceptor = () => {
  if (interceptorInstalled) return;
  interceptorInstalled = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Clone so the original response body can still be consumed by the caller
    if (response.status === 401) {
      try {
        const clone = response.clone();
        const data  = await clone.json();
        if (data?.code === 'SESSION_INVALIDATED' || data?.message === 'SESSION_INVALIDATED') {
          window.dispatchEvent(new CustomEvent('session:invalidated'));
        }
      } catch {
        // non-JSON 401 — ignore
      }
    }

    return response;
  };
};

// ── SessionGuard component ───────────────────────────────────────────────────
const SessionGuard = () => {
  const navigate  = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    installInterceptor();

    const handler = () => setVisible(true);
    window.addEventListener('session:invalidated', handler);
    return () => window.removeEventListener('session:invalidated', handler);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setVisible(false);
    navigate('/login', { replace: true });
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 9998,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{    opacity: 0, scale: 0.9, y: 20  }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position:        'fixed',
              top:             '50%',
              left:            '50%',
              transform:       'translate(-50%, -50%)',
              zIndex:          9999,
              width:           '90%',
              maxWidth:        440,
              background:      '#1e293b',
              borderRadius:    20,
              border:          '1px solid rgba(255,255,255,0.08)',
              boxShadow:       '0 24px 60px rgba(0,0,0,0.5)',
              padding:         '36px 32px',
              textAlign:       'center'
            }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-title"
            aria-describedby="session-desc"
          >
            {/* Icon */}
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)',
                border: '2px solid rgba(239,68,68,0.3)'
              }}
            >
              <FaExclamationTriangle size={30} style={{ color: '#f87171' }} />
            </div>

            {/* Title */}
            <h5 id="session-title" className="fw-bold mb-2" style={{ color: '#fff', fontSize: 18 }}>
              Signed in on Another Device
            </h5>

            {/* Description */}
            <p id="session-desc" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
              Your account was logged in from another device or browser.
              For your security, this session has been ended.
              Please log in again to continue.
            </p>

            {/* CTA */}
            <button
              onClick={handleLogout}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
              style={{
                background:  'linear-gradient(135deg,#ef4444,#dc2626)',
                color:       '#fff',
                fontWeight:  600,
                fontSize:    15,
                border:      'none'
              }}
            >
              <FaSignOutAlt size={15} />
              OK, Log Me Out
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SessionGuard;
