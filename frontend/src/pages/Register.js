import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
  const { settings } = useTheme();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', phone: '', election_location: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isLight = settings.theme === 'light';
  const bgMain = isLight ? '#ffffff' : (settings.background_color || '#1a1a2e');
  const bgCard = isLight ? '#ffffff' : 'rgba(255,255,255,0.05)';
  const textColor = isLight ? '#1a1a2e' : '#ffffff';
  const textMuted = isLight ? '#666' : '#aaa';
  const inputBg = isLight ? '#f8f9fa' : '#1a1a2e';
  const inputBorder = isLight ? '#ddd' : '#444';
  const inputColor = isLight ? '#333' : '#fff';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        phone: form.phone,
        election_location: form.election_location,
        password: form.password
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${bgMain} 0%, ${isLight ? '#f0f0f0' : '#16213e'} 50%, ${isLight ? '#e8e8e8' : '#0f3460'} 100%)`, padding: '20px' }}>
        <div className="card border-0 shadow-lg" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px', background: bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}` }}>
          <div className="card-body p-5 text-center">
            <div style={{ width: '70px', height: '70px', background: '#28a745', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <i className="bi bi-check-lg fs-1 text-white"></i>
            </div>
            <h3 className="fw-bold mb-3" style={{ color: textColor }}>Registration Successful!</h3>
            <p style={{ color: textMuted }} className="mb-4">Your account has been created and is pending approval. You will be able to login once an admin approves your account.</p>
            <Link to="/login" className="btn py-2 px-4 fw-bold border-0" style={{ background: settings.counter_color || '#e94560', color: '#fff', borderRadius: '10px' }}>Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${bgMain} 0%, ${isLight ? '#f0f0f0' : '#16213e'} 50%, ${isLight ? '#e8e8e8' : '#0f3460'} 100%)`, padding: '20px' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '20px', background: bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}` }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div style={{ width: '70px', height: '70px', background: settings.counter_color || '#e94560', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              {settings.logo ? (
                <img src={`http://localhost:5000/uploads/${settings.logo}`} alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="bi bi-person-plus fs-1 text-white"></i>
              )}
            </div>
            <h2 className="fw-bold" style={{ color: textColor }}>Create Account</h2>
            <p style={{ color: textMuted }}>Register for an account</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-danger bg-opacity-10 border border-danger text-danger small py-2">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Full Name</label>
                <input type="text" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Username</label>
                <input type="text" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Email</label>
                <input type="email" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Phone Number</label>
                <input type="text" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Election Location</label>
              <input type="text" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Election Location" value={form.election_location} onChange={(e) => setForm({ ...form, election_location: e.target.value })} />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Password</label>
                <input type="password" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Confirm Password</label>
                <input type="password" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Confirm Password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} required minLength={6} />
              </div>
            </div>
            <button type="submit" className="btn w-100 py-2 fw-bold border-0 mt-2" disabled={loading} style={{ background: settings.counter_color || '#e94560', color: '#fff', borderRadius: '10px' }}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              Register
            </button>
          </form>

          <div className="text-center mt-4">
            <span style={{ color: isLight ? '#888' : '#aaa' }}>Already have an account? </span>
            <Link to="/login" className="fw-semibold" style={{ color: settings.counter_color || '#e94560', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
