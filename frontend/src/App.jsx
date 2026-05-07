import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from "./components/ScrollToTop";
import LeadPopup from './components/LeadPopup';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import StudyAbroad from './pages/StudyAbroad';
import VisitVisa from './pages/VisitVisa';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import Login from "./pages/Login";
import Registration from './pages/Registration';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router> 
      <ScrollToTop />
      <div className="App">
        <LeadPopup />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/visit-visa" element={<VisitVisa />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;