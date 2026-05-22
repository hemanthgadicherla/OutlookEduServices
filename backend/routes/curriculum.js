const express = require('express');
const router  = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getBunnyUploadToken,
  deleteVideo,
  listVideos,
  setVideoUrl,
} = require('../controllers/curriculum');

// All curriculum routes require admin auth
router.use(verifyToken, isAdmin);

// Modules (Chapters)
router.get('/course/:courseId/modules',       getModules);
router.post('/course/:courseId/modules',      createModule);
router.put('/modules/reorder',                reorderModules);
router.put('/modules/:id',                    updateModule);
router.delete('/modules/:id',                 deleteModule);

// Lessons
router.post('/modules/:moduleId/lessons',     createLesson);
router.put('/lessons/reorder',                reorderLessons);
router.put('/lessons/:id',                    updateLesson);
router.delete('/lessons/:id',                 deleteLesson);

// Video — Bunny Stream upload + URL + library
router.get('/videos',                          listVideos);
router.post('/lessons/:id/bunny-upload-token', getBunnyUploadToken);
router.put('/lessons/:id/video-url',           setVideoUrl);
router.delete('/lessons/:id/video',            deleteVideo);

module.exports = router;
