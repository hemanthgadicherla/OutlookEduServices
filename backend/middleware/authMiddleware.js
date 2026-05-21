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
    if (decoded.session_id) {
      // Admins check against admins table; users check against users table
      const table = decoded.role === 'admin' ? 'admins' : 'users';

      const { data: record } = await supabase
        .from(table)
        .select('session_id')
        .eq('id', decoded.id)
        .maybeSingle();

      if (record && record.session_id && record.session_id !== decoded.session_id) {
        return res.status(401).json({
          success: false,
          message: 'SESSION_INVALIDATED',
          code:    'SESSION_INVALIDATED'
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
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization failed' });
  }
};
