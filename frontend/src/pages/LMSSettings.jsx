import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LMSSidebar from '../components/LMSSidebar';
import { getUser } from '../utils/auth';

const LMSSettings = () => {
  const user = getUser();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs,  setPushNotifs]  = useState(false);
  const [autoplay,    setAutoplay]    = useState(true);

  const save = () => toast.success('Settings saved');

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar />
      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h4 className="fw-bold text-white mb-1">Settings</h4>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
            Manage your learning preferences
          </p>
        </motion.div>

        <div className="row g-3" style={{ maxWidth: 600 }}>
          <div className="col-12">
            <div className="rounded-4 p-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h6 className="fw-semibold text-white mb-3">Notifications</h6>
              {[
                { label: 'Email notifications', sub: 'Receive course updates via email', val: emailNotifs, set: setEmailNotifs },
                { label: 'Push notifications',  sub: 'Browser push alerts',              val: pushNotifs,  set: setPushNotifs  },
              ].map(({ label, sub, val, set }) => (
                <div key={label} className="d-flex align-items-center justify-content-between py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{sub}</div>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" checked={val}
                      onChange={e => set(e.target.checked)} style={{ cursor: 'pointer', width: 40, height: 22 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12">
            <div className="rounded-4 p-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h6 className="fw-semibold text-white mb-3">Playback</h6>
              <div className="d-flex align-items-center justify-content-between py-2">
                <div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>Autoplay next lesson</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Automatically play the next lesson</div>
                </div>
                <div className="form-check form-switch mb-0">
                  <input className="form-check-input" type="checkbox" checked={autoplay}
                    onChange={e => setAutoplay(e.target.checked)} style={{ cursor: 'pointer', width: 40, height: 22 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <button onClick={save}
              className="btn rounded-3 d-flex align-items-center gap-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600 }}>
              <FaSave size={14} /> Save Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LMSSettings;
