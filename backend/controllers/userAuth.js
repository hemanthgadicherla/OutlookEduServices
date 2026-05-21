const crypto   = require('crypto');
const supabase = require('../config/supabase');
const { supabaseAnon, supabaseUrl, serviceRoleKey } = require('../config/supabase');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// ── signInWithPassword via REST (works with service role key) ────
const signInWithPassword = async (email, password) => {
  const res = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey
      },
      body: JSON.stringify({ email, password })
    }
  );
  const data = await res.json();
  if (!res.ok || data.error) {
    return { data: null, error: data };
  }
  return { data: { user: data.user }, error: null };
};


// ================================================================
// HELPERS
// ================================================================

const resolveAccess = async (userId) => {
  const { data: paidCourses } = await supabase
    .from('user_courses')
    .select('id')
    .eq('user_id', userId)
    .eq('payment_status', 'paid');

  if (paidCourses && paidCourses.length > 0) {
    return { role: 'student', redirect: '/lms' };
  }
  return { role: 'user', redirect: '/' };
};

const upsertUser = async (id, email, full_name, phone = null) => {
  // Try to find existing row by id first
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!user) {
    // Check if the phone is already taken by a different user — if so, drop it
    // to avoid a unique constraint violation. The user can update their phone later.
    let safePhone = phone;
    if (safePhone) {
      const { data: phoneOwner } = await supabase
        .from('users')
        .select('id')
        .eq('phone', safePhone)
        .maybeSingle();
      if (phoneOwner && phoneOwner.id !== id) {
        safePhone = null; // phone belongs to someone else — don't copy it
      }
    }

    const insertData = {
      id,
      email,
      full_name: full_name || '',
      role: 'user',
      ...(safePhone ? { phone: safePhone } : {})
    };

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // Last-resort: another request may have inserted the row between our
      // SELECT and INSERT (race condition). Try fetching again before giving up.
      if (error.code === '23505') {
        const { data: raceUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (raceUser) return raceUser;
      }
      console.error('upsertUser insert error:', error.message);
      throw new Error(`Failed to create user record: ${error.message}`);
    }
    user = newUser;
  } else if (phone && !user.phone) {
    // Row exists but has no phone — try to set it, ignore if already taken
    const { data: updated } = await supabase
      .from('users')
      .update({ phone })
      .eq('id', id)
      .select()
      .single();
    if (updated) user = updated;
  }

  return user;
};

// full_name included so Navbar can read it from JWT without an API call
// session_id is used to invalidate all other active sessions on new login
const signToken = (user, sessionId) =>
  jwt.sign(
    {
      id:         user.id,
      email:      user.email,
      role:       user.role,
      full_name:  user.full_name || '',
      session_id: sessionId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


// ================================================================
// LOGIN
// ================================================================
const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  email = email.trim().toLowerCase();

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  const { data, error } = await signInWithPassword(email, password);

  if (error || !data?.user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  const supaUser = data.user;
  const full_name =
    supaUser.user_metadata?.full_name ||
    supaUser.user_metadata?.name ||
    '';
  const phone = supaUser.user_metadata?.phone || null;

  const user = await upsertUser(supaUser.id, supaUser.email, full_name, phone);

  // Generate a new session_id — invalidates all previous sessions for this user
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Store session_id in DB — any token with a different session_id will be rejected
  await supabase
    .from('users')
    .update({ session_id: sessionId, last_login: new Date().toISOString() })
    .eq('id', user.id);

  if (user.role === 'admin') {
    const token = signToken(user, sessionId);
    return res.json({
      success: true,
      token,
      role: 'admin',
      redirect: '/admin/dashboard'
    });
  }

  const { role, redirect } = await resolveAccess(user.id);
  const token = signToken({ ...user, role }, sessionId);

  return res.json({ success: true, token, role, redirect });
};


// ================================================================
// REGISTER
// ================================================================
const register = async (req, res) => {
  let { email, password, full_name, phone } = req.body;

  // ── field presence ──────────────────────────────────────────
  const missing = [];
  if (!full_name) missing.push('full name');
  if (!email)     missing.push('email');
  if (!phone)     missing.push('phone number');
  if (!password)  missing.push('password');

  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Please provide: ${missing.join(', ')}`
    });
  }

  // ── sanitise ────────────────────────────────────────────────
  email     = email.trim().toLowerCase();
  full_name = full_name.trim();
  phone     = phone.trim();

  // ── email format ────────────────────────────────────────────
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address'
    });
  }

  // ── phone format (10-digit Indian mobile) ───────────────────
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Phone must be a valid 10-digit Indian mobile number (starts with 6–9)'
    });
  }

  // ── password length ─────────────────────────────────────────
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  // ── phone uniqueness ────────────────────────────────────────
  const { data: existingPhone } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();

  if (existingPhone) {
    return res.status(400).json({
      success: false,
      message: 'This phone number is already registered'
    });
  }

  // ── create Supabase Auth user ────────────────────────────────
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone }
  });

  if (error) {
    console.error('Supabase createUser error:', error.message);

    // map known Supabase error messages to user-friendly ones
    const msg = error.message?.toLowerCase();
    if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('duplicate')) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in instead.'
      });
    }
    if (msg.includes('password')) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements. Use at least 6 characters.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }

  // ── create users table row ───────────────────────────────────
  const user = await upsertUser(data.user.id, email, full_name, phone);

  const sessionId = crypto.randomBytes(32).toString('hex');
  await supabase.from('users').update({ session_id: sessionId }).eq('id', user.id);

  const token = signToken(user, sessionId);

  return res.status(201).json({
    success: true,
    token,
    role: user.role,
    redirect: '/'
  });
};


// ================================================================
// GOOGLE OAUTH — INITIATE
// ================================================================
const googleOAuthUrl = async (req, res) => {
  const { data, error } = await supabaseAnon.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/user-auth/google/callback`
    }
  });

  if (error || !data?.url) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate Google login URL'
    });
  }

  return res.json({ success: true, url: data.url });
};


// ================================================================
// GOOGLE OAUTH — CALLBACK
// ================================================================
const googleOAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const { data, error } = await supabaseAnon.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const supaUser = data.user;
  const full_name =
    supaUser.user_metadata?.full_name ||
    supaUser.user_metadata?.name ||
    '';

  const user = await upsertUser(supaUser.id, supaUser.email, full_name);

  const sessionId = crypto.randomBytes(32).toString('hex');
  await supabase
    .from('users')
    .update({ session_id: sessionId, last_login: new Date().toISOString() })
    .eq('id', user.id);

  let role = user.role;
  let redirect = '/admin/dashboard';

  if (role !== 'admin') {
    const access = await resolveAccess(user.id);
    role = access.role;
    redirect = access.redirect;
  }

  const token = signToken({ ...user, role }, sessionId);

  return res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${token}&role=${role}&redirect=${encodeURIComponent(redirect)}`
  );
};


// ================================================================
// LOGOUT
// ================================================================
const logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out' });
};


// ================================================================
// GET CURRENT USER
// ================================================================
const getMe = async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, full_name, phone, role, avatar_url, created_at')
    .eq('id', req.user.id)
    .maybeSingle();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  return res.json({ success: true, user });
};


// ================================================================
// UPDATE CURRENT USER
// ================================================================
const updateMe = async (req, res) => {
  const { full_name, phone } = req.body;

  if (!full_name && !phone) {
    return res.status(400).json({
      success: false,
      message: 'Nothing to update'
    });
  }

  const updates = {};

  if (full_name) {
    updates.full_name = full_name.trim();
  }

  if (phone) {
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be a valid 10-digit Indian mobile number'
      });
    }
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone.trim())
      .neq('id', req.user.id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This phone number is already registered to another account'
      });
    }
    updates.phone = phone.trim();
  }

  const { data: user, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, email, full_name, phone, role, avatar_url, created_at')
    .single();

  if (error) {
    console.error('updateMe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again.'
    });
  }

  // Issue a fresh JWT keeping the same session_id so the current device stays logged in
  const token = signToken(user, req.user.session_id);

  return res.json({ success: true, user, token });
};


// ================================================================
// LEGACY — CHECK ACCESS
// ================================================================
const checkUserAccess = async (req, res) => {
  const { id, email, full_name } = req.body;

  if (!email || !id) {
    return res.status(400).json({
      success: false,
      message: 'User data required'
    });
  }

  const user = await upsertUser(id, email, full_name || '');

  if (user.role === 'admin') {
    return res.json({
      success: true,
      role: 'admin',
      redirect: '/admin/dashboard'
    });
  }

  const { role, redirect } = await resolveAccess(user.id);
  return res.json({ success: true, role, redirect });
};


module.exports = {
  login,
  register,
  googleOAuthUrl,
  googleOAuthCallback,
  logout,
  getMe,
  updateMe,
  checkUserAccess
};
