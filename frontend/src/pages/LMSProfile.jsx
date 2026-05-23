import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave,
  FaTimes, FaShieldAlt, FaCalendarAlt
} from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { userAuthAPI } from '../services/api';
import { getUser, logout as clearTokens, setUserProfile } from '../utils/auth';

const CARD = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' };
const INPUT_STYLE = { background: 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' };

const LMSProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const user = getUser();
    if (!user) { navigate('/login', { replace: true }); return; }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAuthAPI.getMe();
      if (res.success) {
        setProfile(res.user);
        reset({ full_name: res.user.full_name, phone: res.user.phone || '' });
      } else {
        clearTokens();
        toast.error('Session expired. Please log in again.');
        navigate('/login', { replace: true });
      }
    } catch {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (data) => {
    setSaving(true);
    try {
      const res = await userAuthAPI.updateMe({
        full_name: data.full_name.trim(),
        phone:     data.phone.trim(),
      });
      if (res.success) {
        setProfile(res.user);
        setEditing(false);
        setUserProfile({ full_name: res.user.full_name, avatar_url: res.user.avatar_url || null });
        if (res.token) localStorage.setItem('userToken', res.token);
        toast.success('Profile updated');
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    reset({ full_name: profile?.full_name, phone: profile?.phone || '' });
    setEditing(false);
  };

  const avatarLetter = (profile?.full_name?.[0] || profile?.email?.[0] || 'S').toUpperCase();
  const memberSince  = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  if (loading) return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="spinner-border" style={{ color: '#6366f1' }} />
      </main>
    </div>
  );

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar />

      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h4 className="fw-bold text-white mb-1">My Profile</h4>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
            Manage your account information
          </p>
        </motion.div>

        <div className="row g-4" style={{ maxWidth: 820 }}>

          {/* ── Avatar / summary card ── */}
          <div className="col-md-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-4 p-4 text-center h-100 d-flex flex-column align-items-center"
              style={CARD}>
              <div className="mb-3 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize: 32 }}>
                {avatarLetter}
              </div>
              <div className="fw-bold text-white mb-1" style={{ fontSize: 16 }}>
                {profile?.full_name}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                {profile?.email}
              </div>
              <span className="badge rounded-pill mb-4"
                style={{ background: 'rgba(99,102,241,0.18)', color: '#818cf8', fontSize: 11, border: '1px solid rgba(99,102,241,0.3)' }}>
                Student
              </span>

              <div className="w-100 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="d-flex align-items-center gap-2 justify-content-center"
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  <FaCalendarAlt size={11} />
                  Member since {memberSince}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Details / edit card ── */}
          <div className="col-md-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-4 overflow-hidden"
              style={CARD}>

              {/* Header */}
              <div className="d-flex align-items-center justify-content-between px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="fw-semibold text-white" style={{ fontSize: 14 }}>Account Details</span>
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="btn btn-sm d-flex align-items-center gap-2 rounded-3"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', fontSize: 13 }}>
                    <FaEdit size={12} /> Edit Profile
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-4">
                {!editing ? (
                  <div className="row g-3">
                    {[
                      { icon: FaUser,      label: 'Full Name', value: profile?.full_name },
                      { icon: FaEnvelope,  label: 'Email',     value: profile?.email, note: 'Cannot be changed' },
                      { icon: FaPhone,     label: 'Phone',     value: profile?.phone || '—' },
                      { icon: FaShieldAlt, label: 'Role',      value: 'Student' },
                    ].map(({ icon: Icon, label, value, note }) => (
                      <div key={label} className="col-sm-6">
                        <div className="d-flex align-items-start gap-3">
                          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.12)' }}>
                            <Icon size={14} style={{ color: '#818cf8' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{label}</div>
                            <div className="fw-semibold text-white" style={{ fontSize: 14 }}>{value}</div>
                            {note && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{note}</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSave)} noValidate>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                        style={INPUT_STYLE}
                        {...register('full_name', {
                          required: 'Full name is required',
                          minLength: { value: 2, message: 'At least 2 characters' }
                        })}
                      />
                      {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        readOnly disabled
                        value={profile?.email || ''}
                        style={{ ...INPUT_STYLE, opacity: 0.4, cursor: 'not-allowed' }}
                      />
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                        Email cannot be changed.
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="10-digit mobile number"
                        style={INPUT_STYLE}
                        {...register('phone', {
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian number' }
                        })}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" disabled={saving}
                        className="btn rounded-3 d-flex align-items-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600, fontSize: 13 }}>
                        {saving
                          ? <span className="spinner-border spinner-border-sm" />
                          : <FaSave size={12} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={cancelEdit}
                        className="btn rounded-3 d-flex align-items-center gap-2"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: 13, border: '1px solid rgba(255,255,255,0.08)' }}>
                        <FaTimes size={12} /> Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LMSProfile;
