const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const validator = require('validator');


// =========================
// HELPERS
// =========================

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
  let { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!user) {
    const insertData = { id, email, full_name: full_name || '', role: 'user' };
    if (phone) insertData.phone = phone;

    const { data: newUser, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('upsertUser insert error:', error);
      throw new Error(`Failed to create user record: ${error.message}`);
    }
    user = newUser;
  } else if (phone && !user.phone) {
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

// Include full_name in JWT so Navbar can display it without an extra API call
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name || '' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '7d' }
  );


// =========================
// EMAIL / PASSWORD LOGIN
// =========================
const login = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  email = email.trim().toLowerCase();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data?.user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const supaUser = data.user;
  const full_name =
    supaUser.user_metadata?.full_name ||
    supaUser.user_metadata?.name ||
    '';
  const phone = supaUser.user_metadata?.phone || null;

  const user = await upsertUser(supaUser.id, supaUser.email, full_name, phone);

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  if (user.role === 'admin') {
    const token = signToken(user);
    return res.json({ success: true, token, role: 'admin', redirect: '/admin/dashboard' });
  }

  const { role, redirect } = await resolveAccess(user.id);
  const token = signToken({ ...user, role });

  return res.json({ success: true, token, role, redirect });
};


// =========================
// REGISTER
// =========================
const register = async (req, res) => {
  let { email, password, full_name, phone } = req.body;

  if (!email || !password || !full_name || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, phone and password are required' });
  }

  email = email.trim().toLowerCase();
  full_name = full_name.trim();
  phone = phone.trim();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian phone number' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const { data: existingPhone } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();

  if (existingPhone) {
    return res.status(400).json({ success: false, message: 'Phone number already in use' });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone }
  });

  if (error) {
    const msg =
      error.message?.toLowerCase().includes('already registered') ||
      error.message?.toLowerCase().includes('already exists')
        ? 'Email already in use'
        : 'Registration failed. Please try again.';
    return res.status(400).json({ success: false, message: msg });
  }

  const user = await upsertUser(data.user.id, email, full_name, phone);
  const token = signToken(user);

  return res.status(201).json({ success: true, token, role: user.role, redirect: '/' });
};


// =========================
// GOOGLE OAUTH — INITIATE
// =========================
const googleOAuthUrl = async (req, res) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/user-auth/google/callback`
    }
  });

  if (error || !data?.url) {
    return res.status(500).json({ success: false, message: 'Failed to generate OAuth URL' });
  }

  return res.json({ success: true, url: data.url });
};


// =========================
// GOOGLE OAUTH — CALLBACK
// =========================
const googleOAuthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }

  const supaUser = data.user;
  const full_name =
    supaUser.user_metadata?.full_name ||
    supaUser.user_metadata?.name ||
    '';

  const user = await upsertUser(supaUser.id, supaUser.email, full_name);

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  let role = user.role;
  let redirect = '/admin/dashboard';

  if (role !== 'admin') {
    const access = await resolveAccess(user.id);
    role = access.role;
    redirect = access.redirect;
  }

  const token = signToken({ ...user, role });

  return res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${token}&role=${role}&redirect=${encodeURIComponent(redirect)}`
  );
};


// =========================
// LOGOUT
// =========================
const logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out' });
};


// =========================
// GET CURRENT USER
// =========================
const getMe = async (req, res) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, email, full_name, phone, role, avatar_url, created_at')
    .eq('id', req.user.id)
    .maybeSingle();

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, user });
};


// =========================
// UPDATE CURRENT USER
// =========================
const updateMe = async (req, res) => {
  const { full_name, phone } = req.body;

  if (!full_name && !phone) {
    return res.status(400).json({ success: false, message: 'Nothing to update' });
  }

  const updates = {};

  if (full_name) updates.full_name = full_name.trim();

  if (phone) {
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian phone number' });
    }
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone.trim())
      .neq('id', req.user.id)
      .maybeSingle();
    if (existing) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
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
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }

  return res.json({ success: true, user });
};


// =========================
// LEGACY — CHECK ACCESS
// =========================
const checkUserAccess = async (req, res) => {
  const { id, email, full_name } = req.body;

  if (!email || !id) {
    return res.status(400).json({ success: false, message: 'User data required' });
  }

  const user = await upsertUser(id, email, full_name || '');

  if (user.role === 'admin') {
    return res.json({ success: true, role: 'admin', redirect: '/admin/dashboard' });
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
