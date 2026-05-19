import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <div className="mb-5">
    <h5 className="fw-bold mb-3" style={{ color: '#0A2540' }}>{title}</h5>
    <div style={{ color: '#444', lineHeight: '1.9', fontSize: '15px' }}>{children}</div>
  </div>
);

const CookiePolicy = () => {
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
          <h1 className="fw-bold mb-2">Cookie Policy</h1>
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
                This Cookie Policy explains how Outlook Edu Services uses cookies and similar
                tracking technologies on our website. By continuing to use our site, you consent
                to our use of cookies as described in this policy.
              </p>

              <Section title="1. What Are Cookies?">
                <p>
                  Cookies are small text files that are placed on your device (computer, tablet,
                  or mobile) when you visit a website. They are widely used to make websites work
                  more efficiently, provide a better user experience, and give website owners
                  useful information about how their site is being used.
                </p>
              </Section>

              <Section title="2. Types of Cookies We Use">
                <p>We use the following categories of cookies:</p>

                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead className="table-dark">
                      <tr>
                        <th>Type</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Essential</strong></td>
                        <td>Required for the website to function (authentication, session management)</td>
                        <td>Session / 7 days</td>
                      </tr>
                      <tr>
                        <td><strong>Functional</strong></td>
                        <td>Remember your preferences (language, course selections)</td>
                        <td>30 days</td>
                      </tr>
                      <tr>
                        <td><strong>Analytics</strong></td>
                        <td>Understand how visitors use our site to improve performance</td>
                        <td>90 days</td>
                      </tr>
                      <tr>
                        <td><strong>Marketing</strong></td>
                        <td>Deliver relevant advertisements and track campaign effectiveness</td>
                        <td>90 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="3. Essential Cookies">
                <p>
                  These cookies are strictly necessary for the website to function and cannot be
                  switched off. They are usually set in response to actions you take, such as
                  logging in, filling in forms, or setting privacy preferences. Without these
                  cookies, services you have requested cannot be provided.
                </p>
                <ul>
                  <li><strong>userToken</strong> — Stores your authentication session (localStorage)</li>
                  <li><strong>cookieConsent</strong> — Records your cookie consent preference</li>
                </ul>
              </Section>

              <Section title="4. Analytics Cookies">
                <p>
                  We may use analytics tools to understand how visitors interact with our website.
                  This helps us improve the user experience and content. Analytics data is
                  aggregated and anonymised — it does not identify you personally.
                </p>
              </Section>

              <Section title="5. Third-Party Cookies">
                <p>
                  Some cookies on our site are set by third-party services we use:
                </p>
                <ul>
                  <li><strong>Razorpay</strong> — Payment processing cookies for secure transactions</li>
                  <li><strong>Cloudinary</strong> — Media delivery optimisation</li>
                  <li><strong>Supabase</strong> — Authentication and database session management</li>
                </ul>
                <p>
                  These third parties have their own privacy and cookie policies, which we
                  encourage you to review.
                </p>
              </Section>

              <Section title="6. Managing Cookies">
                <p>
                  You can control and manage cookies in several ways:
                </p>
                <ul>
                  <li>
                    <strong>Browser settings:</strong> Most browsers allow you to refuse or delete
                    cookies. Visit your browser's help section for instructions.
                  </li>
                  <li>
                    <strong>Our cookie banner:</strong> When you first visit our site, you can
                    accept or decline non-essential cookies using our consent banner.
                  </li>
                </ul>
                <p>
                  Please note that disabling essential cookies may affect the functionality of
                  our website, including your ability to log in or complete a course enrollment.
                </p>
              </Section>

              <Section title="7. Cookie Consent">
                <p>
                  When you first visit our website, we display a cookie consent banner. By
                  clicking "OK" or continuing to browse, you consent to our use of cookies as
                  described in this policy. You can withdraw your consent at any time by clearing
                  your browser cookies and revisiting the site.
                </p>
              </Section>

              <Section title="8. Updates to This Policy">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in
                  technology, legislation, or our data practices. We will notify you of significant
                  changes by updating the date at the top of this page.
                </p>
              </Section>

              <Section title="9. Contact Us">
                <p>If you have questions about our use of cookies, contact us at:</p>
                <ul>
                  <li><strong>Email:</strong> contact@outlookeduservices.com</li>
                  <li><strong>Phone:</strong> +91 89770 11804</li>
                </ul>
              </Section>

              <div className="d-flex gap-3 flex-wrap mt-2">
                <Link to="/terms-and-conditions" className="btn btn-outline-primary btn-sm">Terms &amp; Conditions</Link>
                <Link to="/privacy-policy"       className="btn btn-outline-primary btn-sm">Privacy Policy</Link>
                <Link to="/"                     className="btn btn-primary btn-sm">Back to Home</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
