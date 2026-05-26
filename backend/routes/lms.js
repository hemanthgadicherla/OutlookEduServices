const express = require('express');
const router  = express.Router();
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
  getStreamUrl,
  getResume,
  getLessonVideoUrl,
  getCourseSuggestions,
} = require('../controllers/lms');

// All LMS routes require a valid user token
router.use(verifyToken);

router.get('/courses',                  getUserCourses);
router.get('/course/:id',               getCourseContent);
router.post('/progress',                updateProgress);
router.get('/stats',                    getStats);
router.get('/certificates',             getCertificates);
router.post('/certificate/generate',    generateCertificate);
router.get('/notifications',            getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.get('/lesson/:id/stream',        getStreamUrl);
router.get('/lesson/:id/video-url',     getLessonVideoUrl);
router.get('/course/:id/suggestions',   getCourseSuggestions);
router.get('/resume',                   getResume);

module.exports = router;
