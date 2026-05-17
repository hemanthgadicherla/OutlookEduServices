-- ================================================================
-- Supabase SQL Schema — Educational Consultancy
-- ================================================================
-- HOW TO USE:
--   Paste into Supabase SQL Editor and run.
--   DROP + CREATE gives a clean slate every time.
--   For production: comment out Section 1 and use migrations.
-- ================================================================


-- ================================================================
-- SECTION 1 — DROP  (respects FK order, safe to re-run)
-- ================================================================
DROP TABLE IF EXISTS audit_logs        CASCADE;
DROP TABLE IF EXISTS notifications     CASCADE;
DROP TABLE IF EXISTS lesson_progress   CASCADE;
DROP TABLE IF EXISTS course_lessons    CASCADE;
DROP TABLE IF EXISTS course_modules    CASCADE;
DROP TABLE IF EXISTS course_reviews    CASCADE;
DROP TABLE IF EXISTS coupon_uses       CASCADE;
DROP TABLE IF EXISTS coupons           CASCADE;
DROP TABLE IF EXISTS certificates      CASCADE;
DROP TABLE IF EXISTS user_courses      CASCADE;
DROP TABLE IF EXISTS payments          CASCADE;
DROP TABLE IF EXISTS registrations     CASCADE;
DROP TABLE IF EXISTS blog_subscribers  CASCADE;
DROP TABLE IF EXISTS leads             CASCADE;
DROP TABLE IF EXISTS blogs             CASCADE;
DROP TABLE IF EXISTS courses           CASCADE;
DROP TABLE IF EXISTS users             CASCADE;

DROP TYPE IF EXISTS user_role            CASCADE;
DROP TYPE IF EXISTS payment_status       CASCADE;
DROP TYPE IF EXISTS payment_order_status CASCADE;
DROP TYPE IF EXISTS lead_source          CASCADE;


-- ================================================================
-- SECTION 2 — ENUM TYPES
-- DB-level constraints — invalid values are rejected before they
-- ever reach application code.
-- To add a value later: ALTER TYPE <type> ADD VALUE 'new_val';
-- ================================================================

CREATE TYPE user_role AS ENUM (
  'user',       -- registered visitor, no paid course
  'student',    -- has at least one paid course (LMS access)
  'admin'       -- full admin panel access
);

CREATE TYPE payment_status AS ENUM (
  'pending',    -- registration created, payment not started
  'paid',       -- payment verified successfully
  'failed'      -- payment failed or expired
);

CREATE TYPE payment_order_status AS ENUM (
  'created',    -- Razorpay order created
  'completed',  -- payment verified
  'failed',     -- payment failed
  'refunded'    -- refund issued
);

CREATE TYPE lead_source AS ENUM (
  'popup',          -- lead popup on site
  'contact_page',   -- /contact form
  'course_page',    -- enquiry from a course page
  'study_abroad',   -- study abroad section
  'other'
);


-- ================================================================
-- SECTION 3 — SHARED TRIGGER FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ================================================================
-- SECTION 4 — CORE TABLES
-- ================================================================

-- ----------------------------------------------------------------
-- USERS
-- Single source of truth for every authenticated user.
-- id         = Supabase Auth UUID — set on first login/register.
-- avatar_url = populated from Google OAuth or manual upload.
-- is_active  = soft-disable without touching Supabase Auth.
-- last_login = updated on every successful login for audit trail.
-- ----------------------------------------------------------------
CREATE TABLE users (
  id              UUID         PRIMARY KEY,  -- matches auth.users.id
  email           VARCHAR(255) NOT NULL UNIQUE,
  full_name       VARCHAR(100) NOT NULL DEFAULT '',
  phone           VARCHAR(15)  UNIQUE,       -- optional, unique when set
  avatar_url      TEXT,                      -- profile picture URL
  role            user_role    NOT NULL DEFAULT 'user',
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Service role bypasses RLS; disable to prevent accidental policy blocks
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_is_active ON users (is_active);


-- ----------------------------------------------------------------
-- COURSES
-- slug        = SEO-friendly URL: /courses/ielts-preparation
-- category    = filter/group courses on the frontend
-- is_published = TRUE  → Active   (visible with enroll button)
--               FALSE → Upcoming (visible as "Coming Soon", no enroll)
-- enrolled_count = cached counter updated by trigger
-- ----------------------------------------------------------------
CREATE TABLE courses (
  id               SERIAL        PRIMARY KEY,
  title            VARCHAR(255)  NOT NULL,
  slug             VARCHAR(255)  UNIQUE,      -- e.g. ielts-preparation
  description      TEXT,                      -- short card summary
  full_description TEXT,                      -- long detail page content
  price            NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image            TEXT,
  category         VARCHAR(100),              -- e.g. 'Language', 'Tech', 'Finance'
  is_published     BOOLEAN       NOT NULL DEFAULT TRUE,
  enrolled_count   INTEGER       NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_courses_slug      ON courses (slug);
CREATE INDEX idx_courses_category  ON courses (category);
CREATE INDEX idx_courses_published ON courses (is_published);


-- ----------------------------------------------------------------
-- COURSE MODULES
-- Groups lessons inside a course (e.g. "Week 1 — Foundations").
-- position controls display order.
-- ----------------------------------------------------------------
CREATE TABLE course_modules (
  id         SERIAL       PRIMARY KEY,
  course_id  INTEGER      NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  position   SMALLINT     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER course_modules_updated_at
  BEFORE UPDATE ON course_modules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_course_modules_course_id ON course_modules (course_id);


-- ----------------------------------------------------------------
-- COURSE LESSONS
-- Individual video/text lessons inside a module.
-- is_free = true allows preview without payment (marketing tool).
-- video_url = Cloudinary / YouTube / Vimeo URL.
-- ----------------------------------------------------------------
CREATE TABLE course_lessons (
  id          SERIAL       PRIMARY KEY,
  module_id   INTEGER      NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  video_url   TEXT,
  content     TEXT,                     -- optional text/markdown notes
  position    SMALLINT     NOT NULL DEFAULT 0,
  is_free     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER course_lessons_updated_at
  BEFORE UPDATE ON course_lessons
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_course_lessons_module_id ON course_lessons (module_id);


-- ----------------------------------------------------------------
-- REGISTRATIONS
-- student_name   = snapshot of name at registration time
--   (denormalised on purpose — user may rename later).
-- user_id        = FK to users when the student is logged in.
-- course_id      = FK for relational integrity.
-- selected_course = text snapshot so renames don't break history.
-- ----------------------------------------------------------------
CREATE TABLE registrations (
  id              SERIAL         PRIMARY KEY,
  user_id         UUID           REFERENCES users(id) ON DELETE SET NULL,
  student_name    VARCHAR(100)   NOT NULL,
  email           VARCHAR(255)   NOT NULL,
  phone           VARCHAR(15)    NOT NULL,
  course_id       INTEGER        REFERENCES courses(id) ON DELETE SET NULL,
  selected_course VARCHAR(255)   NOT NULL,  -- display name snapshot
  country         VARCHAR(100),
  message         TEXT,
  payment_status  payment_status NOT NULL DEFAULT 'pending',
  payment_id      VARCHAR(255),             -- Razorpay payment ID on success
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_registrations_user_id        ON registrations (user_id);
CREATE INDEX idx_registrations_email          ON registrations (email);
CREATE INDEX idx_registrations_payment_status ON registrations (payment_status);
CREATE INDEX idx_registrations_course_id      ON registrations (course_id);


-- ----------------------------------------------------------------
-- PAYMENTS
-- One row per Razorpay order.
-- currency   = INR now; ready for international expansion.
-- refund_id  = Razorpay refund ID when a refund is issued.
-- ----------------------------------------------------------------
CREATE TABLE payments (
  id                   SERIAL               PRIMARY KEY,
  razorpay_order_id    VARCHAR(255)         NOT NULL UNIQUE,
  razorpay_payment_id  VARCHAR(255),
  razorpay_signature   VARCHAR(512),        -- stored for audit
  amount               NUMERIC(10,2)        NOT NULL CHECK (amount > 0),
  currency             VARCHAR(3)           NOT NULL DEFAULT 'INR',
  status               payment_order_status NOT NULL DEFAULT 'created',
  refund_id            VARCHAR(255),        -- Razorpay refund ID
  registration_id      INTEGER              REFERENCES registrations(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_payments_registration_id ON payments (registration_id);
CREATE INDEX idx_payments_status          ON payments (status);


-- ----------------------------------------------------------------
-- COUPONS
-- Discount codes for marketing campaigns.
-- discount_type: 'percent' (10%) or 'flat' (₹500 off).
-- max_uses NULL = unlimited.
-- ----------------------------------------------------------------
CREATE TABLE coupons (
  id              SERIAL        PRIMARY KEY,
  code            VARCHAR(50)   NOT NULL UNIQUE,
  discount_type   VARCHAR(10)   NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent','flat')),
  discount_value  NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  max_uses        INTEGER,                  -- NULL = unlimited
  uses_count      INTEGER       NOT NULL DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code      ON coupons (code);
CREATE INDEX idx_coupons_is_active ON coupons (is_active);


-- ----------------------------------------------------------------
-- COUPON USES
-- Tracks which user used which coupon on which registration.
-- Prevents double-use per user per coupon.
-- ----------------------------------------------------------------
CREATE TABLE coupon_uses (
  id              SERIAL      PRIMARY KEY,
  coupon_id       INTEGER     NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id         UUID        REFERENCES users(id) ON DELETE SET NULL,
  registration_id INTEGER     REFERENCES registrations(id) ON DELETE SET NULL,
  used_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coupon_id, user_id)   -- one use per user per coupon
);

CREATE INDEX idx_coupon_uses_coupon_id ON coupon_uses (coupon_id);
CREATE INDEX idx_coupon_uses_user_id   ON coupon_uses (user_id);


-- ----------------------------------------------------------------
-- USER COURSES  (LMS access junction table)
-- Row created when payment_status is set to 'paid'.
-- UNIQUE(user_id, course_id) prevents duplicate access rows.
-- ----------------------------------------------------------------
CREATE TABLE user_courses (
  id             SERIAL         PRIMARY KEY,
  user_id        UUID           NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id      INTEGER        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_status payment_status NOT NULL DEFAULT 'paid',
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_user_courses_user_id   ON user_courses (user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses (course_id);


-- ----------------------------------------------------------------
-- LESSON PROGRESS
-- Tracks per-student per-lesson completion for LMS progress bars.
-- watched_seconds = resume-where-you-left-off support.
-- ----------------------------------------------------------------
CREATE TABLE lesson_progress (
  id               SERIAL      PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES users(id)          ON DELETE CASCADE,
  lesson_id        INTEGER     NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed        BOOLEAN     NOT NULL DEFAULT FALSE,
  watched_seconds  INTEGER     NOT NULL DEFAULT 0,
  completed_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE TRIGGER lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_lesson_progress_user_id   ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress (lesson_id);


-- ----------------------------------------------------------------
-- CERTIFICATES
-- Issued when a student completes all lessons in a course.
-- certificate_url = Cloudinary PDF or image URL.
-- ----------------------------------------------------------------
CREATE TABLE certificates (
  id               SERIAL      PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id        INTEGER     NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url  TEXT,
  issued_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE INDEX idx_certificates_user_id   ON certificates (user_id);
CREATE INDEX idx_certificates_course_id ON certificates (course_id);


-- ----------------------------------------------------------------
-- COURSE REVIEWS
-- One review per student per course.
-- rating 1–5 enforced by CHECK constraint.
-- ----------------------------------------------------------------
CREATE TABLE course_reviews (
  id         SERIAL      PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id  INTEGER     NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE TRIGGER course_reviews_updated_at
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_course_reviews_course_id ON course_reviews (course_id);


-- ----------------------------------------------------------------
-- BLOGS
-- All columns match the backend Joi validation schema exactly.
-- is_published = draft mode.
-- views        = cached read counter (increment on GET).
-- ----------------------------------------------------------------
CREATE TABLE blogs (
  id           SERIAL       PRIMARY KEY,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  excerpt      VARCHAR(500) NOT NULL,
  content      TEXT         NOT NULL,
  image        TEXT,
  author       VARCHAR(100) NOT NULL,
  read_time    VARCHAR(50)  NOT NULL,
  date         VARCHAR(50),
  category     VARCHAR(100),
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  views        INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_blogs_slug        ON blogs (slug);
CREATE INDEX idx_blogs_category    ON blogs (category);
CREATE INDEX idx_blogs_published   ON blogs (is_published);


-- ----------------------------------------------------------------
-- LEADS
-- source      = where the lead came from (ENUM).
-- assigned_to = admin user (UUID) handling this lead.
-- ----------------------------------------------------------------
CREATE TABLE leads (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255),
  phone       VARCHAR(15)  NOT NULL,
  subject     VARCHAR(100) NOT NULL,
  message     TEXT,
  source      lead_source  NOT NULL DEFAULT 'other',
  contacted   BOOLEAN      NOT NULL DEFAULT FALSE,
  assigned_to UUID         REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_contacted   ON leads (contacted);
CREATE INDEX idx_leads_source      ON leads (source);
CREATE INDEX idx_leads_assigned_to ON leads (assigned_to);


-- ----------------------------------------------------------------
-- BLOG SUBSCRIBERS
-- ----------------------------------------------------------------
CREATE TABLE blog_subscribers (
  id         SERIAL       PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


-- ----------------------------------------------------------------
-- NOTIFICATIONS
-- In-app alerts per user (payment confirmed, new course, etc.).
-- ----------------------------------------------------------------
CREATE TABLE notifications (
  id         SERIAL       PRIMARY KEY,
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (user_id, is_read);


-- ----------------------------------------------------------------
-- AUDIT LOGS
-- Immutable record of every admin action.
-- old_data / new_data = JSONB snapshots before and after change.
-- Never delete rows from this table.
-- ----------------------------------------------------------------
CREATE TABLE audit_logs (
  id          SERIAL       PRIMARY KEY,
  admin_id    UUID         REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(50)  NOT NULL,   -- e.g. 'UPDATE', 'DELETE', 'LOGIN'
  table_name  VARCHAR(100),
  record_id   TEXT,                    -- TEXT to handle both INT and UUID PKs
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin_id   ON audit_logs (admin_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs (table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);


-- ================================================================
-- SECTION 5 — TRIGGER: auto-increment enrolled_count on courses
-- Fires when a user_courses row is inserted (payment confirmed).
-- ================================================================
CREATE OR REPLACE FUNCTION increment_enrolled_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE courses SET enrolled_count = enrolled_count + 1
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER user_courses_enrolled_count
  AFTER INSERT ON user_courses
  FOR EACH ROW EXECUTE FUNCTION increment_enrolled_count();


-- ================================================================
-- SECTION 6 — SAMPLE DATA
-- ================================================================

INSERT INTO courses (title, slug, description, full_description, price, image, category) VALUES
(
  'Digital Marketing Mastery',
  'digital-marketing-mastery',
  'Complete course covering SEO, social media, paid ads, and analytics.',
  'This course takes you from zero to advanced in digital marketing. You will master SEO, Google Ads, Meta Ads, email marketing, and analytics dashboards.',
  25000,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3',
  'Marketing'
),
(
  'SAP FICO Certification',
  'sap-fico-certification',
  'Learn SAP Financial Accounting and Controlling with real project experience.',
  'Hands-on SAP FICO training covering GL, AP, AR, Asset Accounting, Cost Center Accounting, and Profit Center Accounting with live project scenarios.',
  35000,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3',
  'Finance'
),
(
  'IELTS Preparation',
  'ielts-preparation',
  'Comprehensive IELTS coaching with mock tests and expert feedback.',
  'Structured IELTS preparation covering all four modules — Listening, Reading, Writing, and Speaking — with weekly mock tests and personalised feedback.',
  15000,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3',
  'Language'
),
(
  'Data Science Fundamentals',
  'data-science-fundamentals',
  'Learn Python, statistics, and machine learning for data science careers.',
  'A project-based data science course covering Python, Pandas, NumPy, Matplotlib, Scikit-learn, and real-world datasets from Kaggle.',
  45000,
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3',
  'Technology'
),
(
  'Business English',
  'business-english',
  'Professional English communication skills for corporate careers.',
  'Develop business writing, presentation, negotiation, and email communication skills tailored for corporate and international work environments.',
  20000,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3',
  'Language'
),
(
  'Web Development Bootcamp',
  'web-development-bootcamp',
  'Full-stack web development with React, Node.js, and modern tools.',
  'Build production-ready web applications from scratch using HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL with deployment on Vercel and Railway.',
  40000,
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3',
  'Technology'
);

INSERT INTO blogs (title, slug, excerpt, content, image, author, read_time, category) VALUES
(
  'Study Abroad: A Complete Guide for 2024',
  'study-abroad-complete-guide-2024',
  'Everything you need to know about choosing the right destination, application process, and visa requirements.',
  'Planning to study abroad? This comprehensive guide covers everything you need to know about choosing the right destination, application process, visa requirements, and more.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
  'EduConsult Team', '5 min read', 'Study Abroad'
),
(
  'Top Universities for Computer Science',
  'top-universities-computer-science',
  'Discover the best universities worldwide offering computer science programs and their admission requirements.',
  'Discover the best universities worldwide offering computer science programs, their rankings, admission requirements, and career prospects.',
  'https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-4.0.3',
  'EduConsult Team', '4 min read', 'Universities'
),
(
  'Visa Application Tips and Tricks',
  'visa-application-tips-and-tricks',
  'Learn the essential tips for successful visa applications and how to increase your chances of approval.',
  'Learn the essential tips for successful visa applications, common mistakes to avoid, and how to increase your chances of approval.',
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3',
  'EduConsult Team', '3 min read', 'Visa'
);
