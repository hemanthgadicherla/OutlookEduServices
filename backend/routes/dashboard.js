const express =
  require('express');

const router =
  express.Router();

const {

  getDashboardStats

} = require(
  '../controllers/dashboard'
);

const {

  verifyToken,

  isAdmin

} = require(
  '../middleware/authMiddleware'
);


// DASHBOARD STATS
router.get(

  '/stats',

  verifyToken,

  isAdmin,

  getDashboardStats

);


module.exports =
  router;