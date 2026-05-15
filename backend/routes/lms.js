const express =
  require('express');

const router =
  express.Router();

const {

  getUserCourses

} = require(
  '../controllers/lms'
);


// GET LMS COURSES
router.get(
  '/courses',
  getUserCourses
);


module.exports =
  router;