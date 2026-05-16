import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { FaWhatsapp } from 'react-icons/fa';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from "./components/ScrollToTop";
import LeadPopup from './components/LeadPopup';
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AuthHandler from "./components/AuthHandler";

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import StudyAbroad from './pages/StudyAbroad';
import CountryDetail from './pages/CountryDetail';
import VisitVisa from './pages/VisitVisa';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Login from "./pages/Login";
import Registration from './pages/Registration';
import CourseRegistration from './pages/CourseRegistration';
import BlogDetail from "./pages/BlogDetail";
import CourseDetail from "./pages/CourseDetail";
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from "./pages/AdminCourses";
import AdminBlogs from "./pages/AdminBlogs";
import AdminLeads from "./pages/AdminLeads";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import LMSDashboard from "./pages/LMSDashboard";
import AuthCallback from "./pages/AuthCallback";
import Account from "./pages/Account";

function App() {
  const location    = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const noLeadPopup = ["/contact", "/login", "/registration", "/course_registration"];
  const noFooter    = ["/login", "/registration"];

  // hide navbar/footer/popup on all admin routes
  const shouldHideLeadPopup = isAdminRoute || noLeadPopup.includes(location.pathname);
  const shouldHideFooter    = isAdminRoute || noFooter.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="App">

        <AuthHandler />

        {!shouldHideLeadPopup && <LeadPopup />}
        {!isAdminRoute && <Navbar />}

        <Routes>

          {/* Public */}
          <Route path="/"                          element={<Home />} />
          <Route path="/about"                     element={<About />} />
          <Route path="/courses"                   element={<Courses />} />
          <Route path="/course/:id"                element={<CourseDetail />} />
          <Route path="/study-abroad"              element={<StudyAbroad />} />
          <Route path="/study-abroad/:countryName" element={<CountryDetail />} />
          <Route path="/visit-visa"                element={<VisitVisa />} />
          <Route path="/blogs"                     element={<Blogs />} />
          <Route path="/blog/:slug"                element={<BlogDetail />} />
          <Route path="/contact"                   element={<Contact />} />

          {/* Auth */}
          <Route path="/login"                     element={<Login />} />
          <Route path="/registration"              element={<Registration />} />
          <Route path="/auth/callback"             element={<AuthCallback />} />

          {/* Course enrollment (requires login) */}
          <Route path="/course_registration"       element={<CourseRegistration />} />

          {/* User */}
          <Route path="/lms"                       element={<LMSDashboard />} />
          <Route path="/account"                   element={<Account />} />

          {/* Admin — public pages (no protection) */}
          <Route path="/admin/login"     element={<AdminLogin />} />
          <Route path="/admin/signup"    element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Admin — protected pages */}
          <Route path="/admin/courses"       element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
          <Route path="/admin/blogs"         element={<AdminProtectedRoute><AdminBlogs /></AdminProtectedRoute>} />
          <Route path="/admin/leads"         element={<AdminProtectedRoute><AdminLeads /></AdminProtectedRoute>} />
          <Route path="/admin/registrations" element={<AdminProtectedRoute><AdminRegistrations /></AdminProtectedRoute>} />
          <Route path="/admin/subscribers"   element={<AdminProtectedRoute><AdminSubscribers /></AdminProtectedRoute>} />

        </Routes>

        {!shouldHideFooter && <Footer />}

        <ToastContainer />

        {!isAdminRoute && (
          <a
            href="https://wa.me/8977011804"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp size={24} />
          </a>
        )}

      </div>
    </>
  );
}

export default App;
