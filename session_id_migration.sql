-- ================================================================
-- SESSION ID MIGRATION
-- Run this in Supabase SQL Editor
-- ================================================================

-- Add session_id to users table (regular users)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_users_session_id ON users (session_id);

-- Add session_id to admins table (admin users)
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_admins_session_id ON admins (session_id);
