const express = require('express');

const router = express.Router();

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

const {
  verifyToken,
  isAdmin
} = require('../middleware/authMiddleware');


// PUBLIC ROUTE
router.get('/', getCourses);


// ADMIN ROUTES
router.post(
  '/',
  verifyToken,
  isAdmin,
  createCourse
);

router.put(
  '/:id',
  verifyToken,
  isAdmin,
  updateCourse
);

router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  deleteCourse
);

module.exports = router;