import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Submit = () => {
  const [form, setForm] = useState({ elector_number: '', description: '', attachment: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('elector_number', form.elector_number);
      fd.append('description', form.description);
      if (form.attachment) fd.append('attachment', form.attachment);
      await api.post('/electors', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage({ type: 'success', text: 'Submission successful!' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card-custom border-0 shadow-lg">
            <div className="card-body p-5">
              <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Submit Electors Count</h3>
              <p className="text-secondary small mb-4">Enter the electors number and details below</p>

              {message && (
                <div className={`alert alert-${message.type} small py-2`} style={{ background: message.type === 'success' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`, color: message.type === 'success' ? '#28a745' : '#dc3545' }}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-semibold">Electors Number *</label>
                  <input type="number" className="form-control bg-dark border-secondary text-white form-control-lg" placeholder="Enter number of electors" value={form.elector_number} onChange={(e) => setForm({ ...form, elector_number: e.target.value })} required min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label text-white-50 small fw-semibold">Description / Remark</label>
                  <textarea className="form-control bg-dark border-secondary text-white" rows="3" placeholder="Optional description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="mb-4">
                  <label className="form-label text-white-50 small fw-semibold">Attachment (optional)</label>
                  <input type="file" className="form-control bg-dark border-secondary text-white" onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })} />
                </div>
                <button type="submit" className="btn w-100 py-2 fw-bold border-0" disabled={loading} style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  <i className="bi bi-send-fill me-2"></i>Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;
