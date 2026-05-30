import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { subscribeToCounter } from '../utils/socketHelper';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, lRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/electors/live-total')
        ]);
        setStats(sRes.data);
        setLiveCount(lRes.data.totalApprovedElectors);
      } catch { }
    };
    load();

    const cleanup = subscribeToCounter((newCount) => {
      setLiveCount(newCount);
    });
    return cleanup;
  }, []);

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '15px',
    color: 'var(--text-color)'
  };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Admin Dashboard</h3>
          <p className="text-secondary mb-0 small">System overview and management</p>
        </div>
        <Link to="/live-display" target="_blank" className="btn border-0 px-4 py-2 fw-semibold" style={{ background: '#0f3460', color: '#fff', borderRadius: '10px' }}>
          <i className="bi bi-tv me-2"></i>Live Display
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-12">
          <div className="card p-4 text-center" style={{ ...cardStyle, border: `2px solid ${liveCount > 0 ? '#e94560' : '#333'}` }}>
            <div className="text-secondary small mb-2">TOTAL APPROVED ELECTORS (LIVE)</div>
            <div className="live-count-number" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: '900', color: '#e94560', lineHeight: 1, fontFamily: 'monospace' }}>
              {liveCount?.toLocaleString() ?? 0}
            </div>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                <i className="bi bi-arrow-up me-1"></i>Live
              </span>
              <small className="text-secondary">Updates in real-time</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#e94560' }}>{stats?.totalUsers ?? 0}</div>
            <div className="text-secondary small">Total Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#ffc107' }}>{stats?.pendingUsers ?? 0}</div>
            <div className="text-secondary small">Pending Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#28a745' }}>{stats?.approvedUsers ?? 0}</div>
            <div className="text-secondary small">Approved Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#dc3545' }}>{stats?.suspendedUsers ?? 0}</div>
            <div className="text-secondary small">Suspended Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#0dcaf0' }}>{stats?.totalSubmissions ?? 0}</div>
            <div className="text-secondary small">Total Submissions</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#ffc107' }}>{stats?.pendingSubmissions ?? 0}</div>
            <div className="text-secondary small">Pending Electors</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#28a745' }}>{stats?.approvedSubmissions ?? 0}</div>
            <div className="text-secondary small">Approved Electors</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-3 text-center" style={cardStyle}>
            <div className="fw-bold stat-number-admin" style={{ fontSize: '1.8rem', color: '#dc3545' }}>{stats?.rejectedSubmissions ?? 0}</div>
            <div className="text-secondary small">Rejected Electors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
