import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ search: '', start_date: '', end_date: '', status: '' });
  const [editSub, setEditSub] = useState(null);

  const loadSubmissions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status) params.append('status', filters.status);
      const res = await api.get(`/electors/all?${params.toString()}`);
      setSubmissions(res.data);
    } catch { }
  };

  useEffect(() => { loadSubmissions(); }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this submission?`)) return;
    try {
      if (action === 'approve') await api.put(`/electors/${id}/approve`);
      else if (action === 'reject') await api.put(`/electors/${id}/reject`);
      else if (action === 'delete') await api.delete(`/electors/${id}`);
      loadSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/electors/${editSub.id}`, { elector_number: editSub.elector_number, description: editSub.description });
      setEditSub(null);
      loadSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const statusBadge = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return <span className={`badge bg-${colors[status]} bg-opacity-10 text-${colors[status]} border border-${colors[status]} border-opacity-25 px-3 py-2`}>{status}</span>;
  };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Electors Management</h3>
          <p className="text-secondary mb-0 small">View and manage all electors submissions</p>
        </div>
      </div>

      <div className="card-custom mb-4">
        <div className="card-body p-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control bg-dark border-secondary text-white" value={filters.start_date} onChange={(e) => setFilters({ ...filters, start_date: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input type="date" className="form-control bg-dark border-secondary text-white" value={filters.end_date} onChange={(e) => setFilters({ ...filters, end_date: e.target.value })} />
            </div>
            <div className="col-md-2">
              <select className="form-select bg-dark border-secondary text-white" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn w-100 border-0 fw-semibold" style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }} onClick={loadSubmissions}>
                <i className="bi bi-search me-1"></i>Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-custom">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="ps-4">#</th>
                <th>User</th>
                <th>Electors Number</th>
                <th>Description</th>
                <th>Status</th>
                <th>Approved By</th>
                <th>Date</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-secondary py-4">No submissions found</td></tr>
              ) : (
                submissions.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="ps-4 text-secondary">{i + 1}</td>
                    <td className="fw-semibold">{s.user_name || 'Unknown'}</td>
                    <td className="fw-bold" style={{ color: '#e94560' }}>{s.elector_number?.toLocaleString()}</td>
                    <td className="text-secondary small">{s.description || '-'}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="text-secondary small">{s.approved_by_name || '-'}</td>
                    <td className="text-secondary small">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="pe-4 text-end">
                      <div className="btn-group btn-group-sm gap-1">
                        {s.status === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-outline-success border-0" onClick={() => handleAction(s.id, 'approve')} title="Approve"><i className="bi bi-check-lg"></i></button>
                            <button className="btn btn-sm btn-outline-warning border-0" onClick={() => handleAction(s.id, 'reject')} title="Reject"><i className="bi bi-x-lg"></i></button>
                          </>
                        )}
                        <button className="btn btn-sm btn-outline-info border-0" onClick={() => setEditSub(s)} title="Edit"><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleAction(s.id, 'delete')} title="Delete"><i className="bi bi-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editSub && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content-custom">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-white">Edit Submission</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditSub(null)}></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Electors Number</label>
                    <input type="number" className="form-control bg-dark border-secondary text-white" value={editSub.elector_number} onChange={(e) => setEditSub({ ...editSub, elector_number: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Description</label>
                    <textarea className="form-control bg-dark border-secondary text-white" rows="3" value={editSub.description || ''} onChange={(e) => setEditSub({ ...editSub, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditSub(null)}>Cancel</button>
                  <button type="submit" className="btn" style={{ background: '#e94560', color: '#fff' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
