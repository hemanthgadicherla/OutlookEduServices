import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { courseAPI, uploadAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBookOpen } from 'react-icons/fa';

const EMPTY_COURSE = {
  title: '', slug: '', description: '', full_description: '',
  price: '', image: '', imageFile: null, preview: '',
  category: '', is_published: true,
};

const CATEGORIES = ['Marketing', 'Finance', 'Language', 'Technology', 'Business', 'Design', 'Other'];
const toSlug = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// ── Create Course Modal (basic details only) ─────────────────────
const CreateCourseModal = ({ open, onClose, onCreated, loading }) => {
  const [form, setForm] = useState(EMPTY_COURSE);

  useEffect(() => { if (open) setForm(EMPTY_COURSE); }, [open]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleTitleChange = (e) => {
    const t = e.target.value;
    set('title', t);
    set('slug', toSlug(t));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('imageFile', file);
    set('preview', URL.createObjectURL(file));
  };

  return (
    <>
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1040 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '95%', maxWidth: 640,
        maxHeight: '90vh', overflowY: 'auto',
        background: '#fff', borderRadius: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        zIndex: 1050, padding: '28px 32px',
      }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaBookOpen style={{ color: '#0d6efd' }} />
            <h5 className="fw-bold mb-0">Create New Course</h5>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-light rounded-circle p-1">
            <FaTimes />
          </button>
        </div>

        <p className="text-muted small mb-4">
          Fill in the basics and save — you'll be taken to the course editor to add chapters and videos.
        </p>

        <form onSubmit={e => { e.preventDefault(); onCreated(form); }}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold small">Course Title *</label>
              <input type="text" className="form-control"
                placeholder="e.g. Digital Marketing Mastery"
                value={form.title} onChange={handleTitleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold small">URL Slug *</label>
              <input type="text" className="form-control"
                placeholder="e.g. digital-marketing-mastery"
                value={form.slug} onChange={e => set('slug', e.target.value)} required />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold small">Short Description *</label>
              <textarea className="form-control" rows={2}
                placeholder="Brief summary shown on course cards"
                value={form.description} onChange={e => set('description', e.target.value)} required />
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
                  style={{ height: 80, objectFit: 'cover', borderRadius: 8 }}
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center gap-2">
                <input type="checkbox" className="form-check-input" id="pub_check"
                  checked={form.is_published} onChange={e => set('is_published', e.target.checked)}
                  style={{ width: 20, height: 20, cursor: 'pointer' }} />
                <label htmlFor="pub_check" className="fw-semibold small" style={{ cursor: 'pointer' }}>
                  Publish immediately
                </label>
                <span className="text-muted small ms-1">
                  {form.is_published ? '(Visible to students)' : '(Coming Soon)'}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                : 'Create & Open Editor →'}
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
      <button className="btn btn-sm btn-light d-flex align-items-center gap-1 px-3"
        style={{ fontSize: 13 }} onClick={() => onEdit(course)}>
        <FaEdit style={{ color: '#0d6efd' }} size={13} /> Edit
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
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [modal,   setModal]   = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getCourses();
      if (res.success) setCourses(res.data || []);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (form.imageFile) {
        const up = await uploadAPI.uploadImage(form.imageFile);
        if (up.success) imageUrl = up.imageUrl;
        else { toast.error('Image upload failed'); return; }
      }
      const payload = {
        title: form.title, slug: form.slug,
        description: form.description, full_description: form.full_description,
        price: form.price, image: imageUrl,
        category: form.category, is_published: form.is_published,
      };
      const res = await courseAPI.createCourse(payload);
      if (res.success) {
        toast.success('Course created — opening editor');
        setModal(false);
        navigate(`/admin/courses/${res.data.id}`, { state: { course: res.data } });
      } else toast.error(res.message || 'Something went wrong');
    } catch (err) {
      toast.error('Something went wrong');
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
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setModal(true)}>
            <FaPlus size={13} /> Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: '#fff', border: '1px dashed #dee2e6' }}>
            <FaBookOpen size={40} className="text-muted mb-3" />
            <p className="fw-semibold text-muted mb-1">No courses yet</p>
            <p className="text-muted small mb-3">Create your first course to get started</p>
            <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>
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
                    onEdit={c => navigate(`/admin/courses/${c.id}`, { state: { course: c } })}
                    onDelete={handleDelete}
                    onToggle={handleToggle} />
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
                    onEdit={c => navigate(`/admin/courses/${c.id}`, { state: { course: c } })}
                    onDelete={handleDelete}
                    onToggle={handleToggle} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreateCourseModal open={modal} onClose={() => setModal(false)}
        onCreated={handleCreate} loading={loading} />
    </div>
  );
};

export default AdminCourses;
