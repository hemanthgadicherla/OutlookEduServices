const express = require('express');

const router = express.Router();

const {
  login,
  verifyAdmin
} = require('../controllers/auth');

const loginLimiter =
  require('../middleware/loginLimiter');

const {
  verifyToken
} = require('../middleware/authMiddleware');

router.post(
  '/login',
  loginLimiter,
  login
);

router.get(
  '/verify',
  verifyToken,
  verifyAdmin
);

module.exports = router;