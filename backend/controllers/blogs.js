const supabase = require('../config/supabase');

const getBlogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs'
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title,
        content,
        image,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: data
    });

  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog'
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: data
    });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog'
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog'
    });
  }
};

module.exports = {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
};