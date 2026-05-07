const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminCredentials = {
  email: process.env.ADMIN_EMAIL || 'admin@educonsult.com',
  password: process.env.ADMIN_PASSWORD || 'admin123' // In production, hash this
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== adminCredentials.email || password !== adminCredentials.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { email: adminCredentials.email, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        email: adminCredentials.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = {
  login,
  verifyToken
};