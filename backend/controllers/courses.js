const supabase =
  require('../config/supabase');

const {
  courseSchema
} = require(
  '../validators/courseValidator'
);


// GET COURSES
const getCourses = async (
  req,
  res
) => {

  try {

    const {
      data,
      error
    } = await supabase

      .from('courses')

      .select('*')

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

      data

    });

  }

  catch (error) {

    console.error(
      'Get courses error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch courses'

    });

  }

};


// CREATE COURSE
const createCourse = async (
  req,
  res
) => {

  try {

    const {

      title,

      description,

      fullDescription,

      price,

      image

    } = req.body;


    // Validation
    const {
      error: validationError
    } = courseSchema.validate(
      req.body
    );


    if (validationError) {

      return res.status(400).json({

        success: false,

        message:
          validationError
            .details[0]
            .message

      });

    }


    // Insert Course
    const {
      data,
      error
    } = await supabase

      .from('courses')

      .insert([{

        title,

        description,

        full_description:
          fullDescription,

        price:
          parseFloat(price),

        image,

        created_at:
          new Date().toISOString()

      }])

      .select()

      .single();


    if (error) {

      throw error;

    }


    res.status(201).json({

      success: true,

      message:
        'Course created successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Create course error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to create course'

    });

  }

};


// UPDATE COURSE
const updateCourse = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!id) {

      return res.status(400).json({

        success: false,

        message:
          'Course ID required'

      });

    }


    const {

      title,

      description,

      fullDescription,

      price,

      image

    } = req.body;


    const updates = {

      title,

      description,

      full_description:
        fullDescription,

      price,

      image

    };


    // Remove Undefined
    const filteredUpdates =
      Object.fromEntries(

        Object.entries(
          updates
        ).filter(

          ([_, value]) =>
            value !== undefined

        )

      );


    // Validation
    const {
      error: validationError
    } = courseSchema.validate(
      filteredUpdates
    );


    if (validationError) {

      return res.status(400).json({

        success: false,

        message:
          validationError
            .details[0]
            .message

      });

    }


    // Update Course
    const {
      data,
      error
    } = await supabase

      .from('courses')

      .update(
        filteredUpdates
      )

      .eq('id', id)

      .select()

      .single();


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Course updated successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Update course error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to update course'

    });

  }

};


// DELETE COURSE
const deleteCourse = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      error
    } = await supabase

      .from('courses')

      .delete()

      .eq('id', id);


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Course deleted successfully'

    });

  }

  catch (error) {

    console.error(
      'Delete course error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to delete course'

    });

  }

};


module.exports = {

  getCourses,

  createCourse,

  updateCourse,

  deleteCourse

};