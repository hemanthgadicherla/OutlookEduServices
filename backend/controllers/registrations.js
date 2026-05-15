const supabase = require('../config/supabase');
const Joi = require('joi');

const registrationSchema = Joi.object({
  full_name: Joi.string()
    .min(2)
    .max(100)
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  selected_course: Joi.string()
    .required(),

  country: Joi.string()
    .optional(),

  message: Joi.string()
    .max(500)
    .optional()
});


// CREATE REGISTRATION
const createRegistration = async (
  req,
  res
) => {

  try {

    const {
      error,
      value
    } = registrationSchema.validate(
      req.body
    );

    // Validate Request
    if (error) {

      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });

    }

    // Normalize Email
    value.email =
      value.email.trim().toLowerCase();

    // Check Duplicate Registration
    const {
      data: existingUser
    } = await supabase

      .from('registrations')

      .select('id')

      .eq('email', value.email)

      .eq(
        'selected_course',
        value.selected_course
      )

      .single();


    if (existingUser) {

      return res.status(400).json({

        success: false,

        message:
          'You already registered for this course'

      });

    }


    // Insert Registration
    const {
      data,
      error: dbError
    } = await supabase

      .from('registrations')

      .insert([{

        student_name:
          value.full_name,

        email: value.email,

        phone: value.phone,

        selected_course:
          value.selected_course,

        country: value.country,

        message: value.message,

        payment_status: 'pending',

        created_at:
          new Date().toISOString()

      }])

      .select()

      .single();


    if (dbError) {

      throw dbError;

    }


    res.status(201).json({

      success: true,

      message:
        'Registration created successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Registration error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to create registration'

    });

  }

};


// GET REGISTRATIONS
const getRegistrations = async (
  req,
  res
) => {

  try {

    // Pagination
    const page =
      parseInt(req.query.page) || 1;

    const limit = 10;

    const from =
      (page - 1) * limit;

    const to =
      from + limit - 1;


    const {
      data,
      error
    } = await supabase

      .from('registrations')

      .select('*')

      .range(from, to)

      .order('created_at', {
        ascending: false
      });


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
      'Get registrations error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch registrations'

    });

  }

};


// UPDATE REGISTRATION
const updateRegistration = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    if (!id) {

      return res.status(400).json({

        success: false,

        message:
          'Registration ID required'

      });

    }


    // VALIDATE STATUS
    const validStatuses = [

      'pending',

      'paid',

      'failed'

    ];


    if (

      req.body.payment_status &&

      !validStatuses.includes(
        req.body.payment_status
      )

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid payment status'

      });

    }


    // ALLOWED UPDATES
    const allowedUpdates = {

      payment_status:
        req.body.payment_status,

      message:
        req.body.message

    };


    // REMOVE UNDEFINED
    const filteredUpdates =
      Object.fromEntries(

        Object.entries(
          allowedUpdates
        ).filter(

          ([_, value]) =>
            value !== undefined

        )

      );


    // UPDATE REGISTRATION
    const {

      data,

      error

    } = await supabase

      .from('registrations')

      .update(filteredUpdates)

      .eq('id', id)

      .select()

      .single();


    if (error) {

      throw error;

    }


    // =========================
    // LMS ACCESS LOGIC
    // =========================
    if (
      req.body.payment_status ===
      'paid'
    ) {

      // FIND USER
      const {

        data: user

      } = await supabase

        .from('users')

        .select('*')

        .eq(
          'email',
          data.email
        )

        .single();


      if (user) {

        // FIND COURSE
        const {

          data: course

        } = await supabase

          .from('courses')

          .select('*')

          .eq(
            'title',
            data.selected_course
          )

          .single();


        if (course) {

          // CHECK EXISTING ACCESS
          const {

            data: existingAccess

          } = await supabase

            .from('user_courses')

            .select('*')

            .eq(
              'user_id',
              user.id
            )

            .eq(
              'course_id',
              course.id
            )

            .single();


          // CREATE ACCESS
          if (!existingAccess) {

            await supabase

              .from('user_courses')

              .insert([{

                user_id:
                  user.id,

                course_id:
                  course.id,

                payment_status:
                  'paid',

                created_at:
                  new Date().toISOString()

              }]);

          }

        }

      }

    }


    res.json({

      success: true,

      message:
        'Registration updated successfully',

      data

    });

  }

  catch (error) {

    console.error(

      'Update registration error:',

      error

    );

    res.status(500).json({

      success: false,

      message:
        'Failed to update registration'

    });

  }

};

// DELETE REGISTRATION
const deleteRegistration = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {
      error
    } = await supabase

      .from('registrations')

      .delete()

      .eq('id', id);


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Registration deleted successfully'

    });

  }

  catch (error) {

    console.error(
      'Delete registration error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to delete registration'

    });

  }

};


module.exports = {

  createRegistration,

  getRegistrations,

  updateRegistration,

  deleteRegistration

};