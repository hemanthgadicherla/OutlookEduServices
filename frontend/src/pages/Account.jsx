import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaBookOpen, FaSignOutAlt } from 'react-icons/fa';
import { userAuthAPI } from '../services/api';
import { getUser, logout as clearTokens, setUserProfile } from '../utils/auth';

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

const Account = () => {
  const navigate   = useNavigate();
  const [profile, setProfile]   = useState(null);
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [loading, setLoading]   = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // ── guard: must be logged in ─────────────────────────────────
  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userAuthAPI.getMe();
      if (res.success) {
        setProfile(res.user);
        reset({ full_name: res.user.full_name, phone: res.user.phone || '' });
      } else if (res.message === 'Invalid or expired token' || res.message === 'Access denied' || res.message === 'Token missing') {
        // Token is stale (e.g. JWT_SECRET rotated) — clear it and send to login
        clearTokens();
        toast.error('Your session has expired. Please log in again.');
        navigate('/login', { replace: true });
      } else {
        toast.error('Could not load profile');
      }
    } catch {
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  // ── save edits ───────────────────────────────────────────────
  const onSave = async (data) => {
    setSaving(true);
    try {
      const res = await userAuthAPI.updateMe({
        full_name: data.full_name.trim(),
        phone:     data.phone.trim()
      });
      if (res.success) {
        setProfile(res.user);
        setEditing(false);

        // Persist updated name (and avatar_url if present) so Navbar
        // reflects the change immediately without a page reload or new JWT
        setUserProfile({
          full_name:  res.user.full_name,
          avatar_url: res.user.avatar_url || null
        });

        // If the backend issued a fresh token, store it so the JWT stays in sync
        if (res.token) {
          localStorage.setItem('userToken', res.token);
        }

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
    reset({ full_name: profile.full_name, phone: profile.phone || '' });
    setEditing(false);
  };

  const handleLogout = async () => {
    try { await userAuthAPI.logout(); } catch { /* non-fatal */ }
    clearTokens();
    navigate('/login');
  };

  // ── avatar letter ────────────────────────────────────────────
  const avatarLetter = profile
    ? (profile.full_name?.[0] || profile.email?.[0] || 'U').toUpperCase()
    : 'U';

  const avatarContent = profile?.avatar_url
    ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    : avatarLetter;

  const roleBadge = {
    admin:   { label: 'Admin',   bg: '#dc3545' },
    student: { label: 'Student', bg: '#0d6efd' },
    user:    { label: 'User',    bg: '#6c757d' }
  }[profile?.role] || { label: 'User', bg: '#6c757d' };

  // ── loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="row justify-content-center g-4">

          {/* ── LEFT: avatar card ── */}
          <div className="col-lg-3 col-md-4">
            <motion.div className="card border-0 shadow-sm text-center p-4" {...fadeUp}>

              {/* avatar */}
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold text-white overflow-hidden"
                style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg,#0d6efd,#6610f2)', fontSize: 36 }}
              >
                {avatarContent}
              </div>

              <h5 className="fw-bold mb-1">{profile?.full_name || '—'}</h5>
              <p className="text-muted small mb-2">{profile?.email}</p>

              {/* role badge */}
              <span
                className="badge mb-3"
                style={{ background: roleBadge.bg, fontSize: 12 }}
              >
                {roleBadge.label}
              </span>

              <hr />

              {/* quick links */}
              <div className="d-grid gap-2">
                <Link to="/lms" className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2">
                  <FaBookOpen size={13} /> My Courses
                </Link>
                <Link to="/course_registration" className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2">
                  <FaUser size={13} /> Course Registration
                </Link>
                <button
                  className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={13} /> Logout
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: details / edit form ── */}
          <div className="col-lg-7 col-md-8">
            <motion.div className="card border-0 shadow-sm" {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
                <h5 className="mb-0 fw-bold">Account Details</h5>
                {!editing && (
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                    onClick={() => setEditing(true)}
                  >
                    <FaEdit size={13} /> Edit Profile
                  </button>
                )}
              </div>

              <div className="card-body p-4">

                {/* ── VIEW MODE ── */}
                {!editing && (
                  <div className="row g-4">
                    <DetailRow icon={<FaUser />}    label="Full Name" value={profile?.full_name || '—'} />
                    <DetailRow icon={<FaEnvelope />} label="Email"     value={profile?.email}            note="Cannot be changed" />
                    <DetailRow icon={<FaPhone />}    label="Phone"     value={profile?.phone || '—'} />
                    <div className="col-12">
                      <p className="text-muted small mb-0">
                        Member since {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '—'}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── EDIT MODE ── */}
                {editing && (
                  <form onSubmit={handleSubmit(onSave)} noValidate>
                    <div className="row g-3">

                      {/* full name */}
                      <div className="col-12">
                        <label className="form-label fw-semibold" htmlFor="acc_full_name">Full Name *</label>
                        <input
                          id="acc_full_name"
                          type="text"
                          className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                          {...register('full_name', {
                            required: 'Full name is required',
                            minLength: { value: 2, message: 'At least 2 characters' }
                          })}
                        />
                        {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                      </div>

                      {/* email — read only */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control bg-light"
                          value={profile?.email || ''}
                          readOnly
                          disabled
                        />
                        <div className="form-text">Email cannot be changed.</div>
                      </div>

                      {/* phone */}
                      <div className="col-12">
                        <label className="form-label fw-semibold" htmlFor="acc_phone">Phone Number</label>
                        <input
                          id="acc_phone"
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="10-digit mobile number"
                          {...register('phone', {
                            pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian number' }
                          })}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                      </div>

                      {/* actions */}
                      <div className="col-12 d-flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          disabled={saving}
                        >
                          {saving
                            ? <><span className="spinner-border spinner-border-sm" aria-hidden="true" /> Saving...</>
                            : <><FaSave size={13} /> Save Changes</>}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary d-flex align-items-center gap-2"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          <FaTimes size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ── small helper component ───────────────────────────────────────
const DetailRow = ({ icon, label, value, note }) => (
  <div className="col-sm-6">
    <div className="d-flex align-items-start gap-3">
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0 text-primary"
        style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(13,110,253,0.08)', fontSize: 15 }}
      >
        {icon}
      </div>
      <div>
        <div className="text-muted small">{label}</div>
        <div className="fw-semibold">{value}</div>
        {note && <div className="text-muted" style={{ fontSize: 11 }}>{note}</div>}
      </div>
    </div>
  </div>
);

export default Account;
