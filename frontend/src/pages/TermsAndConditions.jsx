import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h5 className="fw-bold mb-3" style={{ color: '#0A2540' }}>{title}</h5>
    <div style={{ color: '#444', lineHeight: '1.9', fontSize: '15px' }}>{children}</div>
  </div>
);

const TermsAndConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-vh-100 bg-light">

      {/* Header */}
      <div className="py-5 text-white text-center" style={{ background: '#0A2540' }}>
        <div className="container">
          <img
            src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
            alt="Outlook Edu Services"
            style={{ height: 56, objectFit: 'contain', marginBottom: 20 }}
          />
          <h1 className="fw-bold mb-2">Terms &amp; Conditions</h1>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Last updated: May 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">

              <p style={{ color: '#555', lineHeight: '1.9' }} className="mb-5">
                Welcome to Outlook Edu Services. By accessing or using our website, registering for
                courses, or engaging with our consultancy services, you agree to be bound by these
                Terms and Conditions. Please read them carefully before proceeding.
              </p>

              <Section title="1. Acceptance of Terms">
                <p>
                  By using the Outlook Edu Services website and its associated services, you confirm
                  that you are at least 18 years of age (or have parental consent), and that you
                  accept these Terms and Conditions in full. If you do not agree with any part of
                  these terms, you must not use our services.
                </p>
              </Section>

              <Section title="2. Services Provided">
                <p>Outlook Edu Services provides the following:</p>
                <ul>
                  <li>Educational consultancy for study abroad programs</li>
                  <li>Visa guidance and application support</li>
                  <li>Online and offline courses in various disciplines</li>
                  <li>Career counselling and university selection assistance</li>
                  <li>Language test preparation (IELTS, TOEFL, etc.)</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any service at any time
                  without prior notice.
                </p>
              </Section>

              <Section title="3. Course Enrollment and Payments">
                <p>
                  All course fees are displayed in Indian Rupees (INR) and are inclusive of applicable
                  taxes unless stated otherwise. Payments are processed securely through Razorpay.
                  By enrolling in a course, you agree to pay the full fee as displayed at the time
                  of registration.
                </p>
                <p>
                  Course access is granted only after successful payment verification. Outlook Edu
                  Services reserves the right to revoke access in cases of fraudulent payment or
                  violation of these terms.
                </p>
              </Section>

              <Section title="4. Refund Policy">
                <p>
                  Refund requests must be submitted within 7 days of payment. Refunds are considered
                  on a case-by-case basis and are subject to the following conditions:
                </p>
                <ul>
                  <li>Course content has not been accessed beyond the first module</li>
                  <li>The request is submitted via email to contact@outlookeduservices.com</li>
                  <li>Technical issues caused by our platform prevented access</li>
                </ul>
                <p>
                  Approved refunds will be processed within 7–10 business days to the original
                  payment method.
                </p>
              </Section>

              <Section title="5. User Responsibilities">
                <p>You agree to:</p>
                <ul>
                  <li>Provide accurate and truthful information during registration</li>
                  <li>Not share your account credentials with any third party</li>
                  <li>Not reproduce, distribute, or resell any course content</li>
                  <li>Use the platform solely for lawful educational purposes</li>
                  <li>Respect the intellectual property rights of Outlook Edu Services</li>
                </ul>
              </Section>

              <Section title="6. Intellectual Property">
                <p>
                  All content on this website — including text, images, videos, course materials,
                  logos, and graphics — is the exclusive property of Outlook Edu Services and is
                  protected under applicable copyright and intellectual property laws. Unauthorised
                  use, reproduction, or distribution is strictly prohibited.
                </p>
              </Section>

              <Section title="7. Limitation of Liability">
                <p>
                  Outlook Edu Services shall not be liable for any indirect, incidental, or
                  consequential damages arising from the use of our services, including but not
                  limited to visa rejections, university admission decisions, or outcomes of
                  language tests. Our consultancy services are advisory in nature and do not
                  guarantee specific results.
                </p>
              </Section>

              <Section title="8. Privacy">
                <p>
                  Your use of our services is also governed by our{' '}
                  <Link to="/privacy-policy" className="text-primary fw-semibold">Privacy Policy</Link>,
                  which is incorporated into these Terms by reference.
                </p>
              </Section>

              <Section title="9. Governing Law">
                <p>
                  These Terms and Conditions are governed by the laws of India. Any disputes arising
                  from the use of our services shall be subject to the exclusive jurisdiction of the
                  courts in Hyderabad, Telangana.
                </p>
              </Section>

              <Section title="10. Changes to Terms">
                <p>
                  We reserve the right to update these Terms at any time. Continued use of our
                  services after changes are posted constitutes your acceptance of the revised Terms.
                  We recommend reviewing this page periodically.
                </p>
              </Section>

              <Section title="11. Contact Us">
                <p>
                  For any questions regarding these Terms and Conditions, please contact us at:
                </p>
                <ul>
                  <li><strong>Email:</strong> contact@outlookeduservices.com</li>
                  <li><strong>Phone:</strong> +91 89770 11804</li>
                  <li><strong>Address:</strong> Unit A Floor, Ahmed Mansion, Santosh Nagar, Hyderabad, Telangana 500059</li>
                </ul>
              </Section>

              <div className="d-flex gap-3 flex-wrap mt-2">
                <Link to="/privacy-policy" className="btn btn-outline-primary btn-sm">Privacy Policy</Link>
                <Link to="/cookie-policy"  className="btn btn-outline-primary btn-sm">Cookie Policy</Link>
                <Link to="/"              className="btn btn-primary btn-sm">Back to Home</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
