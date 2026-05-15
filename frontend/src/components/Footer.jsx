import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h5 className="mb-3" style={{ color: '#facc15' }}>Outlook Edu Services</h5>
            <p>
              Premium study abroad guidance for ambitious students planning their next chapter.
              We provide comprehensive educational consultancy services worldwide.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/OutlookEducationalServices/" className="text-light me-3"><FaFacebook size={20} /></a>
              <a href="https://www.instagram.com/outlook_edu_services/" className="text-light me-3"><FaInstagram size={20} /></a>
              <a href="https://www.linkedin.com/company/outlook-edu-services/" className="text-light me-3"><FaLinkedin size={20} /></a>
              <a href="https://wa.me/8977461804" className="text-light"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3" style={{ color: '#facc15' }}>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About</Link></li>
              <li><Link to="/courses" className="text-light text-decoration-none">Courses</Link></li>
              <li><Link to="/study-abroad" className="text-light text-decoration-none">Study Abroad</Link></li>
              <li><Link to="/visit-visa" className="text-light text-decoration-none">Visit Visa</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="mb-3" style={{ color: '#facc15' }}>Services</h6>
            <ul className="list-unstyled">
              <li><Link to="/blogs" className="foot-link text-light text-decoration-none">Blogs</Link></li>
              <li><Link to="/contact" className="foot-link text-light text-decoration-none">Contact</Link></li>
              <li><Link to="/registration" className="foot-link text-light text-decoration-none">Registration</Link></li>
              <li><Link to="/faq" className="foot-link text-light text-decoration-none">FAQ</Link></li>
              <li><Link to="/support" className="foot-link text-light text-decoration-none">Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 mb-4">
            <h6 className="mb-3" style={{ color: '#facc15' }}>Contact Info</h6>
            <p><strong>Head Office:</strong> Unit A Floor, Ahmed Mansion, 2, Santosh Nagar Main Rd, 
                                        opposite Pillar Number 60, Central Excise Colony, 
                                        New Santoshnagar, Santosh Nagar, Hyderabad, Telangana 500059</p>
            <p><strong>Phone:</strong> +91 89770 11804</p>
            <p><strong>Email:</strong> contact@outlookeduservices.com</p>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2026 Outlook Edu Services. All rights reserved.</p>
          </div>
          {/* <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-light text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-light text-decoration-none">Terms of Service</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;