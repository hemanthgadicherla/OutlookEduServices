const supabase = require('../config/supabase');
const { supabaseAnon } = require('../config/supabase');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const signAdminToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: 'admin', full_name: user.full_name || '' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


// ================================================================
// ADMIN LOGIN  —  POST /api/auth/login
// Uses Supabase Auth for password verification, then checks that
// the matching users row has role = 'admin'.
// ================================================================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Authenticate via Supabase Auth (must use anon client, not service role)
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    });

    if (authError || !authData?.user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check users table for admin role
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, role, is_active')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (userError || !user) {
      return res.status(401).json({ success: false, message: 'Account not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin accounts only.' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ success: false, message: 'This account has been disabled' });
    }

    // Update last_login
    supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id)
      .then(() => {}).catch(() => {});

    const token = signAdminToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    });

  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};


// ================================================================
// ADMIN SIGNUP  —  POST /api/auth/admin-signup
// Creates a Supabase Auth user + users row with role = 'admin'.
// Secured by a secret key in the request body so it can't be
// called by random users.
// ================================================================
exports.adminSignup = async (req, res) => {
  try {
    let { email, password, full_name, phone, secret_key } = req.body;

    // Guard: secret key is mandatory
    if (!secret_key || secret_key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(400).json({ success: false, message: 'Invalid admin secret key' });
    }

    if (!email || !password || !full_name || !phone) {
      return res.status(400).json({ success: false, message: 'Full name, email, phone and password are required' });
    }

    email     = email.trim().toLowerCase();
    full_name = full_name.trim();
    phone     = phone.trim();

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Phone must be a valid 10-digit Indian mobile number' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Check phone uniqueness
    const { data: existingPhone } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'This phone number is already registered' });
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone, role: 'admin' }
    });

    if (authError) {
      const msg = authError.message?.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists')) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }
      return res.status(400).json({ success: false, message: 'Failed to create admin account' });
    }

    // Check if users row already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (existingUser) {
      await supabase
        .from('users')
        .update({ role: 'admin', full_name, phone })
        .eq('id', authData.user.id);
    } else {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, email, full_name, phone, role: 'admin' }]);

      if (insertError) {
        console.error('Admin insert error:', insertError.message);
        return res.status(500).json({ success: false, message: 'Account created in Auth but failed to save profile' });
      }
    }

    // Sign token so frontend can log straight in after signup
    const token = signAdminToken({ id: authData.user.id, email, full_name, role: 'admin' });

    return res.status(201).json({
      success: true,
      message: `Admin account created for ${email}`,
      token,
      admin: { id: authData.user.id, email, full_name, role: 'admin' }
    });

  } catch (err) {
    console.error('Admin signup error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};


// ================================================================
// VERIFY ADMIN TOKEN  —  GET /api/auth/verify
// ================================================================
exports.verifyAdmin = async (req, res) => {
  // req.user is set by verifyToken middleware
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return res.json({ success: true, admin: req.user });
};
