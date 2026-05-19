import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const LMSNotifications = () => {
  const navigate = useNavigate();
  const user     = getUser();
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    lmsAPI.getNotifications()
      .then(r => { if (r.success) setNotifs(r.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await lmsAPI.markNotificationRead(id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifs.filter(n => !n.is_read);
    await Promise.all(unread.map(n => lmsAPI.markNotificationRead(n.id)));
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar notifCount={unreadCount} />
      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold text-white mb-1">Notifications</h4>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="btn btn-sm rounded-3 d-flex align-items-center gap-2"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', fontSize: 13 }}>
              <FaCheckDouble size={12} /> Mark all read
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#6366f1' }} /></div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: '#1e293b', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <FaBell size={40} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
            <p className="text-white fw-semibold mb-1">No notifications</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>You're all caught up!</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {notifs.map((n, i) => (
              <motion.div key={n.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !n.is_read && markRead(n.id)}
                className="rounded-3 p-3 d-flex align-items-start gap-3"
                style={{
                  background: n.is_read ? 'rgba(255,255,255,0.03)' : 'rgba(99,102,241,0.08)',
                  border: `1px solid ${n.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.2)'}`,
                  cursor: n.is_read ? 'default' : 'pointer'
                }}>
                <div className="flex-shrink-0 mt-1"
                  style={{ width: 8, height: 8, borderRadius: '50%', background: n.is_read ? 'transparent' : '#6366f1', marginTop: 6 }} />
                <div className="flex-grow-1">
                  <div className="fw-semibold text-white" style={{ fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                    {new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LMSNotifications;
