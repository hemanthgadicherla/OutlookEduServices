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
import BlogDetail from "./pages/BlogDetail";
import CourseDetail from "./pages/CourseDetail";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from "./pages/AdminCourses";
import AdminBlogs from "./pages/AdminBlogs";
import AdminLeads from "./pages/AdminLeads";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminSubscribers from "./pages/AdminSubscribers";

function App() {

  const location = useLocation();
  const isAdminRoute =
  location.pathname.startsWith("/admin");

  const hideLeadPopupPages = [

  "/contact",

  "/login",

  "/registration",

];

  const hideFooterPages = [

  "/login",

  "/registration",

];

  const shouldHideLeadPopup =

  isAdminRoute ||

  hideLeadPopupPages.includes(
    location.pathname
  );

  const shouldHideFooter =

  isAdminRoute ||

  hideFooterPages.includes(
    location.pathname
  );

  return (
    <>
      <ScrollToTop />

      <div className="App">

        {!shouldHideLeadPopup && <LeadPopup />}

        {!isAdminRoute && <Navbar />}

        <Routes>

          {/* Public Routes */}

          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/courses" element={<Courses />} />
          
          <Route path="/course/:id" element={<CourseDetail />} />

          <Route path="/study-abroad" element={<StudyAbroad />} />

          <Route
            path="/study-abroad/:countryName"
            element={<CountryDetail />}
          />

          <Route path="/visit-visa" element={<VisitVisa />} />

          <Route path="/blogs" element={<Blogs />} />

          <Route path="/blog/:id" element={<BlogDetail />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />

          <Route path="/registration" element={<Registration />} />

          

          {/* Admin Routes */}

          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <AdminProtectedRoute>
                <AdminCourses />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/blogs"
            element={
              <AdminProtectedRoute>
                <AdminBlogs />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/leads"
            element={
              <AdminProtectedRoute>
                <AdminLeads />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/registrations"
            element={
              <AdminProtectedRoute>
                <AdminRegistrations />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/subscribers"
            element={
              <AdminProtectedRoute>
                <AdminSubscribers />
              </AdminProtectedRoute>
            }
          />

        </Routes>

        {!shouldHideFooter && <Footer />}

        <ToastContainer />



      {/* WhatsApp Floating Button */}

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