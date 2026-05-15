const express = require('express');

const router = express.Router();

const {
  uploadImage
} = require('../controllers/upload');

const upload =
  require('../middleware/uploadMiddleware');

const {
  verifyToken,
  isAdmin
} = require('../middleware/authMiddleware');


// Upload Route
router.post(

  '/image',

  verifyToken,

  isAdmin,

  upload.single('image'),

  uploadImage

);

module.exports = router;