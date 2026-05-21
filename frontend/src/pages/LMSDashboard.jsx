import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBookOpen, FaCheckCircle, FaClock,
  FaCertificate, FaArrowRight, FaPlay
} from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay }
});

// Pure SVG weekly activity bar chart — no external dependency
const WeeklyChart = ({ data = [] }) => {
  const max = Math.max(...data.map(d => d.lessons), 1);
  const W = 100, H = 80, barW = 10, gap = (W - data.length * barW) / (data.length + 1);

  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 160 }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x   = gap + i * (barW + gap);
        const bh  = d.lessons > 0 ? Math.max((d.lessons / max) * H, 4) : 2;
        const y   = H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh}
              fill={d.lessons > 0 ? 'url(#barGrad)' : 'rgba(255,255,255,0.06)'}
              rx={3} />
            <text x={x + barW / 2} y={H + 14} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize={6}>{d.day}</text>
            {d.lessons > 0 && (
              <text x={x + barW / 2} y={y - 3} textAnchor="middle"
                fill="rgba(255,255,255,0.6)" fontSize={6}>{d.lessons}</text>
            )}
          </g>
        );
      })}
      {/* baseline */}
      <line x1={0} y1={H} x2={W} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
    </svg>
  );
};

// Circular progress ring
const Ring = ({ pct, size = 56, stroke = 5, color = '#6366f1' }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
};

// Skeleton loader
const Skeleton = ({ h = 20, w = '100%', r = 8 }) => (
  <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
);

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div {...fadeUp(delay)}
    className="rounded-4 p-4 d-flex align-items-center gap-3"
    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
  >
    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
      style={{ width: 48, height: 48, background: `${color}22` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <div className="fw-bold text-white" style={{ fontSize: 24, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</div>
    </div>
  </motion.div>
);

const CourseCard = ({ item, delay }) => {
  const course = item.courses;
  const pct    = item.progress || 0;
  const status = pct === 100 ? 'Completed' : pct > 0 ? 'In Progress' : 'Not Started';
  const statusColor = pct === 100 ? '#22c55e' : pct > 0 ? '#6366f1' : 'rgba(255,255,255,0.4)';

  return (
    <motion.div {...fadeUp(delay)}
      className="rounded-4 overflow-hidden"
      style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img
          src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span className="badge rounded-pill px-2 py-1" style={{ background: `${statusColor}22`, color: statusColor, fontSize: 11, border: `1px solid ${statusColor}44` }}>
            {status}
          </span>
        </div>
        {/* Ring overlay */}
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          <div style={{ position: 'relative', width: 44, height: 44 }}>
            <Ring pct={pct} size={44} stroke={4} color={statusColor} />
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="fw-semibold text-white mb-1" style={{ fontSize: 15, lineHeight: 1.4 }}>
          {course.title}
        </div>
        {course.category && (
          <span className="badge rounded-pill mb-2" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: 11 }}>
            {course.category}
          </span>
        )}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            <span>{item.completed_lessons || 0} / {item.total_lessons || 0} lessons</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
        </div>

        <Link
          to={`/lms/course/${course.id}`}
          className="d-flex align-items-center justify-content-center gap-2 text-decoration-none rounded-3 py-2"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600 }}
        >
          <FaPlay size={11} />
          {pct === 0 ? 'Start Learning' : pct === 100 ? 'Review Course' : 'Continue Learning'}
        </Link>
      </div>
    </motion.div>
  );
};

const LMSDashboard = () => {
  const navigate = useNavigate();
  const user     = getUser();

  const [courses,  setCourses]  = useState([]);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Step 1: fetch courses first — fast check
      const coursesRes = await lmsAPI.getCourses(user.id);
      const fetchedCourses = coursesRes.success ? (coursesRes.data || []) : [];
      setCourses(fetchedCourses);

      // Step 2: only fetch stats + notifications if user has courses
      // Avoids 2 extra slow queries for unpurchased users
      if (fetchedCourses.length > 0) {
        const [statsRes, notifRes] = await Promise.all([
          lmsAPI.getStats(),
          lmsAPI.getNotifications()
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (notifRes.success) setNotifCount((notifRes.data || []).filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ongoing   = courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100);
  const completed = courses.filter(c => (c.progress || 0) === 100);

  if (!user) return null;

  // ── Gate: user has no purchased courses ──────────────────────
  if (!loading && courses.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a' }}>
        {/* Top bar with logo + nav links */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/">
            <img
              src="https://res.cloudinary.com/du1lrb3ng/image/upload/v1777891872/Outlook_logo_lux4gu.png"
              alt="Outlook Edu Services"
              style={{ height: 44, objectFit: 'contain' }}
            />
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/"        style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Home</Link>
            <Link to="/courses" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Courses</Link>
            <Link to="/contact" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Contact</Link>
            <Link to="/account" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none' }}>Account</Link>
          </div>
        </div>

        {/* Main content */}
        <div className="d-flex align-items-center justify-content-center p-3 p-lg-4"
          style={{ minHeight: 'calc(100vh - 70px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
            style={{ maxWidth: 560 }}
          >
            {/* Illustration */}
            <div className="mb-4 mx-auto d-flex align-items-center justify-content-center"
              style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '2px solid rgba(99,102,241,0.3)' }}>
              <FaBookOpen size={48} style={{ color: '#818cf8' }} />
            </div>

            <h3 className="fw-bold text-white mb-2">No Courses Yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              You haven't purchased any courses yet. Explore our catalog and start your learning journey today.
            </p>

            {/* Feature highlights */}
            <div className="row g-3 mb-4 text-start">
              {[
                { icon: '🎓', title: 'Expert-Led Courses',    desc: 'Learn from industry professionals' },
                { icon: '📜', title: 'Earn Certificates',     desc: 'Get certified upon completion'     },
                { icon: '⚡', title: 'Learn at Your Pace',    desc: 'Access anytime, anywhere'          },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="col-12 col-sm-4">
                  <div className="rounded-3 p-3 text-center h-100"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div className="fw-semibold text-white" style={{ fontSize: 13 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/courses"
                className="btn rounded-3 px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 15 }}>
                <FaBookOpen size={15} />
                Browse Courses
              </Link>
              <Link to="/contact"
                className="btn rounded-3 px-4 py-2 fw-semibold"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 15 }}>
                Talk to Counsellor
              </Link>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 24 }}>
              Already purchased a course?{' '}
              <button onClick={fetchAll} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                Refresh
              </button>
            </p>
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
              Welcome back, {user.full_name?.split(' ')[0] || 'Student'} 👋
            </h4>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 4, marginBottom: 0 }}>
              Here's your learning overview
            </p>
          </div>
          <Link to="/courses" className="btn btn-sm rounded-3 d-flex align-items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13 }}>
            Browse Courses <FaArrowRight size={11} />
          </Link>
        </motion.div>

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {[
            { icon: FaBookOpen,    label: 'Purchased Courses', value: loading ? '—' : courses.length,                    color: '#6366f1', delay: 0.05 },
            { icon: FaCheckCircle, label: 'Completed',         value: loading ? '—' : completed.length,                  color: '#22c55e', delay: 0.1  },
            { icon: FaClock,       label: 'In Progress',       value: loading ? '—' : ongoing.length,                    color: '#f59e0b', delay: 0.15 },
            { icon: FaCertificate, label: 'Certificates',      value: loading ? '—' : (stats?.certificates ?? 0),        color: '#ec4899', delay: 0.2  },
          ].map(s => (
            <div key={s.label} className="col-6 col-xl-3">
              {loading ? (
                <div className="rounded-4 p-4" style={{ background: '#1e293b' }}><Skeleton h={60} /></div>
              ) : (
                <StatCard {...s} />
              )}
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Weekly activity chart */}
          <div className="col-lg-7">
            <motion.div {...fadeUp(0.25)} className="rounded-4 p-4 h-100"
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="fw-semibold text-white mb-3" style={{ fontSize: 15 }}>Weekly Activity</div>
              {loading ? <Skeleton h={180} /> : (
                <WeeklyChart data={stats?.weekly_activity || []} />
              )}
            </motion.div>
          </div>

          {/* Quick stats */}
          <div className="col-lg-5">
            <motion.div {...fadeUp(0.3)} className="rounded-4 p-4 h-100"
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="fw-semibold text-white mb-3" style={{ fontSize: 15 }}>Learning Stats</div>
              {loading ? <Skeleton h={180} /> : (
                <div className="d-flex flex-column gap-3">
                  {[
                    { label: 'Lessons Completed', value: stats?.completed_lessons ?? 0, icon: '✅' },
                    { label: 'Hours Spent',        value: `${stats?.time_spent_hours ?? 0}h`, icon: '⏱️' },
                    { label: 'Overall Progress',
                      value: courses.length > 0
                        ? `${Math.round(courses.reduce((s, c) => s + (c.progress || 0), 0) / courses.length)}%`
                        : '0%',
                      icon: '📈' },
                    { label: 'Certificates Earned', value: stats?.certificates ?? 0, icon: '🏆' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="d-flex align-items-center justify-content-between p-3 rounded-3"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                        <span>{icon}</span> {label}
                      </div>
                      <span className="fw-bold text-white" style={{ fontSize: 16 }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mt-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-white mb-0">My Courses</h5>
            <Link to="/lms/courses" style={{ color: '#818cf8', fontSize: 13, textDecoration: 'none' }}>
              View all <FaArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1,2,3].map(i => (
                <div key={i} className="col-md-4">
                  <div className="rounded-4 p-3" style={{ background: '#1e293b' }}>
                    <Skeleton h={160} r={12} />
                    <div className="mt-3"><Skeleton h={16} w="70%" /></div>
                    <div className="mt-2"><Skeleton h={12} /></div>
                    <div className="mt-3"><Skeleton h={36} /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <motion.div {...fadeUp(0.3)} className="text-center py-5 rounded-4"
              style={{ background: '#1e293b', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <FaBookOpen size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
              <p className="text-white fw-semibold mb-1">No courses yet</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Purchase a course to start learning</p>
              <Link to="/courses" className="btn btn-sm mt-2 rounded-3"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
                Browse Courses
              </Link>
            </motion.div>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default LMSDashboard;
