const express      = require('express');
const router       = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPayments,
  getPaymentStats
} = require('../controllers/payments');

// ── Webhook — NO auth middleware, raw body already parsed in server.js
router.post('/webhook', handleWebhook);

// ── User-facing payment routes — require logged-in user
router.post('/create-order', verifyToken, createOrder);
router.post('/verify',       verifyToken, verifyPayment);

// ── Admin-only routes
router.get('/',      verifyToken, isAdmin, getPayments);
router.get('/stats', verifyToken, isAdmin, getPaymentStats);

module.exports = router;
