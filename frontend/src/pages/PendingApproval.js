import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const PendingApproval = () => {
  const { settings } = useTheme();
  const isLight = settings.theme === 'light';
  const bgMain = isLight ? '#ffffff' : (settings.background_color || '#1a1a2e');
  const bgCard = isLight ? '#ffffff' : 'rgba(255,255,255,0.05)';
  const textColor = isLight ? '#1a1a2e' : '#ffffff';
  const textMuted = isLight ? '#666' : '#aaa';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${bgMain} 0%, ${isLight ? '#f0f0f0' : '#16213e'} 50%, ${isLight ? '#e8e8e8' : '#0f3460'} 100%)`, padding: '20px' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '20px', background: bgCard, backdropFilter: 'blur(20px)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'}` }}>
        <div className="card-body p-5 text-center">
          <div className="login-logo-circle" style={{ width: 'clamp(60px, 12vw, 80px)', height: 'clamp(60px, 12vw, 80px)', background: '#ffc107', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <i className="bi bi-hourglass-split text-dark" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}></i>
          </div>
          <h3 className="fw-bold mb-3" style={{ color: textColor }}>Account Pending Approval</h3>
          <p style={{ color: textMuted }} className="mb-4">Your account is currently pending approval from the administrator. You will be able to submit electors numbers once your account is approved. Please check back later.</p>
          <Link to="/login" className="btn py-2 px-4 fw-bold border-0" style={{ background: settings.counter_color || '#e94560', color: '#fff', borderRadius: '10px' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
