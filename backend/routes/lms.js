const express    = require('express');
const router     = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getUserCourses,
  getCourseContent,
  updateProgress,
  getStats,
  getCertificates,
  generateCertificate,
  getNotifications,
  markNotificationRead,
  getCourseSuggestions,
  getResume
} = require('../controllers/lms');

router.use(verifyToken); // all LMS routes require auth

router.get('/resume',                   getResume);
router.get('/courses',                  getUserCourses);
router.get('/course/:id',               getCourseContent);
router.post('/progress',                updateProgress);
router.get('/stats',                    getStats);
router.get('/certificates',             getCertificates);
router.post('/certificate/generate',    generateCertificate);
router.get('/course/:id/suggestions',   getCourseSuggestions);
router.get('/notifications',            getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

module.exports = router;
