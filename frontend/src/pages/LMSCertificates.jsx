import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCertificate, FaDownload, FaTrophy } from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const CertificateCard = ({ cert, user }) => {
  const printRef = useRef();

  const handleDownload = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Certificate</title>
      <style>
        body { margin: 0; font-family: Georgia, serif; background: #fff; }
        .cert { width: 800px; height: 560px; margin: 20px auto; border: 12px solid #0A2540;
          padding: 40px; text-align: center; position: relative; background: #fff; }
        .cert-inner { border: 2px solid #facc15; height: 100%; padding: 30px; display: flex;
          flex-direction: column; align-items: center; justify-content: center; }
        h1 { color: #0A2540; font-size: 36px; margin-bottom: 8px; }
        h2 { color: #6366f1; font-size: 28px; margin: 16px 0; }
        h3 { color: #0A2540; font-size: 22px; }
        p { color: #555; font-size: 15px; }
        .gold { color: #facc15; font-size: 48px; }
        .id { font-size: 11px; color: #999; margin-top: 20px; }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const courseName = cert.courses?.title || 'Course';
  const certId     = cert.certificate_url || `CERT-${cert.id}`;
  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-4 overflow-hidden"
      style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Preview */}
      <div ref={printRef} className="cert" style={{ display: 'none' }}>
        <div className="cert-inner">
          <div className="gold">🏆</div>
          <h1>Certificate of Completion</h1>
          <p>This is to certify that</p>
          <h2>{user?.full_name || 'Student'}</h2>
          <p>has successfully completed</p>
          <h3>{courseName}</h3>
          <p>Issued on {issuedDate} by Outlook Edu Services</p>
          <div className="id">Certificate ID: {certId}</div>
        </div>
      </div>

      {/* Card display */}
      <div className="p-4">
        <div className="d-flex align-items-start gap-3 mb-3">
          <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
            style={{ width: 48, height: 48, background: 'rgba(251,191,36,0.15)' }}>
            <FaTrophy size={22} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div className="fw-semibold text-white" style={{ fontSize: 15 }}>{courseName}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              Issued: {issuedDate}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              ID: {certId}
            </div>
          </div>
        </div>

        {/* Mini certificate preview */}
        <div className="rounded-3 p-3 mb-3 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🏆</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Certificate of Completion</div>
          <div className="fw-semibold text-white" style={{ fontSize: 13 }}>{user?.full_name || 'Student'}</div>
          <div style={{ fontSize: 11, color: '#818cf8', marginTop: 2 }}>{courseName}</div>
        </div>

        <button onClick={handleDownload}
          className="btn w-100 rounded-3 d-flex align-items-center justify-content-center gap-2"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
          <FaDownload size={13} /> Download Certificate
        </button>
      </div>
    </motion.div>
  );
};

const LMSCertificates = () => {
  const navigate = useNavigate();
  const user     = getUser();
  const [certs,   setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    lmsAPI.getCertificates()
      .then(r => { if (r.success) setCerts(r.data || []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar />
      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h4 className="fw-bold text-white mb-1">My Certificates</h4>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
            Certificates are awarded upon 100% course completion
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : certs.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: '#1e293b', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <FaCertificate size={48} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
            <p className="text-white fw-semibold mb-1">No certificates yet</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Complete a course to earn your certificate</p>
          </div>
        ) : (
          <div className="row g-3">
            {certs.map(cert => (
              <div key={cert.id} className="col-md-6 col-xl-4">
                <CertificateCard cert={cert} user={user} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LMSCertificates;
