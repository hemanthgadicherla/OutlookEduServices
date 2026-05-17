const express = require('express');
const router  = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getUserCourses } = require('../controllers/lms');

// Protected — user must be logged in
router.get('/courses', verifyToken, getUserCourses);

module.exports = router;
