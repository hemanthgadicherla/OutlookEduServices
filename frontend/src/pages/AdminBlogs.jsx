import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { blogAPI, uploadAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaNewspaper } from 'react-icons/fa';

const EMPTY = {
  title: '', excerpt: '', content: '', author: '',
  date: '', read_time: '', category: '', image: '',
  imageFile: null, preview: '', is_published: true
};

const CATEGORIES = [
  'Study Abroad', 'Universities', 'Visa', 'Scholarships',
  'Student Life', 'Language Tests', 'Career', 'Other'
];

const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// ── Modal ────────────────────────────────────────────────────────
const BlogModal = ({ open, onClose, onSave, initial, loading }) => {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initial || EMPTY);
  }, [open, initial]);

  if (!open) return null;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const isEdit = !!initial?.id;

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1040 }}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '90%', maxWidth: 700,
          maxHeight: '90vh', overflowY: 'auto',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          zIndex: 1050, padding: '28px 32px'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <FaNewspaper style={{ color: '#0d6efd' }} />
            <h5 className="fw-bold mb-0">{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</h5>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-light rounded-circle p-1">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Section 1 — Blog Details */}
          <div className="p-3 rounded-3 mb-4" style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <div className="fw-semibold text-uppercase small text-muted mb-3" style={{ letterSpacing: 1 }}>
              1. Blog Details
            </div>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label fw-semibold small">Blog Title *</label>
                <input
                  type="text" className="form-control"
                  placeholder="e.g. Study Abroad: A Complete Guide"
                  value={form.title} onChange={handleTitleChange} required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Category *</label>
                <select
                  className="form-select"
                  value={form.category} onChange={e => set('category', e.target.value)} required
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Excerpt / Short Description *</label>
                <textarea
                  className="form-control" rows="2"
                  placeholder="Brief summary shown on blog cards (max 140 chars)"
                  value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                  maxLength={500} required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Full Content *</label>
                <textarea
                  className="form-control" rows="8"
                  placeholder="Write the full blog post content here..."
                  value={form.content} onChange={e => set('content', e.target.value)} required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Author *</label>
                <input
                  type="text" className="form-control" placeholder="e.g. EduConsult Team"
                  value={form.author} onChange={e => set('author', e.target.value)} required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Read Time *</label>
                <input
                  type="text" className="form-control" placeholder="e.g. 5 min read"
                  value={form.read_time} onChange={e => set('read_time', e.target.value)} required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold small">Date</label>
                <input
                  type="date" className="form-control"
                  value={form.date} onChange={e => set('date', e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">Cover Image</label>
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
              type="checkbox" className="form-check-input" id="blog_pub"
              checked={form.is_published}
              onChange={e => set('is_published', e.target.checked)}
              style={{ width: 20, height: 20, cursor: 'pointer' }}
            />
            <label htmlFor="blog_pub" className="fw-semibold" style={{ cursor: 'pointer' }}>
              Publish immediately
            </label>
            <span className="text-muted small ms-1">
              {form.is_published ? '(Visible to readers)' : '(Draft — not visible)'}
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
                : isEdit ? 'Update Post' : 'Publish Post'
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ── Blog Row ─────────────────────────────────────────────────────
const BlogRow = ({ blog, onEdit, onDelete }) => (
  <div
    className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
    style={{ background: '#fff', border: '1px solid #e9ecef' }}
  >
    {/* Thumbnail */}
    <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#f1f3f5' }}>
      {blog.image
        ? <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }} />
        : <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
            <FaNewspaper />
          </div>
      }
    </div>

    {/* Info */}
    <div className="flex-grow-1 min-w-0">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="fw-semibold" style={{ fontSize: 15 }}>{blog.title}</span>
        {blog.category && (
          <span className="badge rounded-pill px-2" style={{ background: '#e7f3ff', color: '#0d6efd', fontSize: 11 }}>
            {blog.category}
          </span>
        )}
        <span className={`badge rounded-pill px-2 ${blog.is_published ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: 11 }}>
          {blog.is_published ? '● Published' : '○ Draft'}
        </span>
      </div>
      <div className="text-muted small mt-1">
        {blog.author && <span>{blog.author}</span>}
        {blog.read_time && <span className="ms-2">· {blog.read_time}</span>}
        {blog.date && <span className="ms-2">· {blog.date}</span>}
      </div>
    </div>

    {/* Actions */}
    <div className="d-flex align-items-center gap-2 flex-shrink-0">
      <button
        className="btn btn-sm btn-light rounded-circle"
        style={{ width: 34, height: 34 }}
        onClick={() => onEdit(blog)}
        title="Edit"
      >
        <FaEdit style={{ color: '#0d6efd' }} />
      </button>
      <button
        className="btn btn-sm btn-light rounded-circle"
        style={{ width: 34, height: 34 }}
        onClick={() => onDelete(blog.id)}
        title="Delete"
      >
        <FaTrash style={{ color: '#dc3545' }} />
      </button>
    </div>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────
const AdminBlogs = () => {
  const [blogs,   setBlogs]   = useState([]);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await blogAPI.getBlogs();
      if (res.success) setBlogs(res.data || []);
    } catch (e) { console.error(e); }
  };

  const openCreate = () => { setEditing(null); setModal(true); };
  const openEdit   = (b)  => {
    setEditing({
      id:           b.id,
      title:        b.title        || '',
      excerpt:      b.excerpt      || '',
      content:      b.content      || '',
      author:       b.author       || '',
      date:         b.date         || '',
      read_time:    b.read_time    || '',
      category:     b.category     || '',
      image:        b.image        || '',
      imageFile:    null,
      preview:      b.image        || '',
      is_published: b.is_published !== false
    });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async (form) => {
    setLoading(true);
    try {
      let imageUrl = form.image || form.preview || '';

      if (form.imageFile) {
        const up = await uploadAPI.uploadImage(form.imageFile);
        if (up.success) imageUrl = up.imageUrl;
        else { toast.error('Image upload failed'); return; }
      }

      const slug = toSlug(form.title);

      const payload = {
        title:        form.title,
        slug,
        excerpt:      form.excerpt || form.content.slice(0, 140),
        content:      form.content,
        image:        imageUrl,
        author:       form.author,
        read_time:    form.read_time,
        date:         form.date,
        category:     form.category,
        is_published: form.is_published
      };

      const res = editing?.id
        ? await blogAPI.updateBlog(editing.id, payload)
        : await blogAPI.createBlog(payload);

      if (res.success) {
        toast.success(editing?.id ? 'Blog updated' : 'Blog published');
        closeModal();
        fetchBlogs();
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
    if (!window.confirm('Delete this blog post? This cannot be undone.')) return;
    try {
      const res = await blogAPI.deleteBlog(id);
      if (res.success) { toast.success('Blog deleted'); fetchBlogs(); }
      else toast.error(res.message || 'Delete failed');
    } catch (e) { console.error(e); }
  };

  const published = blogs.filter(b => b.is_published !== false);
  const drafts    = blogs.filter(b => b.is_published === false);

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="fw-bold mb-0">Blogs</h1>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreate}>
            <FaPlus size={13} /> Create Post
          </button>
        </div>

        {/* Blog list */}
        {blogs.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: '#fff', border: '1px dashed #dee2e6' }}>
            <FaNewspaper size={40} className="text-muted mb-3" />
            <p className="fw-semibold text-muted mb-1">No blog posts yet</p>
            <p className="text-muted small mb-3">Create your first post to get started</p>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <FaPlus className="me-1" /> Create Post
            </button>
          </div>
        ) : (
          <div className="card border-0 shadow-sm p-3">

            {/* Published */}
            {published.length > 0 && (
              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>
                    Published
                  </span>
                  <span className="badge bg-success rounded-pill">{published.length}</span>
                </div>
                {published.map(b => (
                  <BlogRow key={b.id} blog={b} onEdit={openEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}

            {/* Drafts */}
            {drafts.length > 0 && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-semibold text-muted small text-uppercase" style={{ letterSpacing: 1 }}>
                    Drafts
                  </span>
                  <span className="badge bg-secondary rounded-pill">{drafts.length}</span>
                </div>
                {drafts.map(b => (
                  <BlogRow key={b.id} blog={b} onEdit={openEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <BlogModal
        open={modal}
        onClose={closeModal}
        onSave={handleSave}
        initial={editing}
        loading={loading}
      />
    </div>
  );
};

export default AdminBlogs;
