import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { courseAPI, uploadAPI } from '../services/api';
import { toast } from 'react-toastify';

const EMPTY = {
  title: '', description: '', fullDescription: '',
  price: '', image: '', imageFile: null, preview: ''
};

const AdminCourses = () => {
  const [courses,   setCourses]   = useState([]);
  const [form,      setForm]      = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getCourses();
      if (res.success) setCourses(res.data);
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, imageFile: file, preview: URL.createObjectURL(file) });
  };

  const resetForm = () => { setForm(EMPTY); setEditingId(null); };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({
      title:           c.title           || '',
      description:     c.description     || '',
      fullDescription: c.full_description || '',
      price:           c.price           ?? '',
      image:           c.image           || '',
      imageFile:       null,
      preview:         c.image           || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = form.image;

      if (form.imageFile) {
        const up = await uploadAPI.uploadImage(form.imageFile);
        if (up.success) { imageUrl = up.imageUrl; }
        else { toast.error('Image upload failed'); return; }
      }

      const payload = {
        title:           form.title,
        description:     form.description,
        fullDescription: form.fullDescription,
        price:           form.price,
        image:           imageUrl
      };

      const res = editingId
        ? await courseAPI.updateCourse(editingId, payload)
        : await courseAPI.createCourse(payload);

      if (res.success) {
        toast.success(editingId ? 'Course updated' : 'Course added');
        resetForm();
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
    if (!window.confirm('Delete this course?')) return;
    try {
      const res = await courseAPI.deleteCourse(id);
      if (res.success) { toast.success('Course deleted'); fetchCourses(); }
    } catch (e) { console.error(e); }
  };

  // Toggle active ↔ upcoming
  const handleToggleStatus = async (course) => {
    try {
      const res = await courseAPI.toggleStatus(course.id, !course.is_published);
      if (res.success) {
        toast.success(res.message);
        fetchCourses();
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to update status');
    }
  };

  const activeCourses   = courses.filter(c => c.is_published);
  const upcomingCourses = courses.filter(c => !c.is_published);

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        <h1 className="mb-4 fw-bold">Course Management</h1>

        {/* ── FORM ── */}
        <div className="card border-0 shadow-sm p-4 mb-5">
          <h5 className="fw-bold mb-3">{editingId ? '✏️ Edit Course' : '➕ Add New Course'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  name="title" type="text" placeholder="Course Title"
                  className="form-control" value={form.title}
                  onChange={handleChange} required
                />
              </div>
              <div className="col-md-6">
                <input
                  name="price" type="number" placeholder="Price (₹)"
                  className="form-control" value={form.price}
                  onChange={handleChange} required
                />
              </div>
              <div className="col-12">
                <textarea
                  name="description" placeholder="Short Description"
                  className="form-control" rows="2"
                  value={form.description} onChange={handleChange} required
                />
              </div>
              <div className="col-12">
                <textarea
                  name="fullDescription" placeholder="Full Course Details"
                  className="form-control" rows="6"
                  value={form.fullDescription} onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <input
                  type="file" className="form-control" accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              {form.preview && (
                <div className="col-12">
                  <img
                    src={form.preview} alt="Preview"
                    className="rounded"
                    style={{ width: 220, height: 150, objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing…' : editingId ? 'Update Course' : 'Add Course'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ── ACTIVE COURSES ── */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <span className="badge bg-success">Active</span>
            Courses
            <span className="badge bg-secondary ms-1">{activeCourses.length}</span>
          </h4>

          {activeCourses.length === 0 && (
            <p className="text-muted">No active courses yet.</p>
          )}

          <div className="row g-3">
            {activeCourses.map(course => (
              <div key={course.id} className="col-md-4">
                <CourseCard
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggleStatus}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── UPCOMING COURSES ── */}
        <div>
          <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark">Upcoming</span>
            Courses
            <span className="badge bg-secondary ms-1">{upcomingCourses.length}</span>
          </h4>

          {upcomingCourses.length === 0 && (
            <p className="text-muted">No upcoming courses.</p>
          )}

          <div className="row g-3">
            {upcomingCourses.map(course => (
              <div key={course.id} className="col-md-4">
                <CourseCard
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggleStatus}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


// ── Course Card sub-component ──────────────────────────────────────
const CourseCard = ({ course, onEdit, onDelete, onToggle }) => (
  <div className="card h-100 shadow-sm border-0">
    {course.image && (
      <img
        src={course.image} alt={course.title}
        className="card-img-top"
        onError={(e) => { e.target.style.display = 'none'; }}
        style={{ height: 180, objectFit: 'cover' }}
      />
    )}
    <div className="card-body d-flex flex-column">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="fw-bold mb-0">{course.title}</h6>
        <span className={`badge ${course.is_published ? 'bg-success' : 'bg-warning text-dark'}`}>
          {course.is_published ? 'Active' : 'Upcoming'}
        </span>
      </div>
      <p className="text-muted small mb-1">{course.description}</p>
      <p className="fw-semibold mb-3">₹{Number(course.price).toLocaleString()}</p>

      {/* Status toggle */}
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`status-${course.id}`}
          checked={!!course.is_published}
          onChange={() => onToggle(course)}
        />
        <label className="form-check-label small" htmlFor={`status-${course.id}`}>
          {course.is_published ? 'Active (visible)' : 'Upcoming (coming soon)'}
        </label>
      </div>

      <div className="d-flex gap-2 mt-auto">
        <button className="btn btn-warning btn-sm flex-grow-1" onClick={() => onEdit(course)}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm flex-grow-1" onClick={() => onDelete(course.id)}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default AdminCourses;
