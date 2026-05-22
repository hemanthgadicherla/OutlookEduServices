-- ================================================================
-- CURRICULUM MIGRATION
-- Run this in Supabase SQL Editor if you already have the
-- course_lessons table without video_source and duration columns.
-- ================================================================

ALTER TABLE course_lessons
  ADD COLUMN IF NOT EXISTS video_source VARCHAR(20),  -- 'youtube' | 'bunny' | 'url'
  ADD COLUMN IF NOT EXISTS duration     VARCHAR(20);  -- e.g. '12:30'

-- Index for filtering free lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_is_free ON course_lessons (is_free);
