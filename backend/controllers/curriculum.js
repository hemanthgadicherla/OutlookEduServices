const supabase = require('../config/supabase');
const { createBunnyVideo, getBunnyTusCredentials, deleteBunnyVideo } = require('../utils/bunny');

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

// ─────────────────────────────────────────────────────────────
// POST /api/curriculum/lessons/:id/bunny-upload-token
// Admin: creates a Bunny Stream video object and returns TUS
// credentials so the browser can upload directly to Bunny CDN
// without ever seeing the raw API key.
// ─────────────────────────────────────────────────────────────
const getBunnyUploadToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { title: videoTitle, description: videoDescription } = req.body || {};

    const { data: lesson } = await supabase
      .from('course_lessons').select('id, title').eq('id', id).maybeSingle();
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

    // Create the video object in Bunny Stream
    const video   = await createBunnyVideo(videoTitle || lesson.title, videoDescription || '');
    const videoId = video.guid;

    // Generate TUS credentials (no raw API key sent to client)
    const creds = getBunnyTusCredentials(videoId);

    // Record the Bunny video ID in DB immediately
    await supabase.from('course_lessons')
      .update({ video_url: `bunny:${videoId}` })
      .eq('id', id);

    return res.json({ success: true, data: creds });
  } catch (err) {
    console.error('getBunnyUploadToken error:', err.message);
    // Return the actual error message so the frontend can show it
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to create Bunny video'
    });
  }
};

// DELETE /api/curriculum/lessons/:id/video
// Admin: removes the video from Bunny Stream (or Supabase) and clears video_url.
// Won't delete from Bunny if another lesson still references the same videoId.
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: lesson } = await supabase
      .from('course_lessons').select('video_url').eq('id', id).maybeSingle();

    if (lesson?.video_url?.startsWith('bunny:')) {
      const videoId = lesson.video_url.replace('bunny:', '');
      // Only delete from Bunny if no other lesson shares this video
      const { count } = await supabase
        .from('course_lessons')
        .select('id', { count: 'exact', head: true })
        .eq('video_url', lesson.video_url)
        .neq('id', id);
      if ((count || 0) === 0) {
        await deleteBunnyVideo(videoId).catch(e => console.warn('Bunny delete warning:', e.message));
      }
    } else if (lesson?.video_url?.startsWith('storage:')) {
      const path = lesson.video_url.replace('storage:', '');
      await supabase.storage.from('course-videos').remove([path]);
    }

    await supabase.from('course_lessons').update({ video_url: null }).eq('id', id);
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteVideo error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

// GET /api/curriculum/videos
// Admin: returns all lessons that have a video, with course + module context (for library picker)
const listVideos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('course_lessons')
      .select(`
        id, title, video_url,
        course_modules ( id, title, courses ( id, title ) )
      `)
      .not('video_url', 'is', null)
      .order('id', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error('listVideos error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list videos' });
  }
};

// PUT /api/curriculum/lessons/:id/video-url
// Admin: directly set a lesson's video_url (for URL input or library reuse)
const setVideoUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { video_url } = req.body;
    if (!video_url?.trim()) return res.status(400).json({ success: false, message: 'video_url is required' });

    const { data, error } = await supabase
      .from('course_lessons')
      .update({ video_url: video_url.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) {
    console.error('setVideoUrl error:', err);
    return res.status(500).json({ success: false, message: 'Failed to set video URL' });
  }
};

// PUT /api/curriculum/lessons/reorder
// Admin: batch-update lesson positions within a module
const reorderLessons = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, position }]
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'items array required' });

    await Promise.all(
      items.map(({ id, position }) =>
        supabase.from('course_lessons').update({ position }).eq('id', id)
      )
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('reorderLessons error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder lessons' });
  }
};

// PUT /api/curriculum/modules/reorder
// Admin: batch-update module positions within a course
const reorderModules = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, position }]
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'items array required' });

    await Promise.all(
      items.map(({ id, position }) =>
        supabase.from('course_modules').update({ position }).eq('id', id)
      )
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('reorderModules error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reorder modules' });
  }
};

module.exports = {
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
};
