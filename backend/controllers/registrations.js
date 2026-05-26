const supabase = require('../config/supabase');
const Joi = require('joi');

const registrationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  phone:     Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email:     Joi.string().email().required(),
  course_id: Joi.number().integer().optional().allow(null),
  selected_course: Joi.string().required(),
  country:  Joi.string().optional().allow('', null),
  message:  Joi.string().max(500).optional().allow('', null),
  user_id:  Joi.string().uuid().optional().allow(null)
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
    value.email = value.email.trim().toLowerCase();

    // Block ONLY if this exact email + same course is already PAID
    // Allow the same user to register for different courses freely
    const { data: existingPaid } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', value.email)
      .eq('selected_course', value.selected_course)
      .eq('payment_status', 'paid')
      .maybeSingle();

    if (existingPaid) {
      return res.status(400).json({
        success: false,
        message: 'You have already enrolled in this course'
      });
    }

    // If a pending registration exists for same email + course, reuse it
    // so the user can retry payment without creating a duplicate row
    const { data: existingPending } = await supabase
      .from('registrations')
      .select('*')
      .eq('email', value.email)
      .eq('selected_course', value.selected_course)
      .eq('payment_status', 'pending')
      .maybeSingle();

    if (existingPending) {
      return res.status(200).json({
        success: true,
        message: 'Registration already exists. Proceeding to payment.',
        data: existingPending
      });
    }

    // Insert Registration
    const { data, error: dbError } = await supabase
      .from('registrations')
      .insert([{
        user_id:         value.user_id    || null,
        student_name:    value.full_name,
        email:           value.email,
        phone:           value.phone,
        course_id:       value.course_id  || null,
        selected_course: value.selected_course,
        country:         value.country    || null,
        message:         value.message    || null,
        payment_status:  'pending',
        created_at:      new Date().toISOString()
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
const getRegistrations = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const all    = req.query.all === 'true';
    const search = (req.query.search || '').trim();
    const status = req.query.status || '';   // 'paid' | 'pending' | 'failed' | ''

    // Build base query with optional filters
    const applyFilters = (q) => {
      if (status && ['paid', 'pending', 'failed'].includes(status)) {
        q = q.eq('payment_status', status);
      }
      if (search) {
        // Supabase ilike OR across multiple columns
        q = q.or(
          `student_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,selected_course.ilike.%${search}%`
        );
      }
      return q;
    };

    // Count with filters applied
    let countQuery = supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });
    countQuery = applyFilters(countQuery);

    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    const total = count || 0;

    // Fetch data — all rows or paginated
    let query = supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    query = applyFilters(query);

    if (!all) {
      const from = (page - 1) * limit;
      const to   = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      success:     true,
      data:        data || [],
      total,
      currentPage: page,
      totalPages:  all ? 1 : Math.ceil(total / limit) || 1,
      limit
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
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
    if (req.body.payment_status === 'paid') {
      // Grant LMS access when admin marks as paid
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (user) {
        let courseId = data.course_id;

        if (!courseId) {
          const { data: course } = await supabase
            .from('courses')
            .select('id')
            .eq('title', data.selected_course)
            .maybeSingle();
          courseId = course?.id;
        }

        if (courseId) {
          // Upsert — safe to call multiple times
          await supabase
            .from('user_courses')
            .upsert([{
              user_id:        user.id,
              course_id:      courseId,
              payment_status: 'paid',
              created_at:     new Date().toISOString()
            }], { onConflict: 'user_id,course_id' });

          // Upgrade role to student if still 'user'
          await supabase
            .from('users')
            .update({ role: 'student' })
            .eq('id', user.id)
            .eq('role', 'user');
        }
      }
    }

    if (req.body.payment_status === 'pending' || req.body.payment_status === 'failed') {
      // Revoke LMS access when admin marks as pending or failed
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (user) {
        let courseId = data.course_id;

        if (!courseId) {
          const { data: course } = await supabase
            .from('courses')
            .select('id')
            .eq('title', data.selected_course)
            .maybeSingle();
          courseId = course?.id;
        }

        if (courseId) {
          // Remove LMS access row
          await supabase
            .from('user_courses')
            .delete()
            .eq('user_id', user.id)
            .eq('course_id', courseId);

          // If user has no remaining paid courses, downgrade role back to 'user'
          const { data: remainingCourses } = await supabase
            .from('user_courses')
            .select('id')
            .eq('user_id', user.id)
            .eq('payment_status', 'paid');

          if (!remainingCourses || remainingCourses.length === 0) {
            await supabase
              .from('users')
              .update({ role: 'user' })
              .eq('id', user.id)
              .eq('role', 'student');
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