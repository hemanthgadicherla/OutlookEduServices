const express = require('express');
const router  = express.Router();

const {
  getCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse
} = require('../controllers/courses');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', getCourses);

// ADMIN
router.post('/',              verifyToken, isAdmin, createCourse);
router.put('/:id',            verifyToken, isAdmin, updateCourse);
router.patch('/:id/status',   verifyToken, isAdmin, toggleCourseStatus);
router.delete('/:id',         verifyToken, isAdmin, deleteCourse);

module.exports = router;
