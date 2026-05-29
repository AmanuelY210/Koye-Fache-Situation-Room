import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { getBaseUrl } from '../utils/api';

const ControlPanel = () => {
  const { settings, loadSettings } = useTheme();
  const [form, setForm] = useState({ ...settings });
  const [message, setMessage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const handleUpdate = async (field, value) => {
    try {
      await api.put('/settings', { [field]: value });
      await loadSettings();
    } catch { }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', form);
      await loadSettings();
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Save failed' });
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    const fd = new FormData();
    fd.append('logo', logoFile);
    try {
      await api.post('/settings/logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      await loadSettings();
      setLogoFile(null);
      setMessage({ type: 'success', text: 'Logo updated!' });
    } catch (err) {
      setMessage({ type: 'danger', text: 'Logo upload failed' });
    }
  };

  const handleRemoveLogo = async () => {
    try {
      await api.delete('/settings/logo');
      await loadSettings();
    } catch { }
  };

  const sectionStyle = {
    background: 'var(--bg-card)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '24px'
  };

  const inputStyle = { background: 'var(--bg-body)', borderColor: 'var(--border-color)', color: 'var(--text-color)' };

  return (
    <div className="container-fluid p-4 page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>Control Panel</h3>
          <p className="text-secondary mb-0 small">Customize website appearance and settings</p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type} small py-2 mb-4`} style={{ background: message.type === 'success' ? 'rgba(40,167,69,0.1)' : 'rgba(220,53,69,0.1)', border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`, color: message.type === 'success' ? '#28a745' : '#dc3545' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="row g-4">
          <div className="col-md-6">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-image me-2"></i>Logo Management</h5>
              {settings.logo && (
                <div className="mb-3 text-center">
                  <img src={`${getBaseUrl()}/uploads/${settings.logo}`} alt="Logo" style={{ maxHeight: '80px', maxWidth: '200px' }} className="mb-2" />
                  <button type="button" className="btn btn-sm btn-outline-danger d-block mx-auto" onClick={handleRemoveLogo}>Remove Logo</button>
                </div>
              )}
              <div className="input-group">
                <input type="file" className="form-control" style={inputStyle} onChange={(e) => setLogoFile(e.target.files[0])} />
                <button type="button" className="btn" style={{ background: '#e94560', color: '#fff' }} onClick={handleLogoUpload}>Upload</button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-type me-2"></i>Header Settings</h5>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Header Text</label>
                <input type="text" className="form-control" style={inputStyle} value={form.header_text} onChange={(e) => setForm({ ...form, header_text: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Subtitle Text</label>
                <input type="text" className="form-control" style={inputStyle} value={form.subtitle_text} onChange={(e) => setForm({ ...form, subtitle_text: e.target.value })} />
              </div>
              <div className="row g-2">
                <div className="col-4">
                  <label className="form-label text-white-50 small">Font Size</label>
                  <input type="text" className="form-control" style={inputStyle} value={form.header_font_size} onChange={(e) => setForm({ ...form, header_font_size: e.target.value })} />
                </div>
                <div className="col-4">
                  <label className="form-label text-white-50 small">Font Family</label>
                  <input type="text" className="form-control" style={inputStyle} value={form.header_font_style} onChange={(e) => setForm({ ...form, header_font_style: e.target.value })} />
                </div>
                <div className="col-4">
                  <label className="form-label text-white-50 small">Color</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.header_color} onChange={(e) => setForm({ ...form, header_color: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-window-stack me-2"></i>Footer Settings</h5>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Footer Text</label>
                <input type="text" className="form-control" style={inputStyle} value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Phone Number 1</label>
                <input type="text" className="form-control" style={inputStyle} value={form.phone1 || ''} onChange={(e) => setForm({ ...form, phone1: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white-50 small">Phone Number 2</label>
                <input type="text" className="form-control" style={inputStyle} value={form.phone2 || ''} onChange={(e) => setForm({ ...form, phone2: e.target.value })} />
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="footerEnabled" checked={form.footer_enabled === 1 || form.footer_enabled === true} onChange={(e) => setForm({ ...form, footer_enabled: e.target.checked ? 1 : 0 })} />
                <label className="form-check-label text-white-50 small" htmlFor="footerEnabled">Footer Enabled</label>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-palette me-2"></i>Theme Settings</h5>
              <div className="row g-2">
                <div className="col-4">
                  <label className="form-label text-white-50 small">Theme</label>
                  <select className="form-select" style={inputStyle} value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label text-white-50 small">Background</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.background_color} onChange={(e) => setForm({ ...form, background_color: e.target.value })} />
                </div>
                <div className="col-4">
                  <label className="form-label text-white-50 small">Text Color</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} />
                </div>
                <div className="col-4 mt-2">
                  <label className="form-label text-white-50 small">Card Color</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.card_color} onChange={(e) => setForm({ ...form, card_color: e.target.value })} />
                </div>
                <div className="col-4 mt-2">
                  <label className="form-label text-white-50 small">Font Family</label>
                  <select className="form-select" style={inputStyle} value={form.font_family} onChange={(e) => setForm({ ...form, font_family: e.target.value })}>
                    <option value="Arial">Arial</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
                <div className="col-4 mt-2">
                  <label className="form-label text-white-50 small">Button Style</label>
                  <select className="form-select" style={inputStyle} value={form.button_style} onChange={(e) => setForm({ ...form, button_style: e.target.value })}>
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                    <option value="pill">Pill</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-tv me-2"></i>Live Display Settings</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Counter Size</label>
                  <input type="text" className="form-control" style={inputStyle} value={form.counter_size} onChange={(e) => setForm({ ...form, counter_size: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Counter Color</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.counter_color} onChange={(e) => setForm({ ...form, counter_color: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Screen Background</label>
                  <input type="color" className="form-control form-control-color" style={inputStyle} value={form.screen_background} onChange={(e) => setForm({ ...form, screen_background: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Layout</label>
                  <select className="form-select" style={inputStyle} value={form.layout} onChange={(e) => setForm({ ...form, layout: e.target.value })}>
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div style={sectionStyle}>
              <h5 className="fw-bold mb-3" style={{ color: '#e94560' }}><i className="bi bi-clock me-2"></i>Countdown Settings</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="form-check form-switch mt-2">
                    <input className="form-check-input" type="checkbox" role="switch" id="countdownEnabled" checked={form.countdown_enabled === 1 || form.countdown_enabled === true} onChange={(e) => setForm({ ...form, countdown_enabled: e.target.checked ? 1 : 0 })} />
                    <label className="form-check-label text-white-50 small" htmlFor="countdownEnabled">Enable Countdown</label>
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label text-white-50 small">Title</label>
                  <input type="text" className="form-control" style={inputStyle} value={form.countdown_title || 'Days Left'} onChange={(e) => setForm({ ...form, countdown_title: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-white-50 small">Target Date</label>
                  <input type="datetime-local" className="form-control" style={inputStyle} value={form.countdown_target_date ? form.countdown_target_date.substring(0, 16) : ''} onChange={(e) => setForm({ ...form, countdown_target_date: e.target.value ? e.target.value + ':00' : null })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-lg px-5 py-2 fw-bold border-0" style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }}>
            <i className="bi bi-check2-circle me-2"></i>Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControlPanel;
