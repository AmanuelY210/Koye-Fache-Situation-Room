import React, { useState } from 'react';
import api from '../utils/api';

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const reportTypes = [
    { value: 'daily', label: 'Daily Report' },
    { value: 'weekly', label: 'Weekly Report' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'yearly', label: 'Yearly Report' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', icon: 'bi-filetype-pdf' },
    { value: 'excel', label: 'Excel', icon: 'bi-file-earmark-excel' },
    { value: 'csv', label: 'CSV', icon: 'bi-filetype-csv' }
  ];

  const handleExport = async (type, format) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get(`/reports/${type}/${format}`, {
        responseType: 'blob',
        timeout: 30000
      });

      const extMap = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.${extMap[format]}`;
      a.click();
      window.URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: `${type} report downloaded as ${format.toUpperCase()}` });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to generate report' });
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '15px',
    padding: 'clamp(12px, 3vw, 24px)'
  };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Reports</h3>
        <p className="text-secondary mb-0 small">Generate and export election reports</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type} small py-2 mb-4`} style={{ background: message.type === 'success' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`, color: message.type === 'success' ? '#28a745' : '#dc3545' }}>
          {message.text}
        </div>
      )}

      {loading && (
        <div className="text-center mb-4">
          <div className="spinner-border" role="status" style={{ color: '#e94560' }}>
            <span className="visually-hidden">Generating...</span>
          </div>
          <div className="text-secondary mt-2">Generating report...</div>
        </div>
      )}

      <div className="row g-4">
        {reportTypes.map((rt) => (
          <div className="col-md-6 col-lg-3" key={rt.value}>
            <div style={cardStyle} className="text-center h-100">
              <h5 className="fw-bold mb-4" style={{ color: '#e94560', textTransform: 'capitalize' }}>
                <i className={`bi bi-calendar-${rt.value === 'daily' ? 'day' : rt.value === 'weekly' ? 'week' : rt.value === 'monthly' ? 'month' : 'year'} me-2`}></i>
                {rt.label}
              </h5>
              <div className="d-flex flex-column gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.value}
                    className="btn w-100 border-0 d-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                    style={{ background: 'rgba(233,69,96,0.1)', color: '#e94560', borderRadius: '10px', transition: 'all 0.3s' }}
                    onClick={() => handleExport(rt.value, fmt.value)}
                    disabled={loading}
                    onMouseEnter={(e) => e.target.style.background = '#e94560'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(233,69,96,0.1)'}
                  >
                    <i className={`bi ${fmt.icon} me-1`}></i>
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-2">
        <div className="col-md-12">
          <div style={cardStyle}>
            <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-sliders me-2"></i>Custom Date Range</h5>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label text-white-50 small">Start Date</label>
                <input type="date" className="form-control bg-dark border-secondary text-white" id="reportStartDate" />
              </div>
              <div className="col-md-4">
                <label className="form-label text-white-50 small">End Date</label>
                <input type="date" className="form-control bg-dark border-secondary text-white" id="reportEndDate" />
              </div>
              <div className="col-md-4">
                <label className="form-label text-white-50 d-none d-md-block">&nbsp;</label>
                <div className="d-flex gap-2">
                  {formats.map((fmt) => (
                    <button
                      key={fmt.value}
                      className="btn flex-fill border-0 fw-semibold"
                      style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }}
                      onClick={async () => {
                        const sd = document.getElementById('reportStartDate').value;
                        const ed = document.getElementById('reportEndDate').value;
                        if (!sd || !ed) {
                          setMessage({ type: 'danger', text: 'Please select both start and end dates.' });
                          return;
                        }
                        setLoading(true);
                        try {
                          const res = await api.get(`/reports/custom/${fmt.value}?start_date=${sd}&end_date=${ed}`, { responseType: 'blob' });
                          const extMap = { pdf: 'pdf', excel: 'xlsx', csv: 'csv' };
                          const blob = new Blob([res.data]);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `custom_report_${sd}_to_${ed}.${extMap[fmt.value]}`;
                          a.click();
                          window.URL.revokeObjectURL(url);
                          setMessage({ type: 'success', text: 'Custom report downloaded' });
                        } catch {
                          setMessage({ type: 'danger', text: 'Failed to generate custom report' });
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <i className={`bi ${fmt.icon} me-1`}></i> {fmt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
