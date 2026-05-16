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
// Cannot be used for signInWithPassword — service role has no session.
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken:   false,
    persistSession:     false,
    detectSessionInUrl: false
  }
});

// ── Anon client ──────────────────────────────────────────────────
// Used exclusively for signInWithPassword (authenticates as the user).
// Falls back to service role key if SUPABASE_ANON_KEY is not set,
// but login WILL fail in that case — add the anon key to .env.
const supabaseAnon = createClient(supabaseUrl, anonKey || serviceRoleKey, {
  auth: {
    autoRefreshToken:   false,
    persistSession:     false,
    detectSessionInUrl: false
  }
});

module.exports = supabase;
module.exports.supabaseAnon = supabaseAnon;
