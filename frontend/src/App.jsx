import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWhatsapp } from 'react-icons/fa';

// Core components — always loaded (small, needed on every page)
import Navbar              from './components/Navbar';
import Footer              from './components/Footer';
import ScrollToTop         from './components/ScrollToTop';
import LeadPopup           from './components/LeadPopup';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AuthHandler         from './components/AuthHandler';
import CookieConsent       from './components/CookieConsent';
import SessionGuard        from './components/SessionGuard';

// Home is eager — landing page must be instant
import Home from './pages/Home';

// ── Lazy-loaded pages ────────────────────────────────────────────
const About              = lazy(() => import('./pages/About'));
const Courses            = lazy(() => import('./pages/Courses'));
const CourseDetail       = lazy(() => import('./pages/CourseDetail'));
const StudyAbroad        = lazy(() => import('./pages/StudyAbroad'));
const CountryDetail      = lazy(() => import('./pages/CountryDetail'));
const VisitVisa          = lazy(() => import('./pages/VisitVisa'));
const Blogs              = lazy(() => import('./pages/Blogs'));
const BlogDetail         = lazy(() => import('./pages/BlogDetail'));
const Contact            = lazy(() => import('./pages/Contact'));

const Login              = lazy(() => import('./pages/Login'));
const Registration       = lazy(() => import('./pages/Registration'));
const AuthCallback       = lazy(() => import('./pages/AuthCallback'));

const CourseRegistration = lazy(() => import('./pages/CourseRegistration'));
const Account            = lazy(() => import('./pages/Account'));

const LMSDashboard       = lazy(() => import('./pages/LMSDashboard'));
const LMSCourses         = lazy(() => import('./pages/LMSCourses'));
const LMSCourseViewer    = lazy(() => import('./pages/LMSCourseViewer'));
const LMSCertificates    = lazy(() => import('./pages/LMSCertificates'));
const LMSNotifications   = lazy(() => import('./pages/LMSNotifications'));
const LMSExams           = lazy(() => import('./pages/LMSExams'));
const LMSSettings        = lazy(() => import('./pages/LMSSettings'));
const LMSProfile         = lazy(() => import('./pages/LMSProfile'));

const AdminDashboard     = lazy(() => import('./pages/AdminDashboard'));
const AdminCourses       = lazy(() => import('./pages/AdminCourses'));
const AdminCourseEditor  = lazy(() => import('./pages/AdminCourseEditor'));
const AdminBlogs         = lazy(() => import('./pages/AdminBlogs'));
const AdminLeads         = lazy(() => import('./pages/AdminLeads'));
const AdminRegistrations = lazy(() => import('./pages/AdminRegistrations'));
const AdminLogin         = lazy(() => import('./pages/AdminLogin'));
const AdminSignup        = lazy(() => import('./pages/AdminSignup'));

const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy      = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy       = lazy(() => import('./pages/CookiePolicy'));

// ── Loading spinner shown while a chunk loads ────────────────────
const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading…</span>
    </div>
  </div>
);

// ── App ──────────────────────────────────────────────────────────
function App() {
  const location     = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLmsRoute   = location.pathname.startsWith('/lms');

  const noLeadPopup = ['/contact', '/login', '/registration', '/course_registration'];
  const noFooter    = ['/login', '/registration'];

  const shouldHideLeadPopup = isAdminRoute || isLmsRoute || noLeadPopup.includes(location.pathname);
  const shouldHideNavbar    = isAdminRoute || isLmsRoute;
  const shouldHideFooter    = isAdminRoute || isLmsRoute || noFooter.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="App">

        <AuthHandler />
        <SessionGuard />

        {!shouldHideLeadPopup && <LeadPopup />}
        {!shouldHideNavbar    && <Navbar />}

        <div className={!shouldHideNavbar ? 'public-layout' : ''}>
          <Suspense fallback={<PageLoader />}>
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

              {/* ── LMS ── */}
              <Route path="/lms"                       element={<LMSDashboard />} />
              <Route path="/lms/courses"               element={<LMSCourses />} />
              <Route path="/lms/course/:id"            element={<LMSCourseViewer />} />
              <Route path="/lms/certificates"          element={<LMSCertificates />} />
              <Route path="/lms/notifications"         element={<LMSNotifications />} />
              <Route path="/lms/exams"                 element={<LMSExams />} />
              <Route path="/lms/settings"              element={<LMSSettings />} />
              <Route path="/lms/profile"               element={<LMSProfile />} />

              {/* ── Legal ── */}
              <Route path="/terms-and-conditions"      element={<TermsAndConditions />} />
              <Route path="/privacy-policy"            element={<PrivacyPolicy />} />
              <Route path="/cookie-policy"             element={<CookiePolicy />} />

              {/* ── Admin public ── */}
              <Route path="/admin/login"               element={<AdminLogin />} />
              <Route path="/admin/signup"              element={<AdminSignup />} />

              {/* ── Admin protected ── */}
              <Route path="/admin/dashboard"     element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/courses"       element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
              <Route path="/admin/courses/:id"   element={<AdminProtectedRoute><AdminCourseEditor /></AdminProtectedRoute>} />
              <Route path="/admin/blogs"         element={<AdminProtectedRoute><AdminBlogs /></AdminProtectedRoute>} />
              <Route path="/admin/leads"         element={<AdminProtectedRoute><AdminLeads /></AdminProtectedRoute>} />
              <Route path="/admin/registrations" element={<AdminProtectedRoute><AdminRegistrations /></AdminProtectedRoute>} />

            </Routes>
          </Suspense>
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
            href="https://wa.me/918977011804"
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
