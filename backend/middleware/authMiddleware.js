const jwt = require('jsonwebtoken');

exports.verifyToken = (
  req,
  res,
  next
) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {

      return res.status(401).json({
        success: false,
        message: 'Access denied'
      });

    }

    const token =
      authHeader.split(' ')[1];

    if (!token) {

      return res.status(401).json({
        success: false,
        message: 'Token missing'
      });

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  }

  catch (error) {

    return res.status(401).json({
      success: false,
      message:
        'Invalid or expired token'
    });

  }

};


// Admin Only Middleware
exports.isAdmin = (
  req,
  res,
  next
) => {

  try {

    if (
      req.user.role !== 'admin'
    ) {

      return res.status(403).json({
        success: false,
        message:
          'Admin access required'
      });

    }

    next();

  }

  catch (error) {

    return res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });

  }

};