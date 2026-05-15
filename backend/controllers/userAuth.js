const supabase =
  require('../config/supabase');


// CHECK USER ACCESS
const checkUserAccess =
  async (req, res) => {

  try {

    const {

      id,

      email,

      full_name

    } = req.body;


    if (!email || !id) {

      return res.status(400).json({

        success: false,

        message:
          'User data required'

      });

    }


    // CHECK USER EXISTS
    let {

      data: user

    } = await supabase

      .from('users')

      .select('*')

      .eq('id', id)

      .single();


    // CREATE USER IF NOT EXISTS
    if (!user) {

      const {

        data: newUser,

        error: createError

      } = await supabase

        .from('users')

        .insert([{

          id,

          email,

          full_name,

          role: 'user'

        }])

        .select()

        .single();


      if (createError) {

        throw createError;

      }


      user = newUser;

    }


    // ADMIN CHECK
    if (user.role === 'admin') {

      return res.json({

        success: true,

        role: 'admin',

        redirect:
          '/admin/dashboard'

      });

    }


    // CHECK PAID COURSES
    const {

      data: paidCourses

    } = await supabase

      .from('user_courses')

      .select('*')

      .eq('user_id', id)

      .eq(
        'payment_status',
        'paid'
      );


    // LMS ACCESS
    if (
      paidCourses &&
      paidCourses.length > 0
    ) {

      return res.json({

        success: true,

        role: 'student',

        redirect: '/lms'

      });

    }


    // NORMAL USER
    return res.json({

      success: true,

      role: 'user',

      redirect: '/'

    });

  }

  catch (error) {

    console.error(
      'Check user access error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to check user access'

    });

  }

};


module.exports = {

  checkUserAccess

};