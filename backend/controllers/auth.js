const crypto   = require('crypto');
const bcrypt   = require('bcryptjs');
const supabase = require('../config/supabase');
const jwt      = require('jsonwebtoken');
const validator = require('validator');

// Actual admins table columns: id (int), email, password, role, created_at, session_id

const signAdminToken = (admin, sessionId) =>
  jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin', session_id: sessionId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


// ================================================================
// ADMIN LOGIN  —  POST /api/auth/login
// Direct bcrypt auth against admins table (integer PK + password col)
// ================================================================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, email, password, role')
      .eq('email', email)
      .maybeSingle();

    if (error || !admin)
      return res.status(403).json({ success: false, message: 'Access denied. This account does not have admin privileges.' });

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const sessionId = crypto.randomBytes(32).toString('hex');
    await supabase.from('admins').update({ session_id: sessionId }).eq('id', admin.id);

    const token = signAdminToken(admin, sessionId);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, role: admin.role }
    });

  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};


// ================================================================
// ADMIN SIGNUP  —  POST /api/auth/admin-signup
// Inserts directly into admins table with bcrypt password hash.
// Does NOT touch Supabase auth.
// ================================================================
exports.adminSignup = async (req, res) => {
  try {
    let { email, password, full_name, phone, secret_key } = req.body;

    if (!secret_key || secret_key !== process.env.ADMIN_SECRET_KEY)
      return res.status(400).json({ success: false, message: 'Invalid admin secret key' });

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    email = email.trim().toLowerCase();

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    // Check email uniqueness
    const { data: existing } = await supabase
      .from('admins').select('id').eq('email', email).maybeSingle();

    if (existing)
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newAdmin, error: insertError } = await supabase
      .from('admins')
      .insert([{ email, password: hashedPassword, role: 'admin' }])
      .select('id, email, role')
      .single();

    if (insertError) {
      console.error('Admin insert error:', insertError.message);
      return res.status(500).json({ success: false, message: 'Failed to create admin account' });
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    await supabase.from('admins').update({ session_id: sessionId }).eq('id', newAdmin.id);

    const token = signAdminToken(newAdmin, sessionId);

    return res.status(201).json({
      success: true,
      message: `Admin account created for ${email}`,
      token,
      admin: { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role }
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
  if (req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required' });
  return res.json({ success: true, admin: req.user });
};
