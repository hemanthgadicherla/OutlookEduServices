const jwt      = require('jsonwebtoken');
const supabase = require('../config/supabase');

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    // Verify JWT signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ── Single-session enforcement ──────────────────────────────
    // Skip DB check for admin tokens (admins can use multiple devices)
    if (decoded.role !== 'admin' && decoded.session_id) {
      const { data: user } = await supabase
        .from('users')
        .select('session_id')
        .eq('id', decoded.id)
        .maybeSingle();

      if (user && user.session_id && user.session_id !== decoded.session_id) {
        // A newer session exists — this device was logged out
        return res.status(401).json({
          success:  false,
          message:  'SESSION_INVALIDATED',
          code:     'SESSION_INVALIDATED'
        });
      }
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};


// Admin Only Middleware
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};
