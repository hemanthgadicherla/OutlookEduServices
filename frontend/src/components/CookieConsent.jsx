import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCookieBite } from 'react-icons/fa';

const CONSENT_KEY = 'cookieConsent';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't consented yet
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            position:     'fixed',
            bottom:       0,
            left:         0,
            right:        0,
            zIndex:       9999,
            background:   '#0A2540',
            borderTop:    '3px solid #facc15',
            padding:      '16px 24px',
            boxShadow:    '0 -4px 24px rgba(0,0,0,0.25)'
          }}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">

              {/* Text */}
              <div className="d-flex align-items-start gap-3 flex-grow-1">
                <FaCookieBite
                  size={24}
                  style={{ color: '#facc15', flexShrink: 0, marginTop: 2 }}
                />
                <p className="mb-0 text-white" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  We use cookies to enhance your browsing experience, analyse site traffic, and
                  personalise content. By clicking <strong>"OK"</strong>, you consent to our use
                  of cookies.{' '}
                  <Link
                    to="/cookie-policy"
                    style={{ color: '#facc15', textDecoration: 'underline' }}
                    onClick={handleAccept}
                  >
                    Cookie Policy
                  </Link>
                  {' · '}
                  <Link
                    to="/privacy-policy"
                    style={{ color: '#facc15', textDecoration: 'underline' }}
                    onClick={handleAccept}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* OK button */}
              <button
                className="btn fw-bold px-4 py-2 flex-shrink-0"
                style={{
                  background:   '#facc15',
                  color:        '#0A2540',
                  border:       'none',
                  borderRadius: '8px',
                  fontSize:     '14px',
                  minWidth:     80
                }}
                onClick={handleAccept}
              >
                OK
              </button>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
