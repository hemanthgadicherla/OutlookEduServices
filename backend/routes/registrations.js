const express = require('express');
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
  updateRegistration
} = require('../controllers/registrations');

// Routes
router.post('/', createRegistration);
router.get('/', getRegistrations);
router.put('/:id', updateRegistration);

module.exports = router;