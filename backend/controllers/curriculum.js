const supabase = require('../config/supabase');

// ─────────────────────────────────────────────────────────────
// MODULES (Chapters)
// ─────────────────────────────────────────────────────────────

// GET /api/curriculum/course/:courseId/modules
const getModules = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { data: modules, error } = await supabase
      .from('course_modules')
      .select(`
        id, title, position, course_id,
        course_lessons ( id, title, video_url, content, position, is_free )
      `)
      .eq('course_id', courseId)
      .order('position', { ascending: true });

    if (error) throw error;

    // Sort lessons within each module by position
    const sorted = (modules || []).map(m => ({
      ...m,
      course_lessons: (m.course_lessons || []).sort((a, b) => a.position - b.position)
    }));

    return res.json({ success: true, data: sorted });
  } catch (err) {
    console.error('getModules error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch modules' });
  }
};

// POST /api/curriculum/course/:courseId/modules
const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, position } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Module title is required' });
    }

    // Auto-assign position if not provided
    let pos = position;
    if (pos === undefined) {
      const { count } = await supabase
        .from('course_modules')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId);
      pos = (count || 0);
    }

    const { data, error } = await supabase
      .from('course_modules')
      .insert([{ course_id: parseInt(courseId), title: title.trim(), position: pos }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('createModule error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create module' });
  }
};

// PUT /api/curriculum/modules/:id
const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, position } = req.body;

    const updates = {};
    if (title    !== undefined) updates.title    = title.trim();
    if (position !== undefined) updates.position = position;

    const { data, error } = await supabase
      .from('course_modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('updateModule error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update module' });
  }
};

// DELETE /api/curriculum/modules/:id
const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    // Lessons cascade-delete via FK ON DELETE CASCADE
    const { error } = await supabase.from('course_modules').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true, message: 'Module deleted' });
  } catch (err) {
    console.error('deleteModule error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete module' });
  }
};


// ─────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────

// POST /api/curriculum/modules/:moduleId/lessons
const createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, video_url, content, is_free, position } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Lesson title is required' });
    }

    let pos = position;
    if (pos === undefined) {
      const { count } = await supabase
        .from('course_lessons')
        .select('id', { count: 'exact', head: true })
        .eq('module_id', moduleId);
      pos = (count || 0);
    }

    const { data, error } = await supabase
      .from('course_lessons')
      .insert([{
        module_id: parseInt(moduleId),
        title:     title.trim(),
        video_url: video_url || null,
        content:   content   || null,
        is_free:   is_free   ?? false,
        position:  pos
      }])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('createLesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create lesson' });
  }
};

// PUT /api/curriculum/lessons/:id
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, video_url, content, is_free, position } = req.body;

    const updates = {};
    if (title     !== undefined) updates.title     = title.trim();
    if (video_url !== undefined) updates.video_url = video_url || null;
    if (content   !== undefined) updates.content   = content   || null;
    if (is_free   !== undefined) updates.is_free   = is_free;
    if (position  !== undefined) updates.position  = position;

    const { data, error } = await supabase
      .from('course_lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('updateLesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update lesson' });
  }
};

// DELETE /api/curriculum/lessons/:id
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('course_lessons').delete().eq('id', id);
    if (error) throw error;
    return res.json({ success: true, message: 'Lesson deleted' });
  } catch (err) {
    console.error('deleteLesson error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete lesson' });
  }
};

module.exports = {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson
};
