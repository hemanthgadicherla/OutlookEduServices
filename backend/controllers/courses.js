const supabase = require('../config/supabase');
const { courseSchema } = require('../validators/courseValidator');


// GET COURSES — returns all, frontend splits active/upcoming
const getCourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};


// CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const { error: validationError } = courseSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.details[0].message });
    }

    const { title, description, fullDescription, price, image, is_published } = req.body;

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        title,
        description,
        full_description: fullDescription || '',
        price:            parseFloat(price),
        image:            image || '',
        is_published:     is_published !== undefined ? is_published : true,
        created_at:       new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: 'Course created successfully', data });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
};


// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Course ID required' });

    const { error: validationError } = courseSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError.details[0].message });
    }

    const { title, description, fullDescription, price, image, is_published } = req.body;

    const updates = {};
    if (title            !== undefined) updates.title            = title;
    if (description      !== undefined) updates.description      = description;
    if (fullDescription  !== undefined) updates.full_description = fullDescription;
    if (price            !== undefined) updates.price            = parseFloat(price);
    if (image            !== undefined) updates.image            = image;
    if (is_published     !== undefined) updates.is_published     = is_published;

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Course updated successfully', data });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};


// TOGGLE STATUS — PATCH /:id/status
// Body: { is_published: true | false }
const toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ success: false, message: 'is_published must be a boolean' });
    }

    const { data, error } = await supabase
      .from('courses')
      .update({ is_published })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Course marked as ${is_published ? 'Active' : 'Upcoming'}`,
      data
    });
  } catch (error) {
    console.error('Toggle course status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course status' });
  }
};


// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
};


module.exports = { getCourses, createCourse, updateCourse, toggleCourseStatus, deleteCourse };
