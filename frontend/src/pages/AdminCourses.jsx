import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { courseAPI, uploadAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBookOpen } from 'react-icons/fa';

const EMPTY = {
  title: '', slug: '', description: '', full_description: '',
  price: '', image: '', imageFile: null, preview: '',
  category: '', is_published: true
};

const CATEGORIES = ['Marketing', 'Finance', 'Language', 'Technology', 'Business', 'Design', 'Other'];

// Auto-generate slug from title
const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// ── Modal ────────────────────────────────────────────────────────
const CourseModal = ({ open, onClose, onSave, initial, loading }) => {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initial || EMPTY);
  }, [open, initial]);

  if (!open) return null;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleTitleChange = (e) => {
    const t = e.target.value;
    set('title', t);
    if (!initial?.id) set('slug', toSlug(t)); // auto-fill slug only on create
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('imageFile', file);
    set('preview', URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const isEdit = !!initial?.id;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '90%', maxWidth: 680,
          maxHeight: '90vh', overflowY: 'auto',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          zIndex: 1050, padding: '28px 32px'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaBookOpen style={{ color: '#0d6efd' }} />
            <h5 className="fw-bold mb-0">{isEdit ? 'Edit Course' : 'Create New Course'}</h5>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-light rounded-circle p-1">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Section 1 — Course Details */}
          <div className="p-3 rounded-3 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <div className="fw-semibold text-uppercase small text-muted mb-3" style={{ letterSpacing: 1 }}>
              1. Course Details
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Course Title *</label>
                <input
                  type="text" className="form-control" placeholder="e.g. Digital Marketing Mastery"
                  value={form.title} onChange={handleTitleChange} required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">URL Slug *</label>
                <input
                  type="text" className="form-control" placeholder="e.g. digital-marketing-mastery"
                  value={form.slug} onChange={e => set('slug', e.target.value)} required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Short Description *</label>
                <textarea
                  className="form-control" rows="2"
                  placeholder="Brief summary shown on course cards"
                  value={form.description} onChange={e => set('description', e.target.value)} required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Full Description</label>
                <textarea
                  className="form-control" rows="4"
                  placeholder="Detailed course content, what students will learn..."
                  value={form.full_description} onChange={e => set('full_description', e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Price (₹) *</label>
                <input
                  type="number" className="form-control" placeholder="e.g. 25000"
                  value={form.price} onChange={e => set('price', e.target.value)} required min="0"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold small">Category *</label>
                <select
                  className="form-select"
                  value={form.category} onChange={e => set('category', e.target.value)} required
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Thumbnail Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImage} />
                {form.preview && (
                  <img
                    src={form.preview} alt="Preview"
                    className="mt-2 rounded" style={{ height: 120, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Publish toggle */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <input
              type="checkbox" className="form-check-input" id="pub_check"
              checked={form.is_published}
              onChange={e => set('is_published', e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer' }}
            />
            <label htmlFor="pub_check" className="fw-semibold" style={{ cursor: 'pointer' }}>
              Publish immediately
            </label>
            <span className="text-muted small ms-1">
              {form.is_published ? '(Active — visible to students)' : '(Upcoming — shown as Coming Soon)'}
            </span>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                : isEdit ? 'Update Course' : 'Save Course'
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ── Course Row ───────────────────────────────────────────────────
const CourseRow = ({ course, onEdit, onDelete, onToggle }) => (
  <div
    className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
    style={{ background: '#fff', border: '1px solid #e9ecef' }}
  >
    {/* Thumbnail */}
    <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#f1f3f5' }}>
      {course.image
        ? <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }} />
        : <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
            <FaBookOpen />
          </div>
      }
    </div>

    {/* Info */}
    <div className="flex-grow-1 min-w-0">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="fw-semibold" style={{ fontSize: 15 }}>{course.title}</span>
        {course.category && (
          <span className="badge rounded-pill px-2" style={{ background: '#e7f3ff', color: '#0d6efd', fontSize: 11 }}>
            {course.category}
          </span>
        )}
        <span className={`badge rounded-pill px-2 ${course.is_published ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: 11 }}>
          {course.is_published ? '● Active' : '⏳ Upcoming'}
        </span>
      </div>
      <div className="text-muted small mt-1">
        ₹{Number(course.price).toLocaleString('en-IN')}
        {course.enrolled_count > 0 && ` · ${course.enrolled_count} enrolled`}
      </div>
    </div>

    {/* Actions */}
    <div className="d-flex align-items-center gap-2 flex-shrink-0">
      <div className="form-check form-switch mb-0 me-1">
        <input
          className="form-check-input" type="checkbox" role="switch"
          checked={!!course.is_published} onChange={() => onToggle(course)}
          style={{ cursor: 'pointer' }}
          title={course.is_published ? 'Set as Upcoming' : 'Set as Active'}
        />
      </div>
      <button
        className="btn btn-sm btn-light rounded-circle"
        style={{ width: 34, height: 34 }}
        onClick={() => onEdit(course)}
        title="Edit"
      >
        <FaEdit style={{ color: '#0d6efd' }} />
      </button>
      <button
        className="btn btn-sm btn-light rounded-circle"
        style={{ width: 34, height: 34 }}
        onClick={() => onDelete(course.id)}
        title="Delete"
      >
        <FaTrash style={{ color: '#dc3545' }} />
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────
const AdminCourses = () => {
  const [courses,   setCourses]   = useState([]);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getCourses();
      if (res.success) setCourses(res.data || []);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing(null); setModal(true); };
  const openEdit   = (c)  => { setEditing(c);   setModal(true); };
  const closeModal = ()   => { setModal(false);  setEditing(null); };

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
        title:           form.title,
        slug:            form.slug,
        description:     form.description,
        full_description: form.full_description,
        price:           form.price,
        image:           imageUrl,
        category:        form.category,
        is_published:    form.is_published
      };

      const res = editing
        ? await courseAPI.updateCourse(editing.id, payload)
        : await courseAPI.createCourse(payload);

      if (res.success) {
        toast.success(editing ? 'Course updated' : 'Course created');
        closeModal();
        fetchCourses();
      } else {
        toast.error(res.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
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

  // Map course object to form shape for editing
  const toForm = (c) => ({
    title:            c.title            || '',
    slug:             c.slug             || '',
    description:      c.description      || '',
    full_description: c.full_description || '',
    price:            c.price            ?? '',
    image:            c.image            || '',
    imageFile:        null,
    preview:          c.image            || '',
    category:         c.category         || '',
    is_published:     !!c.is_published,
    id:               c.id
  });

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="fw-bold mb-0">Courses</h1>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
            <FaPlus size={13} /> Create Course
          </button>
        </div>

        {/* Course list */}
        {courses.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: '#fff', border: '1px dashed #dee2e6' }}>
            <FaBookOpen size={40} className="text-muted mb-3" />
            <p className="fw-semibold text-muted mb-1">No courses yet</p>
            <p className="text-muted small mb-3">Create your first course to get started</p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <FaPlus className="me-1" /> Create Course
            </button>
          </div>
        ) : (
          <div className="card border-0 shadow-sm p-3">

            {/* Active */}
            {active.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>
                    Active
                  </span>
                  <span className="badge bg-success rounded-pill">{active.length}</span>
                </div>
                {active.map(c => (
                  <CourseRow key={c.id} course={c}
                    onEdit={() => openEdit(toForm(c))}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>
                    Upcoming
                  </span>
                  <span className="badge bg-warning text-dark rounded-pill">{upcoming.length}</span>
                </div>
                {upcoming.map(c => (
                  <CourseRow key={c.id} course={c}
                    onEdit={() => openEdit(toForm(c))}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <CourseModal
        open={modal}
        onClose={closeModal}
        onSave={handleSave}
        initial={editing}
        loading={loading}
      />
    </div>
  );
};

export default AdminCourses;
