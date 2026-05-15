const express =
  require('express');

const router =
  express.Router();

const {

  getSubscribers,

  deleteSubscriber

} = require(
  '../controllers/subscribers'
);

const {

  verifyToken,

  isAdmin

} = require(
  '../middleware/authMiddleware'
);


// GET SUBSCRIBERS
router.get(

  '/',

  verifyToken,

  isAdmin,

  getSubscribers

);


// DELETE SUBSCRIBER
router.delete(

  '/:id',

  verifyToken,

  isAdmin,

  deleteSubscriber

);


module.exports =
  router;