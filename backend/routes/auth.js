const express = require('express');
const router  = express.Router();

const { login, adminSignup, verifyAdmin } = require('../controllers/auth');
const loginLimiter  = require('../middleware/loginLimiter');
const { verifyToken } = require('../middleware/authMiddleware');

// Admin login — rate limited
router.post('/login',        loginLimiter, login);

// Admin signup — protected by secret key in body
router.post('/admin-signup', adminSignup);

// Verify token is still valid + is admin
router.get('/verify',        verifyToken, verifyAdmin);

module.exports = router;
