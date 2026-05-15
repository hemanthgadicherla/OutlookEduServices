const express = require('express');

const router = express.Router();

const {

  createRegistration,

  getRegistrations,

  updateRegistration,

  deleteRegistration

} = require('../controllers/registrations');

const {

  verifyToken,

  isAdmin,

} = require('../middleware/authMiddleware');


// Public Route

router.post(
  '/',
  createRegistration
);


// Protected Admin Routes

router.get(
  '/',
  verifyToken,
  isAdmin,
  getRegistrations
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  updateRegistration
);

// DELETE REGISTRATION
router.delete(

  '/:id',

  verifyToken,

  deleteRegistration

);

module.exports = router;