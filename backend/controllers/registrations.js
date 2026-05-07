const supabase = require('../config/supabase');
const Joi = require('joi');

const registrationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  email: Joi.string().email().required(),
  selected_course: Joi.string().required(),
  country: Joi.string().optional(),
  message: Joi.string().max(500).optional()
});

const createRegistration = async (req, res) => {
  try {
    const { error, value } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { data, error: dbError } = await supabase
      .from('registrations')
      .insert([{
        student_name: value.full_name,
        email: value.email,
        phone: value.phone,
        selected_course: value.selected_course,
        country: value.country,
        message: value.message,
        payment_status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    res.status(201).json({
      success: true,
      message: 'Registration created successfully',
      data: data
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create registration'
    });
  }
};

const getRegistrations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
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
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
};

const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: data
    });

  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update registration'
    });
  }
};

module.exports = {
  createRegistration,
  getRegistrations,
  updateRegistration
};