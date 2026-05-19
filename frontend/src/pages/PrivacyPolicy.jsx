import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h5 className="fw-bold mb-3" style={{ color: '#0A2540' }}>{title}</h5>
    <div style={{ color: '#444', lineHeight: '1.9', fontSize: '15px' }}>{children}</div>
  </div>
);

const PrivacyPolicy = () => {
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
          <h1 className="fw-bold mb-2">Privacy Policy</h1>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Last updated: May 2026
          </p>
        </div>
      </div>

      {/* Content */}
      {/* <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 p-md-5">

              <p style={{ color: '#555', lineHeight: '1.9' }} className="mb-5">
                At Outlook Edu Services, we are committed to protecting your personal information
                and your right to privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website or use our
                services.
              </p>

              <Section title="1. Information We Collect">
                <p>We collect the following types of information:</p>
                <ul>
                  <li><strong>Personal Identification:</strong> Full name, email address, phone number</li>
                  <li><strong>Account Information:</strong> Username, password (encrypted), profile details</li>
                  <li><strong>Payment Information:</strong> Transaction IDs processed via Razorpay (we do not store card details)</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, IP address</li>
                  <li><strong>Communication Data:</strong> Messages sent through contact forms or support</li>
                </ul>
              </Section>

              <Section title="2. How We Use Your Information">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Create and manage your account</li>
                  <li>Process course enrollments and payments</li>
                  <li>Provide educational consultancy services</li>
                  <li>Send important updates about your courses or applications</li>
                  <li>Respond to your queries and provide customer support</li>
                  <li>Improve our website and services through analytics</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </Section>

              <Section title="3. Sharing of Information">
                <p>
                  We do not sell, trade, or rent your personal information to third parties.
                  We may share your information with:
                </p>
                <ul>
                  <li><strong>Payment Processors:</strong> Razorpay, for secure payment processing</li>
                  <li><strong>Cloud Services:</strong> Supabase and Cloudinary for data storage and media hosting</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                </ul>
              </Section>

              <Section title="4. Data Security">
                <p>
                  We implement industry-standard security measures to protect your personal data,
                  including SSL encryption, secure database storage, and access controls. However,
                  no method of transmission over the internet is 100% secure, and we cannot
                  guarantee absolute security.
                </p>
              </Section>

              <Section title="5. Cookies">
                <p>
                  We use cookies to enhance your browsing experience. For detailed information
                  about the cookies we use, please refer to our{' '}
                  <Link to="/cookie-policy" className="text-primary fw-semibold">Cookie Policy</Link>.
                </p>
              </Section>

              <Section title="6. Your Rights">
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Withdraw consent for marketing communications at any time</li>
                  <li>Lodge a complaint with a data protection authority</li>
                </ul>
                <p>
                  To exercise any of these rights, contact us at contact@outlookeduservices.com.
                </p>
              </Section>

              <Section title="7. Data Retention">
                <p>
                  We retain your personal data for as long as your account is active or as needed
                  to provide services. Payment records are retained for 7 years as required by
                  Indian financial regulations. You may request deletion of your account at any time.
                </p>
              </Section>

              <Section title="8. Third-Party Links">
                <p>
                  Our website may contain links to third-party websites. We are not responsible
                  for the privacy practices of those sites and encourage you to review their
                  privacy policies independently.
                </p>
              </Section>

              <Section title="9. Children's Privacy">
                <p>
                  Our services are not directed to individuals under the age of 18. We do not
                  knowingly collect personal information from minors. If you believe a minor has
                  provided us with personal data, please contact us immediately.
                </p>
              </Section>

              <Section title="10. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of
                  significant changes by posting the new policy on this page with an updated date.
                  Continued use of our services after changes constitutes acceptance.
                </p>
              </Section>

              <Section title="11. Contact Us">
                <p>For privacy-related queries, contact us at:</p>
                <ul>
                  <li><strong>Email:</strong> contact@outlookeduservices.com</li>
                  <li><strong>Phone:</strong> +91 89770 11804</li>
                  <li><strong>Address:</strong> Unit A Floor, Ahmed Mansion, Santosh Nagar, Hyderabad, Telangana 500059</li>
                </ul>
              </Section>

              <div className="d-flex gap-3 flex-wrap mt-2">
                <Link to="/terms-and-conditions" className="btn btn-outline-primary btn-sm">Terms &amp; Conditions</Link>
                <Link to="/cookie-policy"        className="btn btn-outline-primary btn-sm">Cookie Policy</Link>
                <Link to="/"                     className="btn btn-primary btn-sm">Back to Home</Link>
              </div>

            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PrivacyPolicy;
