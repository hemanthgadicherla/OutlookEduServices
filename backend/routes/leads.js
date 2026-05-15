const express =
  require('express');

const router =
  express.Router();

const {

  createLead,

  getLeads,

  updateLead,

  deleteLead

} = require(
  '../controllers/leads'
);

const {

  verifyToken,

  isAdmin

} = require(
  '../middleware/authMiddleware'
);


// PUBLIC CREATE LEAD
router.post(
  '/',
  createLead
);

// GET LEADS
router.get(

  '/',

  verifyToken,

  isAdmin,

  getLeads

);


// UPDATE LEAD
router.put(

  '/:id',

  verifyToken,

  isAdmin,

  updateLead

);


// DELETE LEAD
router.delete(

  '/:id',

  verifyToken,

  isAdmin,

  deleteLead

);


module.exports =
  router;