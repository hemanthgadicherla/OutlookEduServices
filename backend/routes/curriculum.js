const express = require('express');
const router  = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  getVideoUploadUrl,
  deleteVideo
} = require('../controllers/curriculum');

// All curriculum routes require admin auth
router.use(verifyToken, isAdmin);

// Modules (Chapters)
router.get('/course/:courseId/modules',       getModules);
router.post('/course/:courseId/modules',      createModule);
router.put('/modules/:id',                    updateModule);
router.delete('/modules/:id',                 deleteModule);

// Lessons
router.post('/modules/:moduleId/lessons',     createLesson);
router.put('/lessons/:id',                    updateLesson);
router.delete('/lessons/:id',                 deleteLesson);

// Video hosting (Supabase Storage)
router.post('/lessons/:id/upload-url',        getVideoUploadUrl);
router.delete('/lessons/:id/video',           deleteVideo);

module.exports = router;
