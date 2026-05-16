// ================================================================
// createAdmin.js — one-time script to bootstrap the first admin
// Usage: node createAdmin.js
// ================================================================
require('dotenv').config();
const supabase = require('./config/supabase');

async function createAdmin() {
  const email     = 'admin@outlookedu.com'; // change as needed
  const password  = 'Admin@123456';         // change to a strong password
  const full_name = 'Super Admin';

  console.log(`Creating admin: ${email}`);

  // 1. Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: 'admin' }
  });

  if (authError) {
    // If already exists, try to find and upgrade
    if (authError.message?.toLowerCase().includes('already')) {
      console.log('Auth user already exists — attempting to upgrade role...');
    } else {
      console.error('Auth error:', authError.message);
      process.exit(1);
    }
  }

  const userId = authData?.user?.id;

  if (userId) {
    // 2. Upsert users table row with role = admin
    const { error: upsertError } = await supabase
      .from('users')
      .upsert([{ id: userId, email, full_name, role: 'admin' }], { onConflict: 'id' });

    if (upsertError) {
      console.error('Users table error:', upsertError.message);
      process.exit(1);
    }

    console.log('✓ Admin created successfully');
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log('  Change the password after first login!');
  }
}

createAdmin().catch(console.error);
