import { useEffect, useState, useCallback, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { registrationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaDownload, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const LIMIT = 20;

// ── CSV export ────────────────────────────────────────────────────
const exportCSV = (rows) => {
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Course', 'Country', 'Status', 'Payment ID', 'Date'];
  const escape  = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines   = [
    headers.join(','),
    ...rows.map(r => [
      r.id,
      r.student_name,
      r.email,
      r.phone,
      r.selected_course,
      r.country || '',
      r.payment_status,
      r.payment_id || '',
      new Date(r.created_at).toLocaleDateString('en-IN'),
    ].map(escape).join(','))
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Status badge ──────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    paid:    { bg: '#d1fae5', color: '#065f46', label: 'Paid'    },
    pending: { bg: '#fef9c3', color: '#92400e', label: 'Pending' },
    failed:  { bg: '#fee2e2', color: '#991b1b', label: 'Failed'  },
  };
  const s = map[status] || { bg: '#f1f5f9', color: '#475569', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
};

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [loading,       setLoading]       = useState(false);
  const [exporting,     setExporting]     = useState(false);
  const [page,          setPage]          = useState(1);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);

  // Debounce search so we don't fire on every keystroke
  const searchTimer = useRef(null);

  // ── Fetch a specific page (with current search + status filter) ──
  const fetchRegistrations = useCallback(async (p = 1, searchVal, statusVal) => {
    setLoading(true);
    try {
      const res = await registrationAPI.getRegistrations(p, LIMIT, false, searchVal, statusVal);
      if (res.success) {
        const rows     = res.data || [];
        const tot      = res.total      ?? rows.length;
        const totPages = res.totalPages ?? (Math.ceil(tot / LIMIT) || 1);
        setRegistrations(rows);
        setTotal(tot);
        setTotalPages(totPages);
        setPage(p);
      } else {
        toast.error(res.message || 'Failed to fetch registrations');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRegistrations(1, '', 'all');
  }, [fetchRegistrations]);

  // ── Search: debounce 400 ms then reset to page 1 ─────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchRegistrations(1, val, statusFilter);
    }, 400);
  };

  // ── Status filter: immediate, reset to page 1 ────────────────────
  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    fetchRegistrations(1, search, val);
  };

  // ── Page navigation ───────────────────────────────────────────────
  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page || loading) return;
    fetchRegistrations(p, search, statusFilter);
  };

  // ── Update payment status ─────────────────────────────────────────
  const handleStatusUpdate = async (id, payment_status) => {
    try {
      const res = await registrationAPI.updateRegistration(id, { payment_status });
      if (res.success) {
        toast.success(`Status updated to ${payment_status}`);
        fetchRegistrations(page, search, statusFilter);
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration? This cannot be undone.')) return;
    try {
      const res = await registrationAPI.deleteRegistration(id);
      if (res.success) {
        toast.success('Registration deleted');
        // If we deleted the last row on this page, go back one page
        const newPage = registrations.length === 1 && page > 1 ? page - 1 : page;
        fetchRegistrations(newPage, search, statusFilter);
      } else {
        toast.error(res.message || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  // ── Export ALL registrations as CSV ──────────────────────────────
  const handleExport = async () => {
    setExporting(true);
    try {
      // Pass all=true to get every row regardless of pagination
      const res = await registrationAPI.getRegistrations(1, LIMIT, true);
      if (res.success && res.data?.length > 0) {
        exportCSV(res.data);
        toast.success(`Exported ${res.data.length} registrations`);
      } else {
        toast.info('No data to export');
      }
    } catch (err) {
      console.error(err);
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  // ── Pagination page numbers with ellipsis ─────────────────────────
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h1 className="fw-bold mb-0">Registrations</h1>
            <p className="text-muted small mb-0 mt-1">{total} total registrations</p>
          </div>
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting
              ? <><span className="spinner-border spinner-border-sm" /> Exporting...</>
              : <><FaDownload size={13} /> Export All CSV</>
            }
          </button>
        </div>

        {/* Filters */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch size={13} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, email, phone or course..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <span className="text-muted small">
              {total > 0
                ? `Showing ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} of ${total}`
                : 'No results'}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th className="fw-semibold text-muted small py-3 ps-4" style={{ fontSize: 12, letterSpacing: 0.5 }}>NAME</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>EMAIL</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>PHONE</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>COURSE</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>STATUS</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>DATE</th>
                  <th className="fw-semibold text-muted small py-3"      style={{ fontSize: 12, letterSpacing: 0.5 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No registrations found
                    </td>
                  </tr>
                ) : registrations.map(r => (
                  <tr key={r.id}>
                    <td className="ps-4 fw-semibold" style={{ fontSize: 14 }}>{r.student_name}</td>
                    <td style={{ fontSize: 13, color: '#475569' }}>{r.email}</td>
                    <td style={{ fontSize: 13, color: '#475569' }}>{r.phone}</td>
                    <td style={{ fontSize: 13 }}>
                      <span className="badge rounded-pill px-2 py-1"
                        style={{ background: '#e7f3ff', color: '#0d6efd', fontSize: 11 }}>
                        {r.selected_course}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 110, fontSize: 12 }}
                        value={r.payment_status}
                        onChange={e => handleStatusUpdate(r.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ fontSize: 12 }}
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination — always show when there's more than one page */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between px-4 py-3"
              style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-muted small">
                Page {page} of {totalPages}&nbsp;·&nbsp;{total} total
              </span>
              <div className="d-flex gap-1 flex-wrap">
                {/* First page */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => goToPage(1)}
                  title="First page"
                >
                  «
                </button>

                {/* Prev */}
                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  disabled={page <= 1 || loading}
                  onClick={() => goToPage(page - 1)}
                >
                  <FaChevronLeft size={11} /> Prev
                </button>

                {/* Numbered pages with ellipsis */}
                {pageNumbers.map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="btn btn-sm disabled px-2" style={{ pointerEvents: 'none' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => goToPage(p)}
                      disabled={loading}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                  disabled={page >= totalPages || loading}
                  onClick={() => goToPage(page + 1)}
                >
                  Next <FaChevronRight size={11} />
                </button>

                {/* Last page */}
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page >= totalPages || loading}
                  onClick={() => goToPage(totalPages)}
                  title="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminRegistrations;
