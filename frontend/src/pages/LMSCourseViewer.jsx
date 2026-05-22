import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaCircle, FaChevronDown, FaChevronUp,
  FaArrowLeft, FaLock, FaTrophy, FaBookOpen,
  FaPlay, FaBars, FaTimes,
} from 'react-icons/fa';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { toast } from 'react-toastify';

// ── Smart video player ───────────────────────────────────────────
const VideoPlayer = ({ url, source, title }) => {
  if (!url) return null;

  const detectSource = (u) => {
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('mediadelivery.net') || u.includes('bunnycdn')) return 'bunny';
    return 'url';
  };

  const resolvedSource = source || detectSource(url);

  const getEmbedUrl = () => {
    if (resolvedSource === 'youtube') {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const id = match?.[1];
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
    }
    if (resolvedSource === 'bunny') return url;
    return null;
  };

  const embedUrl = getEmbedUrl();

  if (resolvedSource === 'url' || !embedUrl) {
    return (
      <video src={url} controls style={{ width: '100%', height: '100%', background: '#000' }} title={title}>
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <iframe src={embedUrl} title={title}
      style={{ width: '100%', height: '100%', border: 'none' }}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
};

// ── Up Next overlay ──────────────────────────────────────────────
const UpNextOverlay = ({ nextLesson, onGoNext, onDismiss }) => {
  const [count, setCount] = useState(8);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(intervalRef.current); onGoNext(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onGoNext]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.9)', zIndex: 10, padding: 24, textAlign: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>UP NEXT</div>
      <div className="fw-semibold text-white mb-4" style={{ fontSize: 17, maxWidth: 320 }}>{nextLesson.title}</div>
      <button onClick={onGoNext} className="btn rounded-3 mb-2 px-4"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600 }}>
        Play Now ({count}s)
      </button>
      <button onClick={onDismiss}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer' }}>
        Cancel
      </button>
    </motion.div>
  );
};

// ── Circular progress ring ───────────────────────────────────────
const ProgressRing = ({ progress, size = 52 }) => {
  const r  = (size - 6) / 2;
  const c  = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#pg)" strokeWidth={5}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ── Left sidebar ─────────────────────────────────────────────────
const CourseSidebar = ({ data, activeLesson, expandedMods, setExpandedMods, setActiveLesson, setShowUpNext, completedLessons, totalLessons, progress }) => (
  <div className="d-flex flex-column h-100">

    {/* Sidebar header — course + progress */}
    <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
      <div className="d-flex align-items-center gap-3">
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ProgressRing progress={progress} size={52} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff',
          }}>
            {progress}%
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="fw-bold text-white text-truncate" style={{ fontSize: 13 }}>{data.course.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            {completedLessons} of {totalLessons} lessons done
          </div>
          {progress === 100 && (
            <div className="d-flex align-items-center gap-1 mt-1"
              style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>
              <FaTrophy size={10} /> Completed!
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Chapter list */}
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {(data.modules || []).map((mod, modIdx) => {
        const lessons       = mod.lessons || [];
        const modCompleted  = lessons.filter(l => l.completed).length;
        const isExpanded    = expandedMods[mod.id];

        return (
          <div key={mod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Chapter header */}
            <button
              onClick={() => setExpandedMods(p => ({ ...p, [mod.id]: !p[mod.id] }))}
              className="d-flex align-items-start justify-content-between w-100 border-0 text-start px-3 py-3"
              style={{ background: 'rgba(255,255,255,0.02)', cursor: 'pointer', gap: 8 }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 0.5, marginBottom: 2 }}>
                  CHAPTER {modIdx + 1}
                </div>
                <div className="fw-semibold text-truncate" style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                  {mod.title}
                </div>
                <div className="d-flex align-items-center gap-1 mt-1">
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                    <div style={{
                      height: '100%',
                      width: lessons.length > 0 ? `${Math.round((modCompleted / lessons.length) * 100)}%` : '0%',
                      background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                      borderRadius: 99, transition: 'width 0.4s',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                    {modCompleted}/{lessons.length}
                  </span>
                </div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, paddingTop: 2 }}>
                {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
              </div>
            </button>

            {/* Lessons */}
            {isExpanded && lessons.map((lesson, lessonIdx) => {
              const isActive = activeLesson?.id === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => { setActiveLesson(lesson); setShowUpNext(false); }}
                  className="d-flex align-items-center gap-3 w-100 border-0 text-start px-3 py-2"
                  style={{
                    background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}>
                  {/* Status icon */}
                  <div style={{ flexShrink: 0, width: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {lesson.completed
                      ? <FaCheckCircle size={14} style={{ color: '#22c55e' }} />
                      : isActive
                        ? <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaPlay size={7} style={{ color: '#fff', marginLeft: 1 }} />
                          </div>
                        : lesson.is_free
                          ? <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{lessonIdx + 1}</span>
                            </div>
                          : <FaLock size={11} style={{ color: '#f59e0b' }} />
                    }
                  </div>

                  {/* Lesson title */}
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: 13,
                      color: isActive ? '#fff' : lesson.completed ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.6)',
                      fontWeight: isActive ? 600 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {lesson.title}
                    </div>
                    {lesson.is_free && !lesson.completed && (
                      <span style={{ fontSize: 9, color: '#22c55e', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 3, padding: '1px 4px', marginTop: 2, display: 'inline-block' }}>
                        FREE
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  </div>
);

// ── Suggestions strip ────────────────────────────────────────────
const SuggestionsStrip = ({ courses }) => {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="px-3 px-lg-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="fw-semibold mb-3" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>
        MORE FROM YOUR COURSES
      </div>
      <div className="d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        {courses.map(c => (
          <Link key={c.id} to={`/lms/course/${c.id}`}
            className="d-flex gap-3 align-items-center text-decoration-none rounded-3 p-2 flex-shrink-0"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', minWidth: 260, maxWidth: 300 }}>
            {c.image
              ? <img src={c.image} alt={c.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              : <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  style={{ width: 56, height: 40, background: 'rgba(99,102,241,0.12)' }}>
                  <FaBookOpen style={{ color: '#6366f1' }} size={16} />
                </div>
            }
            <div style={{ overflow: 'hidden' }}>
              <div className="fw-semibold text-white text-truncate" style={{ fontSize: 13 }}>{c.title}</div>
              {c.category && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{c.category}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────
const LMSCourseViewer = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const user     = getUser();

  const [data,          setData]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [expandedMods,  setExpandedMods]  = useState({});
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [certGenerated, setCertGenerated] = useState(false);
  const [showUpNext,    setShowUpNext]    = useState(false);
  const [suggestions,   setSuggestions]   = useState([]);
  const [signedUrl,     setSignedUrl]     = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    fetchContent();
    fetchSuggestions();
  }, [id]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await lmsAPI.getCourseContent(id);
      if (!res.success) { toast.error(res.message || 'Access denied'); navigate('/lms'); return; }
      setData(res.data);
      if (res.data.modules?.length > 0) {
        const firstMod = res.data.modules[0];
        setExpandedMods({ [firstMod.id]: true });
        const firstIncomplete = res.data.modules.flatMap(m => m.lessons || []).find(l => !l.completed);
        setActiveLesson(firstIncomplete || res.data.modules[0]?.lessons?.[0] || null);
      }
    } catch {
      toast.error('Failed to load course'); navigate('/lms');
    } finally { setLoading(false); }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await lmsAPI.getCourseSuggestions(id);
      if (res.success) setSuggestions(res.data?.other_courses || []);
    } catch { /* non-critical */ }
  };

  const allLessons = data?.modules?.flatMap(m => m.lessons || []) || [];

  useEffect(() => {
    setSignedUrl(null);
    const url = activeLesson?.video_url;
    if (!url?.startsWith('bunny:') && !url?.startsWith('storage:')) return;
    lmsAPI.getLessonVideoUrl(activeLesson.id)
      .then(r => { if (r.success) setSignedUrl(r.data.url); })
      .catch(() => {});
  }, [activeLesson?.id]);

  const getNext = (lesson) => {
    const idx = allLessons.findIndex(l => l.id === lesson?.id);
    return idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  };

  const markComplete = useCallback(async (lesson) => {
    if (lesson.completed) return;
    try {
      await lmsAPI.updateProgress(lesson.id, true, lesson.watched_seconds || 0);
      setData(prev => ({
        ...prev,
        modules: prev.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, completed: true } : l),
        })),
      }));
      setActiveLesson(prev => prev?.id === lesson.id ? { ...prev, completed: true } : prev);
      toast.success('Lesson marked as complete!');

      const nowCompleted = allLessons.filter(l => l.completed || l.id === lesson.id).length;
      if (nowCompleted === allLessons.length && allLessons.length > 0) {
        const certRes = await lmsAPI.generateCertificate(parseInt(id));
        if (certRes.success) { setCertGenerated(true); toast.success('Course completed! Certificate generated!'); }
      }

      if (getNext(lesson)) setShowUpNext(true);
    } catch { toast.error('Failed to update progress'); }
  }, [allLessons, id]);

  const goNext = useCallback(() => {
    const next = getNext(activeLesson);
    if (next) { setActiveLesson(next); setShowUpNext(false); }
  }, [activeLesson, allLessons]);

  const goPrev = () => {
    const idx = allLessons.findIndex(l => l.id === activeLesson?.id);
    if (idx > 0) setActiveLesson(allLessons[idx - 1]);
  };

  const totalLessons     = allLessons.length;
  const completedLessons = allLessons.filter(l => l.completed).length;
  const progress         = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const nextLesson       = getNext(activeLesson);
  const activeLessonIdx  = allLessons.findIndex(l => l.id === activeLesson?.id);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#0f172a' }}>
      <div className="spinner-border" style={{ color: '#6366f1' }} />
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ height: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div className="d-flex align-items-center justify-content-between px-3 px-lg-4"
        style={{ height: 52, background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-3">
          <Link to="/lms/courses"
            className="d-flex align-items-center gap-2 text-decoration-none"
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, transition: 'color 0.15s' }}>
            <FaArrowLeft size={12} /> Back
          </Link>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
          <span className="fw-semibold text-white d-none d-md-block" style={{ fontSize: 14 }}>
            {data.course.title}
          </span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Progress bar */}
          <div className="d-none d-sm-flex align-items-center gap-2">
            <div style={{ width: 100, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                borderRadius: 99, transition: 'width 0.4s',
              }} />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
              {completedLessons}/{totalLessons}
            </span>
          </div>

          {/* Sidebar toggle */}
          <button onClick={() => setSidebarOpen(s => !s)}
            className="btn btn-sm d-flex align-items-center gap-2 rounded-2"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: 12, border: 'none' }}>
            {sidebarOpen ? <FaTimes size={11} /> : <FaBars size={11} />}
            <span className="d-none d-md-inline">{sidebarOpen ? 'Hide' : 'Lessons'}</span>
          </button>
        </div>
      </div>

      {/* ── Certificate banner ── */}
      {(certGenerated || progress === 100) && (
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-center justify-content-between px-4 py-2 flex-wrap gap-2"
          style={{ background: 'linear-gradient(135deg,#065f46,#047857)', flexShrink: 0 }}>
          <div className="d-flex align-items-center gap-2 text-white">
            <FaTrophy size={15} style={{ color: '#fbbf24' }} />
            <span className="fw-semibold" style={{ fontSize: 14 }}>Congratulations! You've completed this course.</span>
          </div>
          <Link to="/lms/certificates" className="btn btn-sm rounded-2"
            style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 600, fontSize: 12 }}>
            View Certificate
          </Link>
        </motion.div>
      )}

      {/* ── Body: sidebar + content ── */}
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>

        {/* ── LEFT SIDEBAR ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="d-none d-lg-flex flex-column"
              style={{
                width: 300, flexShrink: 0,
                background: '#131c2e',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              <CourseSidebar
                data={data}
                activeLesson={activeLesson}
                expandedMods={expandedMods}
                setExpandedMods={setExpandedMods}
                setActiveLesson={setActiveLesson}
                setShowUpNext={setShowUpNext}
                completedLessons={completedLessons}
                totalLessons={totalLessons}
                progress={progress}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, overflowY: 'auto', background: '#0f172a' }}>
          {activeLesson ? (
            <>
              {/* Video */}
              <div style={{ background: '#000', aspectRatio: '16/9', maxHeight: '62vh', position: 'relative', flexShrink: 0 }}>
                {(() => {
                  const vUrl      = activeLesson.video_url;
                  const needsSigned = vUrl?.startsWith('bunny:') || vUrl?.startsWith('storage:');
                  if (needsSigned && !signedUrl) return (
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="spinner-border" style={{ color: '#6366f1' }} />
                    </div>
                  );
                  const playUrl = needsSigned ? signedUrl : vUrl;
                  const isBunny = vUrl?.startsWith('bunny:');
                  return (
                    <VideoPlayer url={playUrl}
                      source={isBunny ? 'bunny' : vUrl?.startsWith('storage:') ? 'url' : undefined}
                      title={activeLesson.title} />
                  );
                })()}
                <AnimatePresence>
                  {showUpNext && nextLesson && (
                    <UpNextOverlay nextLesson={nextLesson} onGoNext={goNext} onDismiss={() => setShowUpNext(false)} />
                  )}
                </AnimatePresence>
              </div>

              {/* Lesson info */}
              <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Breadcrumb */}
                {(() => {
                  const parentMod = data.modules?.find(m => m.lessons?.some(l => l.id === activeLesson.id));
                  return parentMod ? (
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
                      {parentMod.title}
                    </div>
                  ) : null;
                })()}

                <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                  <div>
                    <h5 className="fw-bold text-white mb-1" style={{ fontSize: 20 }}>{activeLesson.title}</h5>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                      Lesson {activeLessonIdx + 1} of {totalLessons} &nbsp;·&nbsp; {completedLessons} completed
                    </div>
                  </div>

                  <button
                    onClick={() => markComplete(activeLesson)}
                    disabled={activeLesson.completed}
                    className="btn rounded-3 d-flex align-items-center gap-2 flex-shrink-0"
                    style={{
                      background: activeLesson.completed
                        ? 'rgba(34,197,94,0.12)'
                        : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      color:  activeLesson.completed ? '#22c55e' : '#fff',
                      border: activeLesson.completed ? '1px solid rgba(34,197,94,0.25)' : 'none',
                      fontSize: 13, fontWeight: 600, padding: '8px 18px',
                    }}>
                    <FaCheckCircle size={13} />
                    {activeLesson.completed ? 'Completed ✓' : 'Mark as Complete'}
                  </button>
                </div>

                {activeLesson.content && (
                  <div className="rounded-3 p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    {activeLesson.content}
                  </div>
                )}

                {/* Prev / Next */}
                <div className="d-flex gap-2 mt-4">
                  <button onClick={goPrev} disabled={activeLessonIdx === 0}
                    className="btn rounded-3"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: 13, border: '1px solid rgba(255,255,255,0.08)' }}>
                    ← Previous
                  </button>
                  {nextLesson && (
                    <button onClick={goNext} className="btn rounded-3"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                      Next Lesson →
                    </button>
                  )}
                </div>
              </div>

              <SuggestionsStrip courses={suggestions} />
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center flex-grow-1">
              <div className="text-center">
                <FaBookOpen size={36} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Select a lesson to start</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LMSCourseViewer;
