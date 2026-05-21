-- Run this in Supabase SQL Editor
-- Adds session_id column to users table for single-device session enforcement

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);

-- Index for fast lookup during token validation
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users (session_id);
