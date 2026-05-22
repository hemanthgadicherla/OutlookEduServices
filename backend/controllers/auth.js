const crypto    = require('crypto');
const supabase  = require('../config/supabase');
const { supabaseUrl, serviceRoleKey } = require('../config/supabase');
const jwt       = require('jsonwebtoken');
const validator = require('validator');

// ── signInWithPassword via REST ──────────────────────────────────
const signInWithPassword = async (email, password) => {
  const res = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': serviceRoleKey },
      body: JSON.stringify({ email, password })
    }
  );
  const data = await res.json();
  if (!res.ok || data.error) return { data: null, error: data };
  return { data: { user: data.user }, error: null };
};

const signAdminToken = (admin, sessionId) =>
  jwt.sign(
    {
      id:         admin.id,
      email:      admin.email,
      role:       'admin',
      full_name:  admin.full_name || '',
      session_id: sessionId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


// ================================================================
// ADMIN LOGIN  —  POST /api/auth/login
// Reads from the separate `admins` table — never touches `users`.
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

    // Authenticate via Supabase Auth
    const { data: authData, error: authError } = await signInWithPassword(email, password);
    if (authError || !authData?.user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Look up in admins table ONLY — not users table
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, email, role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This account does not have admin privileges.'
      });
    }

    // full_name lives in Supabase auth user_metadata
    const full_name = authData.user?.user_metadata?.full_name || '';

    // Update session_id
    const sessionId = crypto.randomBytes(32).toString('hex');
    await supabase.from('admins').update({ session_id: sessionId }).eq('id', admin.id);

    const token = signAdminToken({ ...admin, full_name }, sessionId);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin.id, email: admin.email, full_name, role: admin.role }
    });

  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};


// ================================================================
// ADMIN SIGNUP  —  POST /api/auth/admin-signup
// Creates Supabase Auth user + row in `admins` table.
// Does NOT touch the `users` table.
// ================================================================
exports.adminSignup = async (req, res) => {
  try {
    let { email, password, full_name, phone, secret_key } = req.body;

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

    // Create Supabase Auth user (full_name + phone stored in user_metadata)
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

    // Insert into admins table — only columns that exist in the DB
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (existingAdmin) {
      await supabase.from('admins').update({ role: 'admin' }).eq('id', authData.user.id);
    } else {
      const { error: insertError } = await supabase
        .from('admins')
        .insert([{ id: authData.user.id, email, role: 'admin' }]);

      if (insertError) {
        console.error('Admin insert error:', insertError.message);
        return res.status(500).json({ success: false, message: 'Account created but failed to save admin profile' });
      }
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    await supabase.from('admins').update({ session_id: sessionId }).eq('id', authData.user.id);

    const token = signAdminToken({ id: authData.user.id, email, full_name, role: 'admin' }, sessionId);

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
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return res.json({ success: true, admin: req.user });
};
