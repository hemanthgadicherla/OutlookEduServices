import { useEffect, useState, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { courseAPI, uploadAPI, curriculumAPI } from '../services/api';
import { toast } from 'react-toastify';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaBookOpen,
  FaChevronDown, FaChevronRight, FaYoutube, FaVideo,
  FaLock, FaLockOpen, FaCheck, FaGripVertical
} from 'react-icons/fa';

const EMPTY_COURSE = {
  title: '', slug: '', description: '', full_description: '',
  price: '', image: '', imageFile: null, preview: '',
  category: '', is_published: true
};

const CATEGORIES = ['Marketing', 'Finance', 'Language', 'Technology', 'Business', 'Design', 'Other'];

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const VIDEO_PLACEHOLDER = {
  youtube: 'YouTube URL  e.g. https://youtube.com/watch?v=...',
  bunny:   'Bunny Stream embed URL  e.g. https://iframe.mediadelivery.net/embed/...',
};

// ── Inline lesson row — add / edit in one line ───────────────────
const LessonRow = ({ lesson, moduleId, onRefresh, isNew, onCancelNew }) => {
  const [title,  setTitle]  = useState(lesson?.title        || '');
  const [source, setSource] = useState(lesson?.video_source || 'youtube');
  const [url,    setUrl]    = useState(lesson?.video_url    || '');
  const [locked, setLocked] = useState(lesson ? !lesson.is_free : true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) { toast.error('Lesson title is required'); return; }
    setSaving(true);
    const payload = {
      title: title.trim(),
      video_source: source,
      video_url: url.trim() || null,
      is_free: !locked,
      duration: lesson?.duration || null,
      content:  lesson?.content  || null,
    };
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
    if (!lesson?.id) return;
    if (!window.confirm('Delete this lesson?')) return;
    const res = await curriculumAPI.deleteLesson(lesson.id);
    if (res.success) { toast.success('Lesson deleted'); onRefresh(); }
    else toast.error(res.message);
  };

  const toggleLock = async () => {
    const next = !locked;
    setLocked(next);
    if (lesson?.id) {
      await curriculumAPI.updateLesson(lesson.id, { is_free: !next });
      onRefresh();
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 py-2 px-2 rounded-2 mb-1"
      style={{ background: isNew ? '#f0f7ff' : '#f8fafc', border: `1px solid ${isNew ? '#bfdbfe' : '#e9ecef'}` }}>

      {/* Drag handle */}
      {!isNew && <FaGripVertical className="text-muted flex-shrink-0" style={{ cursor: 'grab', fontSize: 11 }} />}

      {/* Lesson title */}
      <input
        type="text" className="form-control form-control-sm"
        style={{ minWidth: 120, maxWidth: 200 }}
        placeholder="Lesson name"
        value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && save()}
      />

      {/* Source dropdown */}
      <select className="form-select form-select-sm flex-shrink-0" style={{ width: 140 }}
        value={source} onChange={e => setSource(e.target.value)}>
        <option value="youtube">🎬 YouTube</option>
        <option value="bunny">🐰 Bunny Stream</option>
      </select>

      {/* URL input */}
      <input
        type="text" className="form-control form-control-sm flex-grow-1"
        placeholder={VIDEO_PLACEHOLDER[source] || 'Video URL'}
        value={url} onChange={e => setUrl(e.target.value)}
      />

      {/* Lock / Unlock */}
      <button type="button"
        className={`btn btn-sm flex-shrink-0 d-flex align-items-center gap-1 ${locked ? 'btn-danger' : 'btn-success'}`}
        style={{ fontSize: 12, whiteSpace: 'nowrap' }}
        onClick={toggleLock}
        title={locked ? 'Locked — click to unlock (free preview)' : 'Unlocked — click to lock'}>
        {locked ? <><FaLock size={11} /> Locked</> : <><FaLockOpen size={11} /> Free</>}
      </button>

      {/* Save */}
      <button type="button"
        className="btn btn-primary btn-sm flex-shrink-0 d-flex align-items-center gap-1"
        onClick={save} disabled={saving} style={{ fontSize: 12 }}>
        {saving
          ? <span className="spinner-border spinner-border-sm" />
          : <><FaCheck size={11} /> Save</>}
      </button>

      {/* Delete / Cancel */}
      {isNew
        ? <button type="button" className="btn btn-sm btn-outline-secondary flex-shrink-0"
            onClick={onCancelNew}><FaTimes size={11} /></button>
        : <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0"
            onClick={del}><FaTrash size={11} /></button>
      }
    </div>
  );
};

// ── Chapter block ────────────────────────────────────────────────
const ChapterBlock = ({ module, courseId, onRefresh }) => {
  const [expanded,     setExpanded]     = useState(true);
  const [addingLesson, setAddingLesson] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal,     setTitleVal]     = useState(module.title);

  const saveTitle = async () => {
    if (!titleVal.trim()) return;
    await curriculumAPI.updateModule(module.id, { title: titleVal.trim() });
    setEditingTitle(false);
    onRefresh();
  };

  const deleteChapter = async () => {
    if (!window.confirm(`Delete chapter "${module.title}" and all its lessons?`)) return;
    const res = await curriculumAPI.deleteModule(module.id);
    if (res.success) { toast.success('Chapter deleted'); onRefresh(); }
    else toast.error(res.message);
  };

  const lessons = module.course_lessons || [];

  return (
    <div className="rounded-3 mb-3" style={{ border: '1px solid #e2e8f0', background: '#fff' }}>
      {/* Chapter header */}
      <div className="d-flex align-items-center gap-2 p-3"
        style={{ borderBottom: expanded ? '1px solid #f1f5f9' : 'none', background: '#f8fafc', borderRadius: expanded ? '12px 12px 0 0' : 12 }}>
        <FaGripVertical className="text-muted" style={{ cursor: 'grab', flexShrink: 0 }} />
        <button type="button" className="btn btn-sm btn-light p-1 flex-shrink-0"
          onClick={() => setExpanded(e => !e)}>
          {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
        </button>

        {editingTitle ? (
          <input autoFocus className="form-control form-control-sm flex-grow-1"
            value={titleVal} onChange={e => setTitleVal(e.target.value)}
            onBlur={saveTitle} onKeyDown={e => e.key === 'Enter' && saveTitle()} />
        ) : (
          <span className="fw-semibold flex-grow-1" style={{ fontSize: 14 }}>{module.title}</span>
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

      {/* Lessons */}
      {expanded && (
        <div className="p-3">
          {/* Existing lessons */}
          {lessons.map(lesson => (
            <LessonRow key={lesson.id} lesson={lesson} moduleId={module.id} onRefresh={onRefresh} />
          ))}

          {/* New lesson row */}
          {addingLesson && (
            <LessonRow isNew moduleId={module.id} onRefresh={onRefresh}
              onCancelNew={() => setAddingLesson(false)} />
          )}

          {/* Add lesson button */}
          {!addingLesson && (
            <button type="button"
              className="btn btn-sm btn-outline-primary mt-1 d-flex align-items-center gap-1"
              onClick={() => setAddingLesson(true)}>
              <FaPlus size={10} /> Add Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ── Course Modal ─────────────────────────────────────────────────
const CourseModal = ({ open, onClose, onSave, initial, loading }) => {
  const [form,    setForm]    = useState(EMPTY_COURSE);
  const [modules, setModules] = useState([]);
  const [newChap, setNewChap] = useState('');
  const [addingChap, setAddingChap] = useState(false);

  const fetchModules = useCallback(async (id) => {
    if (!id) return;
    const res = await curriculumAPI.getModules(id);
    if (res.success) setModules(res.data || []);
  }, []);

  useEffect(() => {
    if (open) {
      setForm(initial || EMPTY_COURSE);
      setModules([]);
      if (initial?.id) fetchModules(initial.id);
    }
  }, [open, initial, fetchModules]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (e) => {
    const t = e.target.value;
    set('title', t);
    if (!initial?.id) set('slug', toSlug(t));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('imageFile', file);
    set('preview', URL.createObjectURL(file));
  };

  const addChapter = async () => {
    if (!newChap.trim()) return;
    if (!initial?.id) { toast.info('Save the course first, then add chapters'); return; }
    const res = await curriculumAPI.createModule(initial.id, { title: newChap.trim() });
    if (res.success) {
      toast.success('Chapter added');
      setNewChap(''); setAddingChap(false);
      fetchModules(initial.id);
    } else toast.error(res.message);
  };

  const isEdit = !!initial?.id;

  return (
    <>
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '95%', maxWidth: 760,
        maxHeight: '92vh', overflowY: 'auto',
        background: '#fff', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        zIndex: 1050, padding: '28px 32px'
      }}>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaBookOpen style={{ color: '#0d6efd' }} />
            <h5 className="fw-bold mb-0">{isEdit ? 'Edit Course' : 'Create New Course'}</h5>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-light rounded-circle p-1"><FaTimes /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          {/* Section 1 — Course Details */}
          <div className="p-3 rounded-3 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <div className="fw-semibold text-uppercase small text-muted mb-3" style={{ letterSpacing: 1 }}>
              1. Course Details
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Course Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Digital Marketing Mastery"
                  value={form.title} onChange={handleTitleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">URL Slug *</label>
                <input type="text" className="form-control" placeholder="e.g. digital-marketing-mastery"
                  value={form.slug} onChange={e => set('slug', e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Short Description *</label>
                <textarea className="form-control" rows="2"
                  placeholder="Brief summary shown on course cards"
                  value={form.description} onChange={e => set('description', e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Full Description</label>
                <textarea className="form-control" rows="3"
                  placeholder="Detailed course content..."
                  value={form.full_description} onChange={e => set('full_description', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Price (₹) *</label>
                <input type="number" className="form-control" placeholder="e.g. 25000"
                  value={form.price} onChange={e => set('price', e.target.value)} required min="0" />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Category *</label>
                <select className="form-select" value={form.category}
                  onChange={e => set('category', e.target.value)} required>
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Thumbnail Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
                {form.preview && (
                  <img src={form.preview} alt="Preview" className="mt-2 rounded"
                    style={{ height: 100, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </div>
            </div>
          </div>

          {/* Section 2 — Curriculum */}
          <div className="p-3 rounded-3 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="fw-semibold text-uppercase small text-muted" style={{ letterSpacing: 1 }}>
                2. Curriculum (Chapters &amp; Lessons)
              </div>
              {isEdit && (
                <button type="button" className="btn btn-sm btn-dark d-flex align-items-center gap-1"
                  onClick={() => setAddingChap(true)}>
                  <FaPlus size={11} /> Add Chapter
                </button>
              )}
            </div>

            {!isEdit && (
              <div className="text-center py-3 rounded-3" style={{ border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: 14 }}>
                Save the course first to add chapters and lessons.
              </div>
            )}

            {isEdit && modules.length === 0 && !addingChap && (
              <div className="text-center py-3 rounded-3" style={{ border: '1px dashed #cbd5e1', color: '#94a3b8', fontSize: 14 }}>
                No chapters added. Build your curriculum here!
              </div>
            )}

            {isEdit && modules.map(mod => (
              <ChapterBlock key={mod.id} module={mod} courseId={initial.id}
                onRefresh={() => fetchModules(initial.id)} />
            ))}

            {addingChap && (
              <div className="d-flex gap-2 mt-2">
                <input autoFocus type="text" className="form-control form-control-sm"
                  placeholder="Chapter title..." value={newChap}
                  onChange={e => setNewChap(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChapter())} />
                <button type="button" className="btn btn-primary btn-sm" onClick={addChapter}>Add</button>
                <button type="button" className="btn btn-outline-secondary btn-sm"
                  onClick={() => { setAddingChap(false); setNewChap(''); }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Publish toggle */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <input type="checkbox" className="form-check-input" id="pub_check"
              checked={form.is_published} onChange={e => set('is_published', e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer' }} />
            <label htmlFor="pub_check" className="fw-semibold" style={{ cursor: 'pointer' }}>
              Publish immediately
            </label>
            <span className="text-muted small ms-1">
              {form.is_published ? '(Active — visible to students)' : '(Upcoming — shown as Coming Soon)'}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                : isEdit ? 'Update Course' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ── Course Row ───────────────────────────────────────────────────
const CourseRow = ({ course, onEdit, onDelete, onToggle }) => (
  <div className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
    style={{ background: '#fff', border: '1px solid #e9ecef' }}>
    <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#f1f3f5' }}>
      {course.image
        ? <img src={course.image} alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }} />
        : <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
            <FaBookOpen />
          </div>
      }
    </div>
    <div className="flex-grow-1 min-w-0">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="fw-semibold" style={{ fontSize: 15 }}>{course.title}</span>
        {course.category && (
          <span className="badge rounded-pill px-2"
            style={{ background: '#e7f3ff', color: '#0d6efd', fontSize: 11 }}>
            {course.category}
          </span>
        )}
        <span className={`badge rounded-pill px-2 ${course.is_published ? 'bg-success' : 'bg-warning text-dark'}`}
          style={{ fontSize: 11 }}>
          {course.is_published ? '● Active' : '⏳ Upcoming'}
        </span>
      </div>
      <div className="text-muted small mt-1">
        ₹{Number(course.price).toLocaleString('en-IN')}
        {course.enrolled_count > 0 && ` · ${course.enrolled_count} enrolled`}
      </div>
    </div>
    <div className="d-flex align-items-center gap-2 flex-shrink-0">
      <div className="form-check form-switch mb-0 me-1">
        <input className="form-check-input" type="checkbox" role="switch"
          checked={!!course.is_published} onChange={() => onToggle(course)}
          style={{ cursor: 'pointer' }}
          title={course.is_published ? 'Set as Upcoming' : 'Set as Active'} />
      </div>
      <button className="btn btn-sm btn-light rounded-circle" style={{ width: 34, height: 34 }}
        onClick={() => onEdit(course)} title="Edit">
        <FaEdit style={{ color: '#0d6efd' }} />
      </button>
      <button className="btn btn-sm btn-light rounded-circle" style={{ width: 34, height: 34 }}
        onClick={() => onDelete(course.id)} title="Delete">
        <FaTrash style={{ color: '#dc3545' }} />
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getCourses();
      if (res.success) setCourses(res.data || []);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing(null); setModal(true); };
  const openEdit   = (c)  => { setEditing(toForm(c)); setModal(true); };
  const closeModal = ()   => { setModal(false); setEditing(null); };

  const toForm = (c) => ({
    id: c.id, title: c.title || '', slug: c.slug || '',
    description: c.description || '', full_description: c.full_description || '',
    price: c.price ?? '', image: c.image || '', imageFile: null,
    preview: c.image || '', category: c.category || '', is_published: !!c.is_published
  });

  const handleSave = async (form) => {
    setLoading(true);
    try {
      let imageUrl = form.image || form.preview || '';
      if (form.imageFile) {
        const up = await uploadAPI.uploadImage(form.imageFile);
        if (up.success) imageUrl = up.imageUrl;
        else { toast.error('Image upload failed'); return; }
      }
      const payload = {
        title: form.title, slug: form.slug,
        description: form.description, full_description: form.full_description,
        price: form.price, image: imageUrl,
        category: form.category, is_published: form.is_published
      };
      const res = form.id
        ? await courseAPI.updateCourse(form.id, payload)
        : await courseAPI.createCourse(payload);
      if (res.success) {
        toast.success(form.id ? 'Course updated' : 'Course created');
        closeModal(); fetchCourses();
      } else toast.error(res.message || 'Something went wrong');
    } catch (err) {
      console.error(err); toast.error('Something went wrong');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      const res = await courseAPI.deleteCourse(id);
      if (res.success) { toast.success('Course deleted'); fetchCourses(); }
      else toast.error(res.message || 'Delete failed');
    } catch (e) { console.error(e); }
  };

  const handleToggle = async (course) => {
    try {
      const res = await courseAPI.toggleStatus(course.id, !course.is_published);
      if (res.success) { toast.success(res.message); fetchCourses(); }
      else toast.error(res.message || 'Failed to update status');
    } catch (e) { console.error(e); }
  };

  const active   = courses.filter(c =>  c.is_published);
  const upcoming = courses.filter(c => !c.is_published);

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="fw-bold mb-0">Courses</h1>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
            <FaPlus size={13} /> Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-5 rounded-3"
            style={{ background: '#fff', border: '1px dashed #dee2e6' }}>
            <FaBookOpen size={40} className="text-muted mb-3" />
            <p className="fw-semibold text-muted mb-1">No courses yet</p>
            <p className="text-muted small mb-3">Create your first course to get started</p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <FaPlus className="me-1" /> Create Course
            </button>
          </div>
        ) : (
          <div className="card border-0 shadow-sm p-3">
            {active.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>Active</span>
                  <span className="badge bg-success rounded-pill">{active.length}</span>
                </div>
                {active.map(c => (
                  <CourseRow key={c.id} course={c}
                    onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>Upcoming</span>
                  <span className="badge bg-warning text-dark rounded-pill">{upcoming.length}</span>
                </div>
                {upcoming.map(c => (
                  <CourseRow key={c.id} course={c}
                    onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CourseModal open={modal} onClose={closeModal} onSave={handleSave}
        initial={editing} loading={loading} />
    </div>
  );
};

export default AdminCourses;
