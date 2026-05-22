import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaCircle, FaChevronDown, FaChevronRight,
  FaArrowLeft, FaPlay, FaLock, FaTrophy, FaBookOpen
} from 'react-icons/fa';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { toast } from 'react-toastify';

// ── Smart video player — YouTube, Bunny Stream, or direct URL ──
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
      const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
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
    <iframe
      src={embedUrl}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none' }}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
};

// ── "Up Next" countdown overlay shown after a lesson ends ──
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
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.88)',
        zIndex: 10, padding: 24, textAlign: 'center'
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 8 }}>Up Next</div>
      <div className="fw-semibold text-white mb-4" style={{ fontSize: 16, maxWidth: 320 }}>{nextLesson.title}</div>
      <button
        onClick={onGoNext}
        className="btn rounded-3 mb-2 px-4"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontWeight: 600 }}
      >
        Play Now ({count}s)
      </button>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer' }}>
        Cancel
      </button>
    </motion.div>
  );
};

// ── Other paid courses strip ──
const SuggestionsStrip = ({ courses }) => {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="px-3 px-lg-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="fw-semibold mb-3" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
        MORE FROM YOUR COURSES
      </div>
      <div className="d-flex gap-3" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        {courses.map(c => (
          <Link
            key={c.id}
            to={`/lms/course/${c.id}`}
            className="d-flex gap-3 align-items-center text-decoration-none rounded-3 p-2 flex-shrink-0"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', minWidth: 260, maxWidth: 300 }}
          >
            {c.image
              ? <img src={c.image} alt={c.title} style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              : <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                  style={{ width: 60, height: 44, background: 'rgba(99,102,241,0.15)' }}>
                  <FaBookOpen style={{ color: '#6366f1' }} size={18} />
                </div>
            }
            <div style={{ overflow: 'hidden' }}>
              <div className="fw-semibold text-white" style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.title}
              </div>
              {c.category && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{c.category}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

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
      toast.error('Failed to load course');
      navigate('/lms');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await lmsAPI.getCourseSuggestions(id);
      if (res.success) setSuggestions(res.data?.other_courses || []);
    } catch { /* non-critical */ }
  };

  const allLessons = data?.modules?.flatMap(m => m.lessons || []) || [];

  // Fetch signed URL whenever the active lesson changes to a hosted video
  useEffect(() => {
    setSignedUrl(null);
    if (!activeLesson?.video_url?.startsWith('storage:')) return;
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
          lessons: m.lessons.map(l => l.id === lesson.id ? { ...l, completed: true } : l)
        }))
      }));
      setActiveLesson(prev => prev?.id === lesson.id ? { ...prev, completed: true } : prev);
      toast.success('Lesson marked as complete!');

      // Check 100% → certificate
      const nowCompleted = allLessons.filter(l => l.completed || l.id === lesson.id).length;
      if (nowCompleted === allLessons.length && allLessons.length > 0) {
        const certRes = await lmsAPI.generateCertificate(parseInt(id));
        if (certRes.success) { setCertGenerated(true); toast.success('Course completed! Certificate generated!'); }
      }

      // Show "Up Next" if there's a next lesson
      if (getNext(lesson)) setShowUpNext(true);
    } catch {
      toast.error('Failed to update progress');
    }
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

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#0f172a' }}>
      <div className="spinner-border" style={{ color: '#6366f1' }} />
    </div>
  );

  if (!data) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div className="d-flex align-items-center justify-content-between px-3 px-lg-4 py-3"
        style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-3">
          <Link to="/lms/courses" className="d-flex align-items-center gap-2 text-decoration-none"
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            <FaArrowLeft size={13} /> Back
          </Link>
          <div className="d-none d-md-block" style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
          <span className="fw-semibold text-white d-none d-md-block" style={{ fontSize: 15 }}>
            {data.course.title}
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-none d-sm-flex align-items-center gap-2">
            <div style={{ width: 120, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{completedLessons}/{totalLessons}</span>
          </div>
          <button onClick={() => setSidebarOpen(s => !s)}
            className="btn btn-sm rounded-3"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            {sidebarOpen ? 'Hide' : 'Show'} Lessons
          </button>
        </div>
      </div>

      {/* Certificate banner */}
      {(certGenerated || progress === 100) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-center justify-content-between px-4 py-3 flex-wrap gap-2"
          style={{ background: 'linear-gradient(135deg,#065f46,#047857)' }}>
          <div className="d-flex align-items-center gap-2 text-white">
            <FaTrophy size={18} style={{ color: '#fbbf24' }} />
            <span className="fw-semibold">Congratulations! You've completed this course.</span>
          </div>
          <Link to="/lms/certificates" className="btn btn-sm rounded-3"
            style={{ background: '#fbbf24', color: '#1a1a1a', fontWeight: 600, fontSize: 13 }}>
            View Certificate
          </Link>
        </motion.div>
      )}

      {/* Main content */}
      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>

        {/* Video + lesson info area */}
        <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, overflowY: 'auto' }}>
          {activeLesson ? (
            <>
              {/* Video player with Up Next overlay */}
              <div style={{ background: '#000', aspectRatio: '16/9', maxHeight: '60vh', position: 'relative', flexShrink: 0 }}>
                {activeLesson.video_url?.startsWith('storage:') && !signedUrl ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="spinner-border" style={{ color: '#6366f1' }} />
                  </div>
                ) : (
                  <VideoPlayer
                    url={activeLesson.video_url?.startsWith('storage:') ? signedUrl : activeLesson.video_url}
                    source={activeLesson.video_url?.startsWith('storage:') ? 'url' : undefined}
                    title={activeLesson.title}
                  />
                )}
                <AnimatePresence>

                  {showUpNext && nextLesson && (
                    <UpNextOverlay
                      nextLesson={nextLesson}
                      onGoNext={goNext}
                      onDismiss={() => setShowUpNext(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Lesson meta */}
              <div className="p-3 p-lg-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
                  <div>
                    <h5 className="fw-bold text-white mb-1">{activeLesson.title}</h5>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                      {completedLessons} of {totalLessons} lessons completed
                    </span>
                  </div>
                  <button
                    onClick={() => markComplete(activeLesson)}
                    disabled={activeLesson.completed}
                    className="btn btn-sm rounded-3 d-flex align-items-center gap-2"
                    style={{
                      background: activeLesson.completed ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      color: activeLesson.completed ? '#22c55e' : '#fff',
                      border: activeLesson.completed ? '1px solid rgba(34,197,94,0.3)' : 'none',
                      fontSize: 13
                    }}>
                    <FaCheckCircle size={13} />
                    {activeLesson.completed ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>

                {activeLesson.content && (
                  <div className="rounded-3 p-3 mt-3"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.8 }}>
                    {activeLesson.content}
                  </div>
                )}

                {/* Prev / Next */}
                <div className="d-flex gap-2 mt-3">
                  <button onClick={goPrev} disabled={allLessons.findIndex(l => l.id === activeLesson.id) === 0}
                    className="btn btn-sm rounded-3"
                    style={{ background: '#1e293b', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    ← Previous
                  </button>
                  {nextLesson && (
                    <button onClick={goNext} className="btn btn-sm rounded-3"
                      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13 }}>
                      Next →
                    </button>
                  )}
                </div>
              </div>

              {/* Other enrolled courses */}
              <SuggestionsStrip courses={suggestions} />
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center flex-grow-1 text-white">
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Select a lesson to start</p>
            </div>
          )}
        </div>

        {/* Lessons sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="d-none d-lg-flex flex-column"
            style={{ width: 300, flexShrink: 0, background: '#1e293b', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}
          >
            <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="fw-semibold text-white mb-1" style={{ fontSize: 14 }}>Course Content</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {completedLessons}/{totalLessons} lessons · {progress}% complete
              </div>
            </div>

            {(data.modules || []).map(mod => (
              <div key={mod.id}>
                <button
                  onClick={() => setExpandedMods(p => ({ ...p, [mod.id]: !p[mod.id] }))}
                  className="d-flex align-items-center justify-content-between w-100 px-3 py-2 border-0 text-start"
                  style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <span>{mod.title}</span>
                  {expandedMods[mod.id] ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                </button>

                {expandedMods[mod.id] && (mod.lessons || []).map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => { setActiveLesson(lesson); setShowUpNext(false); }}
                    className="d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 text-start"
                    style={{
                      background: activeLesson?.id === lesson.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                      borderLeft: activeLesson?.id === lesson.id ? '3px solid #6366f1' : '3px solid transparent',
                      color: activeLesson?.id === lesson.id ? '#fff' : 'rgba(255,255,255,0.55)',
                      fontSize: 13, cursor: 'pointer'
                    }}>
                    {lesson.completed
                      ? <FaCheckCircle size={13} style={{ color: '#22c55e', flexShrink: 0 }} />
                      : lesson.is_free
                        ? <FaCircle size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                        : <FaLock size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    }
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {lesson.title}
                    </span>
                    {lesson.is_free && (
                      <span style={{ fontSize: 9, color: '#22c55e', flexShrink: 0, border: '1px solid #22c55e', borderRadius: 4, padding: '1px 4px' }}>
                        FREE
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LMSCourseViewer;
