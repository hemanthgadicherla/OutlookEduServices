-- Supabase SQL Schema for Educational Consultancy Website

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  role VARCHAR(20) DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registrations table
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  selected_course VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  message TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  razorpay_payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'created',
  registration_id INTEGER REFERENCES registrations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample courses
INSERT INTO courses (title, description, duration, price, image) VALUES
('Digital Marketing Mastery', 'Complete course covering SEO, social media, paid ads, and analytics.', '3 months', 25000, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3'),
('SAP FICO Certification', 'Learn SAP Financial Accounting and Controlling with real project experience.', '4 months', 35000, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3'),
('IELTS Preparation', 'Comprehensive IELTS coaching with mock tests and expert feedback.', '2 months', 15000, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3'),
('Data Science Fundamentals', 'Learn Python, statistics, and machine learning for data science careers.', '6 months', 45000, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3'),
('Business English', 'Professional English communication skills for corporate careers.', '3 months', 20000, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3'),
('Web Development Bootcamp', 'Full-stack web development with React, Node.js, and modern tools.', '5 months', 40000, 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3');

-- Insert sample blogs
INSERT INTO blogs (title, content, image) VALUES
('Study Abroad: A Complete Guide for 2024', 'Planning to study abroad? This comprehensive guide covers everything you need to know about choosing the right destination, application process, visa requirements, and more.', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3'),
('Top Universities for Computer Science', 'Discover the best universities worldwide offering computer science programs, their rankings, admission requirements, and career prospects.', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?ixlib=rb-4.0.3'),
('Visa Application Tips and Tricks', 'Learn the essential tips for successful visa applications, common mistakes to avoid, and how to increase your chances of approval.', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3');