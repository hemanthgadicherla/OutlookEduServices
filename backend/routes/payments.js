const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPayments,
  getPaymentStats
} = require('../controllers/payments');

// Routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/', getPayments);
router.get('/stats', getPaymentStats);

module.exports = router;