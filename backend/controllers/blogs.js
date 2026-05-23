const supabase =
  require('../config/supabase');

const Joi =
  require('joi');


// VALIDATION SCHEMA
const blogSchema =
  Joi.object({

    title:
      Joi.string()

        .min(5)

        .max(200)

        .required(),

    slug:
      Joi.string()

        .pattern(
          /^[a-z0-9-]+$/
        )

        .min(5)

        .max(250)

        .required(),

    excerpt:
      Joi.string()

        .max(500)

        .required(),

    content:
      Joi.string().required(),

    image:
      Joi.string().allow(''),

    author:
      Joi.string()

        .required(),

    read_time:
      Joi.string()

        .required(),

    date:
      Joi.string().allow(''),

    category:
      Joi.string().allow(''),

    is_published:
      Joi.boolean().optional()

});


// CREATE BLOG
const createBlog = async (
  req,
  res
) => {

  try {

    const {
      error,
      value
    } = blogSchema.validate(
      req.body
    );


    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.details[0].message

      });

    }


    // Clean slug
    value.slug =
      value.slug
        .trim()
        .toLowerCase();


    // Duplicate slug check
    const { data: existingBlog } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', value.slug)
      .maybeSingle();

    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'A blog with this title already exists. Please use a different title.'
      });
    }


    const {
      data,
      error: dbError
    } = await supabase

      .from('blogs')

      .insert([value])

      .select()

      .single();


    if (dbError) {

      throw dbError;

    }


    res.status(201).json({

      success: true,

      message:
        'Blog created successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Create blog error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to create blog'

    });

  }

};


// UPDATE BLOG
const updateBlog = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      error,
      value
    } = blogSchema.validate(
      req.body
    );


    if (error) {

      return res.status(400).json({

        success: false,

        message:
          error.details[0].message

      });

    }


    value.slug =
      value.slug
        .trim()
        .toLowerCase();


    const {
      data,
      error: dbError
    } = await supabase

      .from('blogs')

      .update(value)

      .eq('id', id)

      .select()

      .single();


    if (dbError) {

      throw dbError;

    }


    res.json({

      success: true,

      message:
        'Blog updated successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Update blog error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to update blog'

    });

  }

};


// DELETE BLOG
const deleteBlog = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      error
    } = await supabase

      .from('blogs')

      .delete()

      .eq('id', id);


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Blog deleted successfully'

    });

  }

  catch (error) {

    console.error(
      'Delete blog error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to delete blog'

    });

  }

};


// GET BLOGS
const getBlogs = async (
  req,
  res
) => {

  try {

    const page =
      parseInt(
        req.query.page
      ) || 1;

    const limit = 10;

    const from =
      (page - 1) * limit;

    const to =
      from + limit - 1;


    const {
      data,
      error
    } = await supabase

      .from('blogs')

      .select('*')

      .range(from, to)

      .order(
        'created_at',
        {
          ascending: false
        }
      );


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      currentPage: page,

      data

    });

  }

  catch (error) {

    console.error(
      'Get blogs error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch blogs'

    });

  }

};


// GET SINGLE BLOG
const getSingleBlog = async (
  req,
  res
) => {

  try {

    const { slug } =
      req.params;


    if (!slug) {

      return res.status(400).json({

        success: false,

        message:
          'Slug required'

      });

    }


    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }


    res.json({

      success: true,

      data

    });

  }

  catch (error) {

    console.error(
      'Get single blog error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch blog'

    });

  }

};


module.exports = {

  createBlog,

  updateBlog,

  deleteBlog,

  getBlogs,

  getSingleBlog

};