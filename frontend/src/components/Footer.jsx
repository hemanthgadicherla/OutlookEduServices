import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

// Social icons with their brand colors on hover
const socialLinks = [
  {
    href:  'https://www.facebook.com/OutlookEducationalServices/',
    icon:  FaFacebook,
    label: 'Facebook',
    color: '#1877F2'
  },
  {
    href:  'https://www.instagram.com/outlook_edu_services/',
    icon:  FaInstagram,
    label: 'Instagram',
    color: '#E1306C'
  },
  {
    href:  'https://www.linkedin.com/company/outlook-edu-services/',
    icon:  FaLinkedin,
    label: 'LinkedIn',
    color: '#0A66C2'
  },
  {
    href:  'https://wa.me/8977461804',
    icon:  FaWhatsapp,
    label: 'WhatsApp',
    color: '#25D366'
  }
];

const SocialIcon = ({ href, icon: Icon, label, color }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="me-3"
      style={{
        color:      hovered ? color : '#fff',
        transition: 'color 0.2s ease',
        display:    'inline-flex'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={22} />
    </a>
  );
};

const FooterLink = ({ to, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li className="mb-1">
      <Link
        to={to}
        style={{
          color:          hovered ? '#facc15' : 'rgba(255,255,255,0.8)',
          textDecoration: 'none',
          transition:     'color 0.2s ease',
          fontSize:       '14px'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    </li>
  );
};

const Footer = () => {
  return (
    <footer className="text-light py-5" style={{ background: '#0d0d0d' }}>
      <div className="container">
        <div className="row g-4">

          {/* Brand + social */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3" style={{ color: '#facc15' }}>Outlook Edu Services</h5>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.8' }}>
              Premium study abroad guidance for ambitious students planning their next chapter.
              We provide comprehensive educational consultancy services worldwide.
            </p>
            <div className="mt-3">
              {socialLinks.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-3" style={{ color: '#facc15' }}>Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/courses">Courses</FooterLink>
              <FooterLink to="/study-abroad">Study Abroad</FooterLink>
              <FooterLink to="/visit-visa">Visit Visa</FooterLink>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-bold mb-3" style={{ color: '#facc15' }}>Services</h6>
            <ul className="list-unstyled mb-0">
              <FooterLink to="/blogs">Blogs</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/registration">Registration</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/support">Support</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: '#facc15' }}>Contact Info</h6>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.8' }}>
              <strong className="text-white">Head Office:</strong> Unit A Floor, Ahmed Mansion, 2,
              Santosh Nagar Main Rd, opposite Pillar Number 60, Central Excise Colony,
              New Santoshnagar, Santosh Nagar, Hyderabad, Telangana 500059
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <strong className="text-white">Phone:</strong> +91 89770 11804
            </p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              <strong className="text-white">Email:</strong> contact@outlookeduservices.com
            </p>
          </div>

        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright — centered */}
        <p className="text-center mb-0" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
          &copy; 2026 Outlook Edu Services. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
