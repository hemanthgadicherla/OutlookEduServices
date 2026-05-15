const supabase =
  require('../config/supabase');


// GET USER COURSES
const getUserCourses =
  async (req, res) => {

  try {

    const { user_id } =
      req.query;


    if (!user_id) {

      return res.status(400).json({

        success: false,

        message:
          'User ID required'

      });

    }


    // GET PURCHASED COURSES
    const {

      data: userCourses,

      error

    } = await supabase

      .from('user_courses')

      .select(`

        course_id,

        payment_status,

        courses (

          id,

          title,

          description,

          image

        )

      `)

      .eq(
        'user_id',
        user_id
      )

      .eq(
        'payment_status',
        'paid'
      );


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      data: userCourses

    });

  }

  catch (error) {

    console.error(
      'Get LMS courses error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch LMS courses'

    });

  }

};


module.exports = {

  getUserCourses

};