const express =
  require('express');

const router =
  express.Router();

const {

  checkUserAccess

} = require(
  '../controllers/userAuth'
);


// CHECK ACCESS
router.post(
  '/check-access',
  checkUserAccess
);


module.exports =
  router;