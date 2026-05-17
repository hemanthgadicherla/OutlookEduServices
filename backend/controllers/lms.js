const supabase = require('../config/supabase');

// GET USER COURSES
// Single source of truth: registrations.payment_status
// Only shows courses where payment_status = 'paid' for this user's email.
// Handles both course_id FK join and fallback to selected_course name match.
const getUserCourses = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    // Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', user_id)
      .maybeSingle();

    if (userError || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get ONLY paid registrations for this email
    const { data: paidRegistrations, error: regError } = await supabase
      .from('registrations')
      .select('id, course_id, selected_course, payment_status, created_at')
      .eq('email', user.email)
      .eq('payment_status', 'paid');

    if (regError) throw regError;

    if (!paidRegistrations || paidRegistrations.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Collect all course IDs (from FK) and course names (fallback)
    const courseIds   = paidRegistrations.filter(r => r.course_id).map(r => r.course_id);
    const courseNames = paidRegistrations.filter(r => !r.course_id).map(r => r.selected_course);

    // Fetch course details — by ID where available, by title as fallback
    let courses = [];

    if (courseIds.length > 0) {
      const { data: byId } = await supabase
        .from('courses')
        .select('id, title, description, image, category')
        .in('id', courseIds);
      if (byId) courses = [...courses, ...byId];
    }

    if (courseNames.length > 0) {
      const { data: byName } = await supabase
        .from('courses')
        .select('id, title, description, image, category')
        .in('title', courseNames);
      if (byName) courses = [...courses, ...byName];
    }

    // Deduplicate by course id
    const seen = new Set();
    const uniqueCourses = courses.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    // Shape to match frontend expectation: { course_id, payment_status, courses: {...} }
    const data = uniqueCourses.map(course => {
      const reg = paidRegistrations.find(
        r => r.course_id === course.id || r.selected_course === course.title
      );
      return {
        course_id:      course.id,
        payment_status: 'paid',
        enrolled_at:    reg?.created_at || null,
        courses:        course
      };
    });

    return res.json({ success: true, data });

  } catch (error) {
    console.error('Get LMS courses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch LMS courses' });
  }
};

module.exports = { getUserCourses };
