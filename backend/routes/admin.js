const express = require('express');
const router = express.Router();
const { verifyToken } = require('../controllers/auth');
const { getRegistrations } = require('../controllers/registrations');
const { getPayments, getPaymentStats } = require('../controllers/payments');
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courses');

// Apply auth middleware to all admin routes
router.use(verifyToken);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get various stats
    const [registrationsRes, paymentsRes, coursesRes] = await Promise.all([
      require('../config/supabase').from('registrations').select('*', { count: 'exact' }),
      require('../config/supabase').from('payments').select('amount, status'),
      require('../config/supabase').from('courses').select('*', { count: 'exact' })
    ]);

    const stats = {
      totalRegistrations: registrationsRes.count || 0,
      totalCourses: coursesRes.count || 0,
      totalRevenue: paymentsRes.data?.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0) || 0,
      completedPayments: paymentsRes.data?.filter(p => p.status === 'completed').length || 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// Registrations management
router.get('/registrations', getRegistrations);

// Payments management
router.get('/payments', getPayments);
router.get('/payments/stats', getPaymentStats);

// Courses management
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;