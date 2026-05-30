import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/electors/my-stats');
        setStats(res.data);
      } catch { }
    };
    loadStats();
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
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>User Dashboard</h3>
          <p className="text-secondary mb-0 small">Overview of your electors submissions</p>
        </div>
        <Link to="/submit" className="btn border-0 px-4 py-2 fw-semibold" style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }}>
          <i className="bi bi-plus-lg me-2"></i>New Submission
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center" style={cardStyle}>
            <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#e94560' }}>{stats?.totalSubmissions ?? 0}</div>
            <div className="text-secondary small mt-1"><i className="bi bi-file-earmark me-1"></i>My Submissions</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center" style={cardStyle}>
            <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#28a745' }}>{stats?.approvedSubmissions ?? 0}</div>
            <div className="text-secondary small mt-1"><i className="bi bi-check-circle me-1"></i>Approved</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center" style={cardStyle}>
            <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffc107' }}>{stats?.pendingSubmissions ?? 0}</div>
            <div className="text-secondary small mt-1"><i className="bi bi-clock me-1"></i>Pending</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card p-4 text-center" style={cardStyle}>
            <div className="stat-number" style={{ fontSize: '2.5rem', fontWeight: '800', color: '#dc3545' }}>{stats?.rejectedSubmissions ?? 0}</div>
            <div className="text-secondary small mt-1"><i className="bi bi-x-circle me-1"></i>Rejected</div>
          </div>
        </div>
      </div>

      <div className="card p-5 text-center total-electors-card" style={cardStyle}>
        <div className="text-secondary mb-2">Your Total Approved Electors</div>
        <div className="total-electors-number" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', color: '#e94560', lineHeight: 1 }}>
          {stats?.totalApprovedElectors?.toLocaleString() ?? 0}
        </div>
        <div className="text-secondary small mt-2">ELECTORS</div>
      </div>
    </div>
  );
};

export default Dashboard;
