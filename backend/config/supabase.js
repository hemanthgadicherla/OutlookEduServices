const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl      = process.env.SUPABASE_URL?.trim();
const serviceRoleKey   = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const anonKey          = process.env.SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// ── Service-role client ──────────────────────────────────────────
// Used for: admin.createUser, DB queries (bypasses RLS), etc.
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken:   false,
    persistSession:     false,
    detectSessionInUrl: false
  }
});

// ── Anon / public client ─────────────────────────────────────────
// Used for signInWithPassword and OAuth flows.
// Uses SUPABASE_ANON_KEY if set, otherwise falls back to service role key.
// NOTE: signInWithPassword works with either key on the server side
// when called from a trusted backend environment.
const supabaseAnon = createClient(supabaseUrl, anonKey || serviceRoleKey, {
  auth: {
    autoRefreshToken:   false,
    persistSession:     false,
    detectSessionInUrl: false
  }
});

module.exports = supabase;
module.exports.supabaseAnon = supabaseAnon;
module.exports.supabaseUrl  = supabaseUrl;
module.exports.serviceRoleKey = serviceRoleKey;
