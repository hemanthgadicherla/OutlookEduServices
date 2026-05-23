import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBookOpen, FaCheckCircle, FaClock,
  FaCertificate, FaArrowRight, FaPlay, FaFire
} from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay }
});

// SVG weekly activity bar chart
const WeeklyChart = ({ data = [] }) => {
  const max = Math.max(...data.map(d => d.lessons), 1);
  const W = 100, H = 80, barW = 10, gap = (W - data.length * barW) / (data.length + 1);
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 140 }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x  = gap + i * (barW + gap);
        const bh = d.lessons > 0 ? Math.max((d.lessons / max) * H, 4) : 2;
        const y  = H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh}
              fill={d.lessons > 0 ? 'url(#barGrad)' : 'rgba(255,255,255,0.06)'} rx={3} />
            <text x={x + barW / 2} y={H + 14} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize={6}>{d.day}</text>
            {d.lessons > 0 && (
              <text x={x + barW / 2} y={y - 3} textAnchor="middle"
                fill="rgba(255,255,255,0.6)" fontSize={6}>{d.lessons}</text>
            )}
          </g>
        );
      })}
      <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
    </svg>
  );
};

const Ring = ({ pct, size = 56, stroke = 5, color = '#6366f1' }) => {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
};

const Skeleton = ({ h = 20, w = '100%', r = 8 }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
);

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div {...fadeUp(delay)}
    className="rounded-4 p-3 d-flex align-items-center gap-3"
    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
      style={{ width: 44, height: 44, background: `${color}20` }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <div className="fw-bold text-white" style={{ fontSize: 22, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{label}</div>
    </div>
  </motion.div>
);

// ── "Continue Learning" hero card ──────────────────────────────
const ContinueCard = ({ resume, courseProgress }) => {
  if (!resume?.course) return null;
  const c   = resume.course;
  const pct = courseProgress || 0;
  return (
    <motion.div {...fadeUp(0)}
      className="rounded-4 overflow-hidden mb-4"
      style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '1px solid rgba(99,102,241,0.3)', position: 'relative' }}
    >
      <div className="d-flex align-items-center gap-0 flex-wrap">
        {/* Thumbnail */}
        {c.image && (
          <div className="d-none d-md-block flex-shrink-0" style={{ width: 180, height: 120, overflow: 'hidden' }}>
            <img src={c.image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
          </div>
        )}
        <div className="p-4 flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaFire size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600, letterSpacing: 0.5 }}>CONTINUE LEARNING</span>
          </div>
          <div className="fw-bold text-white mb-1" style={{ fontSize: 18 }}>{c.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
            {resume.lesson_title && <>Next: {resume.lesson_title}</>}
          </div>
          {/* Progress */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.6s' }} />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>{pct}% done</span>
          </div>
          <Link to={`/lms/course/${c.id}`}
            className="btn btn-sm rounded-3 d-inline-flex align-items-center gap-2 fw-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13 }}>
            <FaPlay size={11} /> Resume Course
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ── Course card ─────────────────────────────────────────────────
const CourseCard = ({ item, delay }) => {
  const course       = item.courses;
  const pct          = item.progress || 0;
  const statusColor  = pct === 100 ? '#22c55e' : pct > 0 ? '#6366f1' : 'rgba(255,255,255,0.4)';
  const statusLabel  = pct === 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started';
  return (
    <motion.div {...fadeUp(delay)}
      className="rounded-4 overflow-hidden h-100"
      style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.2 }}
    >
      <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
        <img
          src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.9) 0%,transparent 60%)' }} />
        <span className="badge position-absolute" style={{ top: 10, right: 10, background: `${statusColor}22`, color: statusColor, fontSize: 10, border: `1px solid ${statusColor}44` }}>
          {statusLabel}
        </span>
        <div style={{ position: 'absolute', bottom: 10, right: 10, position: 'absolute' }}>
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <Ring pct={pct} size={40} stroke={4} color={statusColor} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{pct}%</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="fw-semibold text-white mb-2" style={{ fontSize: 14, lineHeight: 1.4 }}>{course.title}</div>
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            <span>{item.completed_lessons || 0}/{item.total_lessons || 0} lessons</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
        </div>
        <Link to={`/lms/course/${course.id}`}
          className="d-flex align-items-center justify-content-center gap-2 text-decoration-none rounded-3 py-2"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
          <FaPlay size={10} />
          {pct === 0 ? 'Start' : pct === 100 ? 'Review' : 'Continue'}
        </Link>
      </div>
    </motion.div>
  );
};

const LMSDashboard = () => {
  const navigate = useNavigate();
  const user     = getUser();

  const [courses,    setCourses]    = useState([]);
  const [stats,      setStats]      = useState(null);
  const [resume,     setResume]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const coursesRes = await lmsAPI.getCourses(user.id);
      const fetched    = coursesRes.success ? (coursesRes.data || []) : [];
      setCourses(fetched);

      if (fetched.length > 0) {
        const [statsRes, notifRes, resumeRes] = await Promise.all([
          lmsAPI.getStats(),
          lmsAPI.getNotifications(),
          lmsAPI.getResume()
        ]);
        if (statsRes.success)  setStats(statsRes.data);
        if (notifRes.success)  setNotifCount((notifRes.data || []).filter(n => !n.is_read).length);
        if (resumeRes.success) setResume(resumeRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ongoing    = courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100);
  const completed  = courses.filter(c => (c.progress || 0) === 100);
  const resumePct  = resume ? (courses.find(c => c.courses?.id === resume.course?.id)?.progress || 0) : 0;

  if (!user) return null;

  // ── No courses gate ─────────────────────────────────────────
  if (!loading && courses.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a' }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/">
            <img src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
              alt="Outlook" style={{ height: 44, objectFit: 'contain' }} />
          </Link>
          <div className="d-flex gap-3">
            {['/', '/courses', '/contact', '/lms/profile'].map((p, i) => (
              <Link key={p} to={p} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>
                {['Home','Courses','Contact','Profile'][i]}
              </Link>
            ))}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center p-4" style={{ minHeight: 'calc(100vh - 70px)' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center" style={{ maxWidth: 520 }}>
            <div className="mb-4 mx-auto d-flex align-items-center justify-content-center"
              style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '2px solid rgba(99,102,241,0.3)' }}>
              <FaBookOpen size={44} style={{ color: '#818cf8' }} />
            </div>
            <h3 className="fw-bold text-white mb-2">No Courses Yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              You haven't purchased any courses. Explore our catalog and start your learning journey.
            </p>
            <div className="row g-3 mb-4 text-start">
              {[
                { icon: '🎓', title: 'Expert-Led',   desc: 'Learn from industry pros' },
                { icon: '📜', title: 'Certificates', desc: 'Get certified on completion' },
                { icon: '⚡', title: 'Self-Paced',   desc: 'Access anytime, anywhere' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="col-4">
                  <div className="rounded-3 p-3 text-center h-100"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
                    <div className="fw-semibold text-white" style={{ fontSize: 12 }}>{title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/courses" className="btn rounded-3 px-4 py-2 fw-semibold"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
                Browse Courses
              </Link>
              <Link to="/contact" className="btn rounded-3 px-4 py-2"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Talk to Counsellor
              </Link>
            </div>
            <button onClick={fetchAll} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: 12, cursor: 'pointer', marginTop: 20 }}>
              Refresh
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar notifCount={notifCount} />

      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold text-white mb-0">
              Welcome back, {user.full_name?.split(' ')[0] || 'Student'}
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 3, marginBottom: 0 }}>
              Here's your learning overview
            </p>
          </div>
          <Link to="/courses" className="btn btn-sm rounded-3 d-flex align-items-center gap-2"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', fontSize: 13 }}>
            Browse Courses <FaArrowRight size={10} />
          </Link>
        </motion.div>

        {/* Continue Learning hero */}
        {!loading && resume && <ContinueCard resume={resume} courseProgress={resumePct} />}

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {[
            { icon: FaBookOpen,    label: 'Purchased',   value: loading ? '—' : courses.length,           color: '#6366f1', delay: 0.05 },
            { icon: FaCheckCircle, label: 'Completed',   value: loading ? '—' : completed.length,         color: '#22c55e', delay: 0.1  },
            { icon: FaClock,       label: 'In Progress', value: loading ? '—' : ongoing.length,           color: '#f59e0b', delay: 0.15 },
            { icon: FaCertificate, label: 'Certificates',value: loading ? '—' : (stats?.certificates ?? 0), color: '#ec4899', delay: 0.2 },
          ].map(s => (
            <div key={s.label} className="col-6 col-xl-3">
              {loading
                ? <div className="rounded-4 p-3" style={{ background: '#1e293b' }}><Skeleton h={52} /></div>
                : <StatCard {...s} />
              }
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="row g-3 mb-4">
          <div className="col-lg-7">
            <motion.div {...fadeUp(0.25)} className="rounded-4 p-4 h-100"
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="fw-semibold text-white mb-3" style={{ fontSize: 14 }}>Weekly Activity</div>
              {loading ? <Skeleton h={160} /> : <WeeklyChart data={stats?.weekly_activity || []} />}
            </motion.div>
          </div>
          <div className="col-lg-5">
            <motion.div {...fadeUp(0.3)} className="rounded-4 p-4 h-100"
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="fw-semibold text-white mb-3" style={{ fontSize: 14 }}>Learning Stats</div>
              {loading ? <Skeleton h={160} /> : (
                <div className="d-flex flex-column gap-2">
                  {[
                    { label: 'Lessons Completed', value: stats?.completed_lessons ?? 0,      icon: '✅' },
                    { label: 'Hours Spent',        value: `${stats?.time_spent_hours ?? 0}h`, icon: '⏱️' },
                    { label: 'Overall Progress',
                      value: courses.length > 0
                        ? `${Math.round(courses.reduce((s, c) => s + (c.progress || 0), 0) / courses.length)}%`
                        : '0%',
                      icon: '📈' },
                    { label: 'Certificates', value: stats?.certificates ?? 0, icon: '🏆' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="d-flex align-items-center justify-content-between px-3 py-2 rounded-3"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                        <span>{icon}</span>{label}
                      </div>
                      <span className="fw-bold text-white" style={{ fontSize: 15 }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-white mb-0" style={{ fontSize: 16 }}>My Courses</h5>
            <Link to="/lms/courses" style={{ color: '#818cf8', fontSize: 13, textDecoration: 'none' }}>
              View all <FaArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1,2,3].map(i => (
                <div key={i} className="col-md-4">
                  <div className="rounded-4 p-3" style={{ background: '#1e293b' }}>
                    <Skeleton h={150} r={12} />
                    <div className="mt-3"><Skeleton h={14} w="65%" /></div>
                    <div className="mt-2"><Skeleton h={10} /></div>
                    <div className="mt-3"><Skeleton h={34} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {courses.slice(0, 6).map((item, i) => (
                <div key={item.course_id} className="col-md-6 col-xl-4">
                  <CourseCard item={item} delay={i * 0.05} />
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
};

export default LMSDashboard;
