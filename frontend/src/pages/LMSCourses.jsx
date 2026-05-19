import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaSearch, FaBookOpen } from 'react-icons/fa';
import LMSSidebar from '../components/LMSSidebar';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const Ring = ({ pct, size = 44, stroke = 4, color = '#6366f1' }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  );
};

const LMSCourses = () => {
  const navigate = useNavigate();
  const user     = getUser();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    lmsAPI.getCourses(user.id)
      .then(r => { if (r.success) setCourses(r.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(item => {
    const title = item.courses?.title?.toLowerCase() || '';
    const matchSearch = title.includes(search.toLowerCase());
    const pct = item.progress || 0;
    const matchFilter =
      filter === 'all'       ? true :
      filter === 'ongoing'   ? pct > 0 && pct < 100 :
      filter === 'completed' ? pct === 100 :
      filter === 'new'       ? pct === 0 : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#0f172a' }}>
      <LMSSidebar />
      <main className="flex-grow-1 p-3 p-lg-4" style={{ minWidth: 0 }}>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h4 className="fw-bold text-white mb-1">My Courses</h4>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 0 }}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} purchased
          </p>
        </motion.div>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-2 mb-4 align-items-center">
          <div className="position-relative flex-grow-1" style={{ maxWidth: 300 }}>
            <FaSearch size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="text" placeholder="Search courses..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="form-control border-0 ps-4"
              style={{ background: '#1e293b', color: '#fff', fontSize: 14, borderRadius: 10 }}
            />
          </div>
          {['all','ongoing','completed','new'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="btn btn-sm rounded-3 text-capitalize"
              style={{
                background: filter === f ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#1e293b',
                color: filter === f ? '#fff' : 'rgba(255,255,255,0.5)',
                border: 'none', fontSize: 13
              }}>
              {f === 'all' ? 'All' : f === 'ongoing' ? 'In Progress' : f === 'completed' ? 'Completed' : 'Not Started'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#6366f1' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: '#1e293b' }}>
            <FaBookOpen size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
            <p className="text-white mb-1">No courses found</p>
            <Link to="/courses" className="btn btn-sm rounded-3 mt-2"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((item, i) => {
              const course = item.courses;
              const pct    = item.progress || 0;
              const statusColor = pct === 100 ? '#22c55e' : pct > 0 ? '#6366f1' : 'rgba(255,255,255,0.4)';
              return (
                <div key={item.course_id} className="col-md-6 col-xl-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-4 overflow-hidden h-100"
                    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
                    whileHover={{ y: -4 }}
                  >
                    <div style={{ position: 'relative', height: 160 }}>
                      <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                        alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'; }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <div style={{ position: 'relative', width: 44, height: 44 }}>
                          <Ring pct={pct} color={statusColor} />
                          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="fw-semibold text-white mb-2" style={{ fontSize: 15 }}>{course.title}</div>
                      <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                        <span>{item.completed_lessons || 0}/{item.total_lessons || 0} lessons</span>
                        <span>{item.enrolled_at ? new Date(item.enrolled_at).toLocaleDateString('en-IN') : ''}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginBottom: 12 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99 }} />
                      </div>
                      <Link to={`/lms/course/${course.id}`}
                        className="d-flex align-items-center justify-content-center gap-2 text-decoration-none rounded-3 py-2"
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                        <FaPlay size={11} />
                        {pct === 0 ? 'Start Learning' : pct === 100 ? 'Review' : 'Continue'}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default LMSCourses;
