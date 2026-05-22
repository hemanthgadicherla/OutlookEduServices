import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as tus from 'tus-js-client';
import AdminSidebar from '../components/AdminSidebar';
import { courseAPI, uploadAPI, curriculumAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaBookOpen,
  FaChevronDown, FaChevronRight,
  FaLock, FaLockOpen, FaCheck,
  FaUpload, FaVideo, FaTimesCircle, FaLink,
  FaArrowUp, FaArrowDown, FaArrowLeft,
} from 'react-icons/fa';

const CATEGORIES = ['Marketing', 'Finance', 'Language', 'Technology', 'Business', 'Design', 'Other'];
const toSlug = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// ── Video Upload Modal ───────────────────────────────────────────
const VideoUploadModal = ({ lesson, onClose, onDone }) => {
  const [tab,        setTab]        = useState('upload');
  const [videoTitle, setVideoTitle] = useState(lesson?.title || '');
  const [videoDesc,  setVideoDesc]  = useState('');
  const [urlInput,   setUrlInput]   = useState('');
  const [file,       setFile]       = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [uploadPct,  setUploadPct]  = useState(0);
  const [uploadRef,  setUploadRef]  = useState(null);
  const [library,    setLibrary]    = useState([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [savingUrl,  setSavingUrl]  = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (tab === 'library') {
      setLoadingLib(true);
      curriculumAPI.listVideos().then(res => {
        if (res.success) setLibrary((res.data || []).filter(v => v.id !== lesson?.id));
        setLoadingLib(false);
      });
    }
  }, [tab, lesson?.id]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('video/')) setFile(f);
    else toast.error('Please drop a video file');
  };

  const startUpload = async () => {
    if (!file)              { toast.error('Please select a video file'); return; }
    if (!videoTitle.trim()) { toast.error('Please enter a video title'); return; }
    setUploading(true); setUploadPct(0);
    try {
      const res = await curriculumAPI.getBunnyUploadToken(lesson.id, {
        title: videoTitle.trim(), description: videoDesc.trim(),
      });
      if (!res.success) { toast.error(res.message || 'Failed to get upload credentials'); setUploading(false); return; }
      const { videoId, libraryId, signature, expires } = res.data;
      await new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint:    'https://video.bunnycdn.com/tusupload',
          retryDelays: [0, 3000, 5000, 10000],
          headers: {
            AuthorizationSignature: signature,
            AuthorizationExpire:    String(expires),
            VideoId:                videoId,
            LibraryId:              String(libraryId),
          },
          metadata: { filetype: file.type, title: videoTitle.trim(), filename: file.name },
          onError:    reject,
          onProgress: (u, t) => setUploadPct(t > 0 ? Math.round((u / t) * 100) : 0),
          onSuccess:  resolve,
        });
        setUploadRef(upload); upload.start();
      });
      toast.success('Video uploaded successfully!');
      onDone();
    } catch (err) {
      toast.error(err?.message || 'Upload failed');
    } finally { setUploading(false); setUploadPct(0); setUploadRef(null); }
  };

  const saveUrl = async () => {
    if (!urlInput.trim()) { toast.error('Please enter a video URL'); return; }
    setSavingUrl(true);
    const res = await curriculumAPI.setVideoUrl(lesson.id, urlInput.trim());
    setSavingUrl(false);
    if (res.success) { toast.success('Video link saved'); onDone(); }
    else toast.error(res.message || 'Failed to save URL');
  };

  const pickFromLibrary = async (video) => {
    const res = await curriculumAPI.setVideoUrl(lesson.id, video.video_url);
    if (res.success) { toast.success('Video linked to this lesson'); onDone(); }
    else toast.error(res.message || 'Failed to link video');
  };

  const TABS = [
    { key: 'upload',  label: 'Upload File',  icon: <FaUpload size={11} /> },
    { key: 'url',     label: 'Paste a Link', icon: <FaLink size={11} /> },
    { key: 'library', label: 'From Library', icon: <FaVideo size={11} /> },
  ];

  return (
    <>
      <div onClick={!uploading ? onClose : undefined}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1060 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '95%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
        background: '#fff', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        zIndex: 1070, padding: '24px',
      }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold mb-0" style={{ fontSize: 16 }}>Add Video</h6>
            <div className="text-muted" style={{ fontSize: 12 }}>{lesson?.title}</div>
          </div>
          <button onClick={onClose} disabled={uploading}
            className="btn btn-sm btn-light rounded-circle p-1"><FaTimes size={13} /></button>
        </div>

        <div className="d-flex gap-1 mb-4 p-1 rounded-3" style={{ background: '#f1f5f9' }}>
          {TABS.map(t => (
            <button key={t.key} type="button"
              className="btn btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              style={{
                fontSize: 12, fontWeight: tab === t.key ? 600 : 400,
                background: tab === t.key ? '#fff' : 'transparent',
                border: tab === t.key ? '1px solid #e2e8f0' : '1px solid transparent',
                borderRadius: 8,
                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
              onClick={() => setTab(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'upload' && (
          <div>
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Video Title *</label>
              <input type="text" className="form-control" value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g. Introduction to the Course" disabled={uploading} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">
                Description <span className="fw-normal text-muted">(optional)</span>
              </label>
              <textarea className="form-control" rows={2} value={videoDesc}
                onChange={e => setVideoDesc(e.target.value)}
                placeholder="What will students learn in this video?" disabled={uploading} />
            </div>
            <div
              onDragOver={e => { e.preventDefault(); if (!uploading) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={uploading ? undefined : handleDrop}
              onClick={() => { if (!file && !uploading) fileRef.current?.click(); }}
              style={{
                border: `2px dashed ${dragging ? '#6366f1' : file ? '#10b981' : '#cbd5e1'}`,
                borderRadius: 12, padding: '28px 16px', textAlign: 'center',
                cursor: (file || uploading) ? 'default' : 'pointer',
                background: dragging ? '#f0f0ff' : file ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s',
              }}>
              {file ? (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🎬</div>
                  <div className="fw-semibold" style={{ fontSize: 14 }}>{file.name}</div>
                  <div className="text-muted small mb-2">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  {!uploading && (
                    <button type="button" className="btn btn-sm btn-outline-secondary"
                      onClick={e => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}>
                      Choose a different file
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                  <div className="fw-semibold" style={{ fontSize: 14 }}>Drag & drop your video here</div>
                  <div className="text-muted small mb-1">or click to browse your computer</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>MP4, MOV, AVI, MKV · Any size</div>
                </div>
              )}
              <input type="file" ref={fileRef} accept="video/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </div>
            {uploading && (
              <div className="mt-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span style={{ color: '#6366f1' }}>Uploading to Bunny Stream...</span>
                  <span>{uploadPct}%</span>
                </div>
                <div style={{ height: 8, background: '#e5e7eb', borderRadius: 99 }}>
                  <div style={{
                    height: '100%', width: `${uploadPct}%`,
                    background: 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                    borderRadius: 99, transition: 'width 0.3s',
                  }} />
                </div>
                <div className="text-muted mt-1" style={{ fontSize: 11 }}>Do not close this window while uploading.</div>
              </div>
            )}
            <div className="d-flex gap-2 mt-3">
              {uploading ? (
                <button type="button" className="btn btn-danger"
                  onClick={() => { uploadRef?.abort(); setUploading(false); setUploadPct(0); setUploadRef(null); }}>
                  <FaTimes size={11} className="me-1" /> Cancel Upload
                </button>
              ) : (
                <button type="button" className="btn btn-primary d-flex align-items-center gap-1"
                  onClick={startUpload} disabled={!file}>
                  <FaUpload size={11} /> Upload Video
                </button>
              )}
              {!uploading && (
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              )}
            </div>
          </div>
        )}

        {tab === 'url' && (
          <div>
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Video Title *</label>
              <input type="text" className="form-control" value={videoTitle}
                onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g. Introduction to the Course" />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1">Video URL *</label>
              <input type="url" className="form-control" value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or direct video link"
                onKeyDown={e => e.key === 'Enter' && saveUrl()} />
              <div className="text-muted mt-1" style={{ fontSize: 11 }}>
                Supports YouTube, Vimeo, or any direct .mp4 / .m3u8 link
              </div>
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary d-flex align-items-center gap-1"
                onClick={saveUrl} disabled={savingUrl || !urlInput.trim()}>
                {savingUrl ? <span className="spinner-border spinner-border-sm" /> : <><FaLink size={11} /> Save Link</>}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {tab === 'library' && (
          <div>
            <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
              Pick a video already uploaded in another lesson. It will be linked instantly — no re-upload needed.
            </p>
            {loadingLib ? (
              <div className="text-center py-4">
                <span className="spinner-border spinner-border-sm me-2" />
                <span className="text-muted small">Loading library...</span>
              </div>
            ) : library.length === 0 ? (
              <div className="text-center py-4 rounded-3" style={{ border: '1px dashed #cbd5e1' }}>
                <FaVideo size={24} className="text-muted mb-2" style={{ display: 'block', margin: '0 auto 8px' }} />
                <div className="text-muted small">No other videos uploaded yet.</div>
              </div>
            ) : (
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {library.map(v => {
                  const courseName = v.course_modules?.courses?.title || '—';
                  const modName    = v.course_modules?.title || '';
                  const isBunny    = v.video_url?.startsWith('bunny:');
                  return (
                    <div key={v.id} className="d-flex align-items-center gap-3 p-2 rounded-2 mb-2"
                      style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                        style={{ width: 42, height: 42, background: isBunny ? '#d1fae5' : '#fef9c3' }}>
                        <FaVideo size={14} style={{ color: isBunny ? '#059669' : '#92400e' }} />
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-semibold text-truncate" style={{ fontSize: 13 }}>{v.title}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: 11 }}>
                          {courseName}{modName ? ` › ${modName}` : ''}
                        </div>
                        <div style={{ fontSize: 10, color: isBunny ? '#059669' : '#b45309', fontWeight: 600 }}>
                          {isBunny ? 'Bunny Stream (CDN)' : 'Hosted URL'}
                        </div>
                      </div>
                      <button type="button"
                        className="btn btn-sm btn-outline-primary flex-shrink-0"
                        style={{ fontSize: 11, whiteSpace: 'nowrap' }}
                        onClick={() => pickFromLibrary(v)}>
                        Use this
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ── Lesson card ──────────────────────────────────────────────────
const LessonRow = ({ lesson, moduleId, onRefresh, isNew, onCancelNew, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const [title,          setTitle]          = useState(lesson?.title || '');
  const [locked,         setLocked]         = useState(lesson ? !lesson.is_free : true);
  const [saving,         setSaving]         = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const hasBunny   = lesson?.video_url?.startsWith('bunny:');
  const hasStorage = lesson?.video_url?.startsWith('storage:');
  const hasUrl     = lesson?.video_url && !hasBunny && !hasStorage;
  const hasVideo   = hasBunny || hasStorage || hasUrl;

  const save = async () => {
    if (!title.trim()) { toast.error('Lesson title is required'); return; }
    setSaving(true);
    const payload = { title: title.trim(), is_free: !locked, content: lesson?.content || null };
    const res = lesson?.id
      ? await curriculumAPI.updateLesson(lesson.id, payload)
      : await curriculumAPI.createLesson(moduleId, payload);
    setSaving(false);
    if (res.success) {
      toast.success(lesson?.id ? 'Lesson updated' : 'Lesson added');
      if (isNew && onCancelNew) onCancelNew();
      onRefresh();
    } else toast.error(res.message || 'Failed to save lesson');
  };

  const del = async () => {
    if (!lesson?.id || !window.confirm('Delete this lesson?')) return;
    const res = await curriculumAPI.deleteLesson(lesson.id);
    if (res.success) { toast.success('Lesson deleted'); onRefresh(); }
    else toast.error(res.message);
  };

  const toggleLock = async () => {
    const next = !locked;
    setLocked(next);
    if (lesson?.id) { await curriculumAPI.updateLesson(lesson.id, { is_free: !next }); onRefresh(); }
  };

  const removeVideo = async () => {
    if (!lesson?.id || !window.confirm('Remove this video from the lesson?')) return;
    const res = await curriculumAPI.deleteVideo(lesson.id);
    if (res.success) { toast.success('Video removed'); onRefresh(); }
    else toast.error(res.message);
  };

  return (
    <div className="mb-2">
      <div className="rounded-3" style={{
        border: `1px solid ${isNew ? '#bfdbfe' : '#e2e8f0'}`,
        background: isNew ? '#f8fbff' : '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Row 1 — reorder + title + save + delete */}
        <div className="d-flex align-items-center gap-2 px-3 pt-3 pb-2">
          {!isNew && (
            <div className="d-flex flex-column flex-shrink-0" style={{ gap: 2 }}>
              <button type="button" onClick={onMoveUp} disabled={isFirst}
                className="btn p-0 border-0 text-muted" style={{ lineHeight: 1 }}>
                <FaArrowUp size={10} />
              </button>
              <button type="button" onClick={onMoveDown} disabled={isLast}
                className="btn p-0 border-0 text-muted" style={{ lineHeight: 1 }}>
                <FaArrowDown size={10} />
              </button>
            </div>
          )}
          <input type="text" className="form-control flex-grow-1"
            placeholder="Lesson name" value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            style={{ fontSize: 14, fontWeight: 500 }} />
          <button type="button" className="btn btn-primary d-flex align-items-center gap-1 flex-shrink-0"
            onClick={save} disabled={saving} style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : <><FaCheck size={11} /> Save</>}
          </button>
          {isNew
            ? <button type="button" className="btn btn-outline-secondary flex-shrink-0"
                onClick={onCancelNew} style={{ fontSize: 13 }}>Cancel</button>
            : <button type="button" className="btn btn-outline-danger flex-shrink-0"
                onClick={del} style={{ padding: '6px 10px' }}>
                <FaTrash size={12} />
              </button>
          }
        </div>

        {/* Row 2 — video + lock (saved lessons only) */}
        {!isNew && (
          <div className="d-flex align-items-center gap-2 px-3 pb-3 flex-wrap"
            style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 2 }}>
            <span className="text-muted flex-shrink-0" style={{ fontSize: 12 }}>Video:</span>

            {hasBunny && (
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{ background: '#d1fae5', border: '1px solid #6ee7b7', fontSize: 12 }}>
                <FaVideo size={11} style={{ color: '#059669' }} />
                <span style={{ color: '#065f46', fontWeight: 600 }}>Uploaded to CDN</span>
                <button type="button" onClick={removeVideo}
                  style={{ background: 'none', border: 'none', color: '#dc2626', padding: 0, cursor: 'pointer', lineHeight: 1 }}>
                  <FaTimesCircle size={12} />
                </button>
              </div>
            )}
            {hasStorage && (
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{ background: '#fef9c3', border: '1px solid #fde68a', fontSize: 12 }}>
                <FaVideo size={11} style={{ color: '#92400e' }} />
                <span style={{ color: '#92400e', fontWeight: 600 }}>Hosted</span>
                <button type="button" onClick={removeVideo}
                  style={{ background: 'none', border: 'none', color: '#dc2626', padding: 0, cursor: 'pointer', lineHeight: 1 }}>
                  <FaTimesCircle size={12} />
                </button>
              </div>
            )}
            {hasUrl && (
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{ background: '#ede9fe', border: '1px solid #c4b5fd', fontSize: 12 }}>
                <FaLink size={10} style={{ color: '#7c3aed' }} />
                <span style={{ color: '#5b21b6', fontWeight: 600 }}>Link added</span>
                <button type="button" onClick={removeVideo}
                  style={{ background: 'none', border: 'none', color: '#dc2626', padding: 0, cursor: 'pointer', lineHeight: 1 }}>
                  <FaTimesCircle size={12} />
                </button>
              </div>
            )}
            {!hasVideo && (
              <button type="button"
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={() => setShowVideoModal(true)}
                style={{ fontSize: 13, borderRadius: 20, padding: '4px 14px' }}>
                <FaUpload size={11} /> Add Video
              </button>
            )}

            <div className="ms-auto flex-shrink-0">
              <button type="button"
                className={`btn d-flex align-items-center gap-2 ${locked ? 'btn-outline-danger' : 'btn-outline-success'}`}
                style={{ fontSize: 13, borderRadius: 20, padding: '4px 14px', whiteSpace: 'nowrap' }}
                onClick={toggleLock}>
                {locked ? <><FaLock size={11} /> Locked</> : <><FaLockOpen size={11} /> Free preview</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {showVideoModal && lesson?.id && (
        <VideoUploadModal lesson={lesson}
          onClose={() => setShowVideoModal(false)}
          onDone={() => { setShowVideoModal(false); onRefresh(); }} />
      )}
    </div>
  );
};

// ── Bulk Add Lessons ─────────────────────────────────────────────
const BulkAddLessons = ({ moduleId, onDone }) => {
  const [text,    setText]    = useState('');
  const [saving,  setSaving]  = useState(false);
  const [current, setCurrent] = useState(0);
  const names = text.split('\n').map(l => l.trim()).filter(Boolean);

  const handleAdd = async () => {
    if (names.length === 0) { toast.error('Enter at least one lesson name'); return; }
    setSaving(true);
    let added = 0;
    for (let i = 0; i < names.length; i++) {
      setCurrent(i + 1);
      const res = await curriculumAPI.createLesson(moduleId, { title: names[i], is_free: false, content: null });
      if (res.success) added++;
    }
    setSaving(false);
    toast.success(`${added} lesson${added !== 1 ? 's' : ''} added`);
    onDone();
  };

  return (
    <div className="mt-2 p-3 rounded-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
      <div className="d-flex align-items-center gap-2 mb-1">
        <span className="fw-semibold small" style={{ color: '#1d4ed8' }}>Bulk Add Lessons</span>
        <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 10 }}>{names.length} lessons</span>
      </div>
      <p className="text-muted mb-2" style={{ fontSize: 12 }}>One lesson name per line. Videos can be added after saving.</p>
      <textarea autoFocus className="form-control form-control-sm mb-2" rows={6}
        placeholder={"Lesson 1 - Introduction\nLesson 2 - Getting Started\n..."}
        value={text} onChange={e => setText(e.target.value)}
        style={{ fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }} />
      {saving && (
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 99, marginBottom: 8 }}>
          <div style={{
            height: '100%', width: `${Math.round((current / names.length) * 100)}%`,
            background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 99, transition: 'width 0.2s',
          }} />
        </div>
      )}
      <div className="d-flex gap-2 align-items-center">
        <button type="button" className="btn btn-primary btn-sm d-flex align-items-center gap-1"
          onClick={handleAdd} disabled={saving || names.length === 0}>
          {saving
            ? <><span className="spinner-border spinner-border-sm" /> Adding {current}/{names.length}...</>
            : <><FaPlus size={10} /> Add {names.length || 0} Lesson{names.length !== 1 ? 's' : ''}</>}
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary"
          onClick={() => onDone(true)} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
};

// ── Chapter Block ────────────────────────────────────────────────
const ChapterBlock = ({ module, courseId, onRefresh }) => {
  const [expanded,     setExpanded]     = useState(true);
  const [addingLesson, setAddingLesson] = useState(false);
  const [bulkAdding,   setBulkAdding]   = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal,     setTitleVal]     = useState(module.title);

  const saveTitle = async () => {
    if (!titleVal.trim()) return;
    await curriculumAPI.updateModule(module.id, { title: titleVal.trim() });
    setEditingTitle(false); onRefresh();
  };

  const deleteChapter = async () => {
    if (!window.confirm(`Delete chapter "${module.title}" and all its lessons?`)) return;
    const res = await curriculumAPI.deleteModule(module.id);
    if (res.success) { toast.success('Chapter deleted'); onRefresh(); }
    else toast.error(res.message);
  };

  const lessons = module.course_lessons || [];

  const moveLesson = async (idx, dir) => {
    const next = [...lessons];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    await curriculumAPI.reorderLessons(next.map((l, i) => ({ id: l.id, position: i })));
    onRefresh();
  };

  return (
    <div className="rounded-3 mb-3" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
      <div className="d-flex align-items-center gap-2 p-3"
        style={{ borderBottom: expanded ? '1px solid #f1f5f9' : 'none', background: '#f8fafc', borderRadius: expanded ? '12px 12px 0 0' : 12 }}>
        <button type="button" className="btn btn-sm btn-light p-1 flex-shrink-0"
          onClick={() => setExpanded(e => !e)}>
          {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </button>

        {editingTitle ? (
          <input autoFocus className="form-control form-control-sm flex-grow-1"
            value={titleVal} onChange={e => setTitleVal(e.target.value)}
            onBlur={saveTitle} onKeyDown={e => e.key === 'Enter' && saveTitle()} />
        ) : (
          <span className="fw-semibold flex-grow-1" style={{ fontSize: 15 }}>{module.title}</span>
        )}

        <span className="text-muted small flex-shrink-0">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''}</span>

        <button type="button" className="btn btn-sm btn-light p-1 flex-shrink-0"
          onClick={() => setEditingTitle(e => !e)} title="Rename chapter">
          <FaEdit size={12} style={{ color: '#0d6efd' }} />
        </button>
        <button type="button" className="btn btn-sm btn-light p-1 flex-shrink-0"
          onClick={deleteChapter} title="Delete chapter">
          <FaTrash size={12} style={{ color: '#dc3545' }} />
        </button>
      </div>

      {expanded && (
        <div className="p-3">
          {lessons.map((lesson, idx) => (
            <LessonRow key={lesson.id} lesson={lesson} moduleId={module.id} onRefresh={onRefresh}
              onMoveUp={() => moveLesson(idx, -1)} onMoveDown={() => moveLesson(idx, 1)}
              isFirst={idx === 0} isLast={idx === lessons.length - 1} />
          ))}

          {addingLesson && (
            <LessonRow isNew moduleId={module.id} onRefresh={onRefresh}
              onCancelNew={() => setAddingLesson(false)} />
          )}

          {bulkAdding && (
            <BulkAddLessons moduleId={module.id} onDone={(cancelled) => {
              setBulkAdding(false);
              if (!cancelled) onRefresh();
            }} />
          )}

          {!addingLesson && !bulkAdding && (
            <div className="d-flex gap-2 mt-1 flex-wrap">
              <button type="button"
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={() => setAddingLesson(true)}>
                <FaPlus size={10} /> Add Lesson
              </button>
              <button type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                onClick={() => setBulkAdding(true)}
                title="Add multiple lessons at once">
                <FaUpload size={10} /> Bulk Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: '', slug: '', description: '', full_description: '',
  price: '', image: '', imageFile: null, preview: '',
  category: '', is_published: true,
};

const AdminCourseEditor = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [modules,    setModules]    = useState([]);
  const [saving,     setSaving]     = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [addingChap, setAddingChap] = useState(false);
  const [newChap,    setNewChap]    = useState('');

  const toForm = (c) => ({
    id: c.id, title: c.title || '', slug: c.slug || '',
    description: c.description || '', full_description: c.full_description || '',
    price: c.price ?? '', image: c.image || '', imageFile: null,
    preview: c.image || '', category: c.category || '', is_published: !!c.is_published,
  });

  const fetchModules = useCallback(async () => {
    const res = await curriculumAPI.getModules(id);
    if (res.success) setModules(res.data || []);
  }, [id]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Use passed state if available (coming from the courses list)
      if (location.state?.course) {
        setForm(toForm(location.state.course));
      } else {
        // Direct URL access — fetch all courses and find this one
        const res = await courseAPI.getCourses();
        if (res.success) {
          const found = (res.data || []).find(c => String(c.id) === String(id));
          if (found) setForm(toForm(found));
          else { toast.error('Course not found'); navigate('/admin/courses'); return; }
        }
      }
      await fetchModules();
      setLoading(false);
    };
    init();
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('imageFile', file);
    set('preview', URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { toast.error('Course title is required'); return; }
    setSaving(true);
    try {
      let imageUrl = form.image || '';
      if (form.imageFile) {
        const up = await uploadAPI.uploadImage(form.imageFile);
        if (up.success) imageUrl = up.imageUrl;
        else { toast.error('Image upload failed'); setSaving(false); return; }
      }
      const payload = {
        title: form.title, slug: form.slug,
        description: form.description, full_description: form.full_description,
        price: form.price, image: imageUrl,
        category: form.category, is_published: form.is_published,
      };
      const res = await courseAPI.updateCourse(id, payload);
      if (res.success) {
        toast.success('Course updated');
        set('imageFile', null);
        set('image', imageUrl);
      } else toast.error(res.message || 'Failed to update course');
    } catch (err) {
      toast.error('Something went wrong');
    } finally { setSaving(false); }
  };

  const addChapter = async () => {
    if (!newChap.trim()) return;
    const res = await curriculumAPI.createModule(id, { title: newChap.trim() });
    if (res.success) {
      toast.success('Chapter added');
      setNewChap(''); setAddingChap(false);
      fetchModules();
    } else toast.error(res.message);
  };

  if (loading) return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ background: '#f8f9fa' }}>
        <div className="spinner-border text-primary" />
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar />

      {/* Right panel — header locked, content scrolls */}
      <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh', overflow: 'hidden' }}>

        {/* Header — never moves */}
        <div className="d-flex align-items-center justify-content-between px-4"
          style={{
            height: 60, flexShrink: 0,
            background: '#fff', borderBottom: '1px solid #e9ecef',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-flex align-items-center gap-2"
              onClick={() => navigate('/admin/courses')}
              style={{ fontSize: 14 }}>
              <FaArrowLeft size={13} /> Back
            </button>
            <div>
              <h5 className="fw-bold mb-0 text-truncate" style={{ fontSize: 17, maxWidth: 340 }}>
                {form.title || 'Untitled Course'}
              </h5>
              <div className="text-muted" style={{ fontSize: 11 }}>/admin/courses/{id}</div>
            </div>
          </div>
          <button className="btn btn-primary px-4 d-flex align-items-center gap-2"
            onClick={handleSave} disabled={saving}>
            {saving
              ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
              : <><FaCheck size={12} /> Update Course</>}
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa' }}>
        <div className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Section 1 — Course Details */}
          <div className="card border-0 shadow-sm mb-4 p-4">
            <h6 className="fw-bold text-uppercase text-muted mb-4"
              style={{ fontSize: 11, letterSpacing: 1 }}>1. Course Details</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Course Title *</label>
                <input type="text" className="form-control"
                  value={form.title}
                  onChange={e => { set('title', e.target.value); set('slug', toSlug(e.target.value)); }} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">URL Slug *</label>
                <input type="text" className="form-control"
                  value={form.slug} onChange={e => set('slug', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Short Description *</label>
                <textarea className="form-control" rows={2}
                  placeholder="Brief summary shown on course cards"
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Full Description</label>
                <textarea className="form-control" rows={3}
                  placeholder="Detailed course content..."
                  value={form.full_description} onChange={e => set('full_description', e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Price (₹) *</label>
                <input type="number" className="form-control"
                  value={form.price} onChange={e => set('price', e.target.value)} min="0" />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Category *</label>
                <select className="form-select" value={form.category}
                  onChange={e => set('category', e.target.value)}>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Status</label>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" role="switch"
                      id="pub_toggle" checked={form.is_published}
                      onChange={e => set('is_published', e.target.checked)}
                      style={{ width: 40, height: 22, cursor: 'pointer' }} />
                  </div>
                  <label htmlFor="pub_toggle" className="form-check-label fw-semibold small" style={{ cursor: 'pointer' }}>
                    {form.is_published ? 'Published' : 'Draft'}
                  </label>
                </div>
                <div className="text-muted" style={{ fontSize: 11 }}>
                  {form.is_published ? 'Visible to students' : 'Shown as Coming Soon'}
                </div>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Thumbnail Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
                {form.preview && (
                  <img src={form.preview} alt="Preview" className="mt-2 rounded"
                    loading="lazy"
                    style={{ height: 100, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </div>
            </div>
          </div>

          {/* Section 2 — Curriculum */}
          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold text-uppercase text-muted mb-0"
                style={{ fontSize: 11, letterSpacing: 1 }}>2. Curriculum (Chapters &amp; Lessons)</h6>
              <button type="button" className="btn btn-dark btn-sm d-flex align-items-center gap-1"
                onClick={() => setAddingChap(true)}>
                <FaPlus size={11} /> Add Chapter
              </button>
            </div>

            {modules.length === 0 && !addingChap && (
              <div className="text-center py-4 rounded-3" style={{ border: '1px dashed #cbd5e1' }}>
                <FaBookOpen size={28} className="text-muted mb-2" />
                <div className="text-muted">No chapters yet. Click "+ Add Chapter" to start building your curriculum.</div>
              </div>
            )}

            {modules.map(mod => (
              <ChapterBlock key={mod.id} module={mod} courseId={id} onRefresh={fetchModules} />
            ))}

            {addingChap && (
              <div className="d-flex gap-2 mt-2">
                <input autoFocus type="text" className="form-control"
                  placeholder="Chapter title..." value={newChap}
                  onChange={e => setNewChap(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChapter())} />
                <button type="button" className="btn btn-primary" onClick={addChapter}>Add</button>
                <button type="button" className="btn btn-outline-secondary"
                  onClick={() => { setAddingChap(false); setNewChap(''); }}>Cancel</button>
              </div>
            )}
          </div>

        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseEditor;
