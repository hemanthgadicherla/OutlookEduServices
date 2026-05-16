const express = require('express');
const router = express.Router();
const loginLimiter = require('../middleware/loginLimiter');
const { verifyToken } = require('../middleware/authMiddleware');

const {
  login,
  register,
  googleOAuthUrl,
  googleOAuthCallback,
  logout,
  getMe,
  updateMe,
  checkUserAccess
} = require('../controllers/userAuth');

// EMAIL / PASSWORD
router.post('/login', loginLimiter, login);
router.post('/register', register);

// GOOGLE OAUTH
router.get('/google', googleOAuthUrl);
router.get('/google/callback', googleOAuthCallback);

// LOGOUT
router.post('/logout', logout);

// CURRENT USER (protected)
router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);

// LEGACY
router.post('/check-access', checkUserAccess);

module.exports = router;