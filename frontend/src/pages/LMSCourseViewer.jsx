import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCheckCircle, FaCircle, FaChevronDown, FaChevronRight,
  FaArrowLeft, FaPlay, FaFilePdf, FaLock, FaTrophy
} from 'react-icons/fa';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';
import { toast } from 'react-toastify';

// ── Smart video player — handles YouTube, Bunny Stream, direct URL ──
const VideoPlayer = ({ url, source, title }) => {
  if (!url) return null;

  // Resolve embed URL based on source
  const getEmbedUrl = () => {
    const s = source || detectSource(url);
    if (s === 'youtube') {
      // Handle all YouTube URL formats
      const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const id = match?.[1];
      return id
        ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`
        : url;
    }
    if (s === 'bunny') {
      // Bunny Stream iframe URLs are used directly
      return url;
    }
    // Direct URL — use native video element
    return null;
  };

  const detectSource = (u) => {
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('mediadelivery.net') || u.includes('bunnycdn')) return 'bunny';
    return 'url';
  };

  const embedUrl = getEmbedUrl();
  const resolvedSource = source || detectSource(url);

  if (resolvedSource === 'url' || !embedUrl) {
    return (
      <video
        src={url}
        controls
        style={{ width: '100%', height: '100%', background: '#000' }}
        title={title}
      >
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

const LMSCourseViewer = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const user     = getUser();

  const [data,           setData]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [activeLesson,   setActiveLesson]   = useState(null);
  const [expandedMods,   setExpandedMods]   = useState({});
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [certGenerated,  setCertGenerated]  = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await lmsAPI.getCourseContent(id);
      if (!res.success) { toast.error(res.message || 'Access denied'); navigate('/lms'); return; }
      setData(res.data);
      // Auto-expand first module, auto-select first incomplete lesson
      if (res.data.modules?.length > 0) {
        const firstMod = res.data.modules[0];
        setExpandedMods({ [firstMod.id]: true });
        const firstIncomplete = res.data.modules
          .flatMap(m => m.lessons || [])
          .find(l => !l.completed);
        const firstLesson = firstIncomplete || res.data.modules[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      }
    } catch (err) {
      toast.error('Failed to load course');
      navigate('/lms');
    } finally {
      setLoading(false);
    }
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

      // Check if all lessons done → generate certificate
      const allLessons = data?.modules?.flatMap(m => m.lessons || []) || [];
      const nowCompleted = allLessons.filter(l => l.completed || l.id === lesson.id).length;
      if (nowCompleted === allLessons.length && allLessons.length > 0) {
        const certRes = await lmsAPI.generateCertificate(parseInt(id));
        if (certRes.success) {
          setCertGenerated(true);
          toast.success('🎉 Course completed! Certificate generated!');
        }
      }
    } catch {
      toast.error('Failed to update progress');
    }
  }, [data, id]);

  const goNext = () => {
    const all = data?.modules?.flatMap(m => m.lessons || []) || [];
    const idx = all.findIndex(l => l.id === activeLesson?.id);
    if (idx < all.length - 1) setActiveLesson(all[idx + 1]);
  };

  const goPrev = () => {
    const all = data?.modules?.flatMap(m => m.lessons || []) || [];
    const idx = all.findIndex(l => l.id === activeLesson?.id);
    if (idx > 0) setActiveLesson(all[idx - 1]);
  };

  const totalLessons     = data?.modules?.flatMap(m => m.lessons || []).length || 0;
  const completedLessons = data?.modules?.flatMap(m => m.lessons || []).filter(l => l.completed).length || 0;
  const progress         = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{progress}%</span>
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

        {/* Video / content area */}
        <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
          {activeLesson ? (
            <>
              {/* Video player */}
              <div style={{ background: '#000', aspectRatio: '16/9', maxHeight: '60vh', position: 'relative' }}>
                {activeLesson.video_url ? (
                  <VideoPlayer url={activeLesson.video_url} source={activeLesson.video_source} title={activeLesson.title} />
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white">
                    <FaPlay size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>No video for this lesson</p>
                  </div>
                )}
              </div>

              {/* Lesson info */}
              <div className="p-3 p-lg-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
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
                  <div className="rounded-3 p-3 mb-3" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.8 }}>
                    {activeLesson.content}
                  </div>
                )}

                {/* Nav buttons */}
                <div className="d-flex gap-2 mt-3">
                  <button onClick={goPrev} className="btn btn-sm rounded-3"
                    style={{ background: '#1e293b', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                    ← Previous
                  </button>
                  <button onClick={goNext} className="btn btn-sm rounded-3"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13 }}>
                    Next →
                  </button>
                </div>
              </div>
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
            <div className="p-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.06) !important' }}>
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

                {expandedMods[mod.id] && (mod.lessons || []).map(lesson => {
                  const isLocked = !lesson.is_free && !lesson.completed && activeLesson?.id !== lesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (!lesson.is_free && lesson.video_url) {
                          // Paid users can access all lessons — is_free just marks free preview
                          setActiveLesson(lesson);
                        } else {
                          setActiveLesson(lesson);
                        }
                      }}
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
                      {lesson.duration && (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                          {lesson.duration}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LMSCourseViewer;
