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
import CookieConsent from "./components/CookieConsent";

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import StudyAbroad from './pages/StudyAbroad';
import CountryDetail from './pages/CountryDetail';
import VisitVisa from './pages/VisitVisa';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import BlogDetail from "./pages/BlogDetail";
import CourseDetail from "./pages/CourseDetail";

// Auth pages
import Login from "./pages/Login";
import Registration from './pages/Registration';
import AuthCallback from "./pages/AuthCallback";

// User pages
import CourseRegistration from './pages/CourseRegistration';
import Account from "./pages/Account";

// LMS pages
import LMSDashboard from "./pages/LMSDashboard";
import LMSCourses from "./pages/LMSCourses";
import LMSCourseViewer from "./pages/LMSCourseViewer";
import LMSCertificates from "./pages/LMSCertificates";
import LMSNotifications from "./pages/LMSNotifications";
import LMSExams from "./pages/LMSExams";
import LMSSettings from "./pages/LMSSettings";

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from "./pages/AdminCourses";
import AdminBlogs from "./pages/AdminBlogs";
import AdminLeads from "./pages/AdminLeads";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";

// Legal pages
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";

function App() {
  const location     = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLmsRoute   = location.pathname.startsWith("/lms");

  // Routes where Navbar / Footer / LeadPopup should be hidden
  const noLeadPopup = ["/contact", "/login", "/registration", "/course_registration"];
  const noFooter    = ["/login", "/registration"];

  const shouldHideLeadPopup = isAdminRoute || isLmsRoute || noLeadPopup.includes(location.pathname);
  const shouldHideNavbar    = isAdminRoute || isLmsRoute;
  const shouldHideFooter    = isAdminRoute || isLmsRoute || noFooter.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="App">

        <AuthHandler />

        {!shouldHideLeadPopup && <LeadPopup />}
        {!shouldHideNavbar    && <Navbar />}

        {/* public-layout adds padding-top to clear the fixed Navbar.
            Admin, LMS, auth pages manage their own spacing. */}
        <div className={!shouldHideNavbar ? 'public-layout' : ''}>
          <Routes>

            {/* ── Public ── */}
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

            {/* ── Auth ── */}
            <Route path="/login"                     element={<Login />} />
            <Route path="/registration"              element={<Registration />} />
            <Route path="/auth/callback"             element={<AuthCallback />} />

            {/* ── User ── */}
            <Route path="/course_registration"       element={<CourseRegistration />} />
            <Route path="/account"                   element={<Account />} />

            {/* ── LMS (own sidebar, no global Navbar/Footer) ── */}
            <Route path="/lms"                       element={<LMSDashboard />} />
            <Route path="/lms/courses"               element={<LMSCourses />} />
            <Route path="/lms/course/:id"            element={<LMSCourseViewer />} />
            <Route path="/lms/certificates"          element={<LMSCertificates />} />
            <Route path="/lms/notifications"         element={<LMSNotifications />} />
            <Route path="/lms/exams"                 element={<LMSExams />} />
            <Route path="/lms/settings"              element={<LMSSettings />} />

            {/* ── Legal ── */}
            <Route path="/terms-and-conditions"      element={<TermsAndConditions />} />
            <Route path="/privacy-policy"            element={<PrivacyPolicy />} />
            <Route path="/cookie-policy"             element={<CookiePolicy />} />

            {/* ── Admin public ── */}
            <Route path="/admin/login"               element={<AdminLogin />} />
            <Route path="/admin/signup"              element={<AdminSignup />} />
            <Route path="/admin/dashboard"           element={<AdminDashboard />} />

            {/* ── Admin protected ── */}
            <Route path="/admin/courses"       element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
            <Route path="/admin/blogs"         element={<AdminProtectedRoute><AdminBlogs /></AdminProtectedRoute>} />
            <Route path="/admin/leads"         element={<AdminProtectedRoute><AdminLeads /></AdminProtectedRoute>} />
            <Route path="/admin/registrations" element={<AdminProtectedRoute><AdminRegistrations /></AdminProtectedRoute>} />

          </Routes>
        </div>

        {!shouldHideFooter && <Footer />}

        <CookieConsent />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
          toastStyle={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
        />

        {!shouldHideNavbar && (
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
