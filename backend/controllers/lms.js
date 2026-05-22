const supabase = require('../config/supabase');
const crypto   = require('crypto');

// ─────────────────────────────────────────────────────────────
// HELPER: resolve paid course IDs for a user
// ─────────────────────────────────────────────────────────────
const getPaidCourseIds = async (userId) => {
  const { data: user } = await supabase
    .from('users').select('email').eq('id', userId).maybeSingle();
  if (!user) return [];

  const { data: regs } = await supabase
    .from('registrations')
    .select('course_id, selected_course')
    .eq('email', user.email)
    .eq('payment_status', 'paid');
  if (!regs || regs.length === 0) return [];

  const ids = regs.filter(r => r.course_id).map(r => r.course_id);
  const names = regs.filter(r => !r.course_id).map(r => r.selected_course);

  if (names.length > 0) {
    const { data: byName } = await supabase
      .from('courses').select('id').in('title', names);
    if (byName) byName.forEach(c => ids.push(c.id));
  }
  return [...new Set(ids)];
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/courses  — paid courses list with progress
// ─────────────────────────────────────────────────────────────
const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user } = await supabase
      .from('users').select('id, email').eq('id', userId).maybeSingle();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Get paid registrations
    const { data: paidRegs } = await supabase
      .from('registrations')
      .select('id, course_id, selected_course, payment_status, created_at')
      .eq('email', user.email)
      .eq('payment_status', 'paid');

    if (!paidRegs || paidRegs.length === 0)
      return res.json({ success: true, data: [] });

    const courseIds   = paidRegs.filter(r => r.course_id).map(r => r.course_id);
    const courseNames = paidRegs.filter(r => !r.course_id).map(r => r.selected_course);

    // Fetch course details in one query
    let courses = [];
    if (courseIds.length > 0) {
      const { data: byId } = await supabase
        .from('courses').select('id, title, description, image, category').in('id', courseIds);
      if (byId) courses = [...courses, ...byId];
    }
    if (courseNames.length > 0) {
      const { data: byName } = await supabase
        .from('courses').select('id, title, description, image, category').in('title', courseNames);
      if (byName) courses = [...courses, ...byName];
    }

    const seen = new Set();
    const unique = courses.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });

    if (unique.length === 0) return res.json({ success: true, data: [] });

    const allCourseIds = unique.map(c => c.id);

    // Batch fetch all modules for all courses in ONE query
    const { data: allModules } = await supabase
      .from('course_modules').select('id, course_id').in('course_id', allCourseIds);

    const allModuleIds = (allModules || []).map(m => m.id);

    // Batch fetch all lessons for all modules in ONE query
    const { data: allLessons } = allModuleIds.length > 0
      ? await supabase.from('course_lessons').select('id, module_id').in('module_id', allModuleIds)
      : { data: [] };

    const allLessonIds = (allLessons || []).map(l => l.id);

    // Batch fetch all progress for this user in ONE query
    const { data: allProgress } = allLessonIds.length > 0
      ? await supabase.from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', userId)
          .eq('completed', true)
          .in('lesson_id', allLessonIds)
      : { data: [] };

    const completedSet = new Set((allProgress || []).map(p => p.lesson_id));

    // Build module→course and lesson→module maps
    const moduleToCourse = {};
    (allModules || []).forEach(m => { moduleToCourse[m.id] = m.course_id; });

    const lessonCountByCourse   = {};
    const completedCountByCourse = {};
    (allLessons || []).forEach(l => {
      const cid = moduleToCourse[l.module_id];
      if (!cid) return;
      lessonCountByCourse[cid]    = (lessonCountByCourse[cid]    || 0) + 1;
      completedCountByCourse[cid] = (completedCountByCourse[cid] || 0) + (completedSet.has(l.id) ? 1 : 0);
    });

    const data = unique.map(course => {
      const reg       = paidRegs.find(r => r.course_id === course.id || r.selected_course === course.title);
      const total     = lessonCountByCourse[course.id]    || 0;
      const completed = completedCountByCourse[course.id] || 0;
      const progress  = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        course_id:         course.id,
        payment_status:    'paid',
        enrolled_at:       reg?.created_at || null,
        progress,
        total_lessons:     total,
        completed_lessons: completed,
        courses:           course
      };
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getUserCourses error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/course/:id  — modules + lessons for one course
// ─────────────────────────────────────────────────────────────
const getCourseContent = async (req, res) => {
  try {
    const userId   = req.user.id;
    const courseId = parseInt(req.params.id);

    // Verify access
    const paidIds = await getPaidCourseIds(userId);
    if (!paidIds.includes(courseId))
      return res.status(403).json({ success: false, message: 'Access denied. Please purchase this course.' });

    const { data: course } = await supabase
      .from('courses').select('*').eq('id', courseId).single();
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const { data: modules } = await supabase
      .from('course_modules').select('*').eq('course_id', courseId).order('position');

    const modulesWithLessons = await Promise.all((modules || []).map(async (mod) => {
      const { data: lessons } = await supabase
        .from('course_lessons').select('*').eq('module_id', mod.id).order('position');

      const lessonIds = (lessons || []).map(l => l.id);
      const { data: progress } = lessonIds.length > 0
        ? await supabase.from('lesson_progress').select('*').eq('user_id', userId).in('lesson_id', lessonIds)
        : { data: [] };

      const progressMap = {};
      (progress || []).forEach(p => { progressMap[p.lesson_id] = p; });

      return {
        ...mod,
        lessons: (lessons || []).map(l => ({
          ...l,
          completed:       progressMap[l.id]?.completed || false,
          watched_seconds: progressMap[l.id]?.watched_seconds || 0
        }))
      };
    }));

    return res.json({ success: true, data: { course, modules: modulesWithLessons } });
  } catch (err) {
    console.error('getCourseContent error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch course content' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/lms/progress  — mark lesson complete / update seconds
// ─────────────────────────────────────────────────────────────
const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lesson_id, completed, watched_seconds } = req.body;

    if (!lesson_id) return res.status(400).json({ success: false, message: 'lesson_id required' });

    const upsertData = {
      user_id:         userId,
      lesson_id:       lesson_id,
      completed:       completed ?? false,
      watched_seconds: watched_seconds ?? 0,
      updated_at:      new Date().toISOString()
    };
    if (completed) upsertData.completed_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert([upsertData], { onConflict: 'user_id,lesson_id' })
      .select().single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('updateProgress error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update progress' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/stats  — dashboard overview stats
// ─────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user } = await supabase
      .from('users').select('email').eq('id', userId).maybeSingle();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { data: paidRegs } = await supabase
      .from('registrations').select('course_id, selected_course')
      .eq('email', user.email).eq('payment_status', 'paid');

    const totalPurchased = paidRegs?.length || 0;

    // Get all lesson progress for this user
    const { data: allProgress } = await supabase
      .from('lesson_progress').select('lesson_id, completed, watched_seconds')
      .eq('user_id', userId);

    const completedLessons = (allProgress || []).filter(p => p.completed).length;
    const timeSpentSeconds = (allProgress || []).reduce((s, p) => s + (p.watched_seconds || 0), 0);

    // Weekly activity: count completed lessons per day for last 7 days
    const { data: recentProgress } = await supabase
      .from('lesson_progress')
      .select('completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const count = (recentProgress || []).filter(p =>
        p.completed_at?.startsWith(dateStr)
      ).length;
      return { day: d.toLocaleDateString('en-IN', { weekday: 'short' }), lessons: count };
    });

    // Certificates earned
    const { count: certificates } = await supabase
      .from('certificates').select('id', { count: 'exact', head: true }).eq('user_id', userId);

    return res.json({
      success: true,
      data: {
        total_purchased:   totalPurchased,
        completed_lessons: completedLessons,
        time_spent_hours:  Math.round(timeSpentSeconds / 3600 * 10) / 10,
        certificates:      certificates || 0,
        weekly_activity:   weeklyActivity
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/certificates  — user's certificates
// ─────────────────────────────────────────────────────────────
const getCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(title, image)')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('getCertificates error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch certificates' });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/lms/certificate/generate  — auto-generate on 100%
// ─────────────────────────────────────────────────────────────
const generateCertificate = async (req, res) => {
  try {
    const userId   = req.user.id;
    const { course_id } = req.body;
    if (!course_id) return res.status(400).json({ success: false, message: 'course_id required' });

    // Check already exists
    const { data: existing } = await supabase
      .from('certificates').select('id').eq('user_id', userId).eq('course_id', course_id).maybeSingle();
    if (existing) return res.json({ success: true, data: existing, message: 'Certificate already issued' });

    const certId = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${Date.now()}`;

    const { data, error } = await supabase
      .from('certificates')
      .insert([{ user_id: userId, course_id, certificate_url: certId }])
      .select().single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('generateCertificate error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate certificate' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/notifications  — user notifications
// ─────────────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/lms/notifications/:id/read
// ─────────────────────────────────────────────────────────────
const markNotificationRead = async (req, res) => {
  try {
    await supabase.from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/lms/course/:id/suggestions
// Returns other paid courses so the viewer can show "Up Next"
// ─────────────────────────────────────────────────────────────
const getCourseSuggestions = async (req, res) => {
  try {
    const userId   = req.user.id;
    const courseId = parseInt(req.params.id);

    const { data: user } = await supabase
      .from('users').select('email').eq('id', userId).maybeSingle();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { data: paidRegs } = await supabase
      .from('registrations')
      .select('course_id, selected_course')
      .eq('email', user.email)
      .eq('payment_status', 'paid');

    if (!paidRegs || paidRegs.length === 0)
      return res.json({ success: true, data: { other_courses: [] } });

    const courseIds   = paidRegs.filter(r => r.course_id && r.course_id !== courseId).map(r => r.course_id);
    const courseNames = paidRegs.filter(r => !r.course_id).map(r => r.selected_course);

    let others = [];
    if (courseIds.length > 0) {
      const { data } = await supabase
        .from('courses').select('id, title, description, image, category').in('id', courseIds);
      if (data) others = [...others, ...data];
    }
    if (courseNames.length > 0) {
      const { data } = await supabase
        .from('courses').select('id, title, description, image, category').in('title', courseNames)
        .neq('id', courseId);
      if (data) others = [...others, ...data];
    }

    // Deduplicate and exclude current course
    const seen = new Set([courseId]);
    const unique = others.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });

    return res.json({ success: true, data: { other_courses: unique.slice(0, 5) } });
  } catch (err) {
    console.error('getCourseSuggestions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
  }
};

module.exports = {
  getUserCourses,
  getCourseContent,
  updateProgress,
  getStats,
  getCertificates,
  generateCertificate,
  getNotifications,
  markNotificationRead,
  getCourseSuggestions
};
