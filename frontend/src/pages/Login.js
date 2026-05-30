import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getBaseUrl } from '../utils/api';

const Login = () => {
  const { settings } = useTheme();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      const isAdmin = data.user.role === 'admin' || data.user.role === 'super_admin';
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const isLight = settings.theme === 'light';
  const bgMain = isLight ? '#ffffff' : (settings.background_color || '#1a1a2e');
  const bgCard = isLight ? '#ffffff' : 'rgba(255,255,255,0.05)';
  const textColor = isLight ? '#1a1a2e' : '#ffffff';
  const textMuted = isLight ? '#666' : '#aaa';
  const inputBg = isLight ? '#f8f9fa' : '#1a1a2e';
  const inputBorder = isLight ? '#ddd' : '#444';
  const inputColor = isLight ? '#333' : '#fff';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${bgMain} 0%, ${isLight ? '#f0f0f0' : '#16213e'} 50%, ${isLight ? '#e8e8e8' : '#0f3460'} 100%)`, padding: '20px' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px', background: bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}` }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="login-logo-circle" style={{ width: 'clamp(50px, 10vw, 70px)', height: 'clamp(50px, 10vw, 70px)', background: settings.counter_color || '#e94560', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              {settings.logo ? (
                <img src={`${getBaseUrl()}/uploads/${settings.logo}`} alt="Logo" className="login-logo-img" style={{ height: 'clamp(28px, 5vw, 40px)', width: 'clamp(28px, 5vw, 40px)', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <i className="bi bi-bar-chart-fill text-white" style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}></i>
              )}
            </div>
            <h2 className="fw-bold" style={{ color: textColor }}>Welcome Back</h2>
            <p style={{ color: textMuted }}>Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger bg-danger bg-opacity-10 border border-danger text-danger small py-2">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Username</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}><i className="bi bi-person"></i></span>
                <input type="text" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Enter username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold" style={{ color: isLight ? '#555' : 'rgba(255,255,255,0.7)' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}><i className="bi bi-lock"></i></span>
                <input type="password" className="form-control" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }} placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn w-100 py-2 fw-bold border-0" disabled={loading} style={{ background: settings.counter_color || '#e94560', color: '#fff', borderRadius: '10px' }}>
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <span style={{ color: isLight ? '#888' : '#aaa' }}>Don't have an account? </span>
            <Link to="/register" className="fw-semibold" style={{ color: settings.counter_color || '#e94560', textDecoration: 'none' }}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
