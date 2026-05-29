import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const History = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ search: '', start_date: '', end_date: '', status: '' });

  const loadSubmissions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status) params.append('status', filters.status);
      const res = await api.get(`/electors/mine?${params.toString()}`);
      setSubmissions(res.data);
    } catch { }
  };

  useEffect(() => { loadSubmissions(); }, []);

  const statusBadge = (status) => {
    const colors = { pending: 'warning', approved: 'success', rejected: 'danger' };
    return <span className={`badge bg-${colors[status] || 'secondary'} bg-opacity-10 text-${colors[status] || 'secondary'} border border-${colors[status] || 'secondary'} border-opacity-25 px-3 py-2`}>{status}</span>;
  };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Submission History</h3>
          <p className="text-secondary mb-0 small">View and search your submissions</p>
        </div>
      </div>

      <div className="card-custom mb-4">
        <div className="card-body p-4">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <input type="text" className="form-control bg-dark border-secondary text-white" placeholder="Search by description or number..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
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
            <div className="col-md-2">
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
                <th>Electors Number</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-secondary py-4">No submissions found</td></tr>
              ) : (
                submissions.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="ps-4 text-secondary">{i + 1}</td>
                    <td className="fw-bold" style={{ color: '#e94560' }}>{s.elector_number?.toLocaleString()}</td>
                    <td className="text-secondary">{s.description || '-'}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td className="text-secondary small">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
