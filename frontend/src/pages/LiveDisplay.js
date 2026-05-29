import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { getBaseUrl } from '../utils/api';
import { subscribeToCounter } from '../utils/socketHelper';

const LiveDisplay = () => {
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useState({
    logo: null,
    header_text: 'KOYE FACHE PROSPERITY PARTY',
    subtitle_text: 'LIVE ELECTORS COUNT',
    footer_text: 'Developed By Amanuel ICT Solution',
    footer_enabled: 1,
    counter_color: '#e94560',
    counter_size: '120px',
    screen_background: '#ffffff',
    background_color: '#ffffff',
    header_color: '#e94560',
    header_font_size: '48px',
    header_font_style: 'Arial',
    font_family: 'Arial'
  });
  const [displayCount, setDisplayCount] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sRes, cRes] = await Promise.all([
          api.get('/settings'),
          api.get('/electors/live-total')
        ]);
        setSettings(sRes.data);
        setCount(Number(cRes.data.totalApprovedElectors) || 0);
        setDisplayCount(Number(cRes.data.totalApprovedElectors) || 0);
      } catch { }
    };
    loadData();
  }, []);

  useEffect(() => {
    const cleanup = subscribeToCounter((newCount) => {
      setCount(newCount);
      animateCount(newCount);
    });
    return cleanup;
  }, []);

  const animateCount = (target) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const start = displayCount;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      setDisplayCount(current);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const displayStyle = {
    background: `linear-gradient(135deg, ${settings.screen_background || '#0f3460'} 0%, ${settings.background_color || '#1a1a2e'} 100%)`,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: settings.font_family || 'Arial, sans-serif',
    overflow: 'hidden',
    position: 'relative'
  };

  return (
    <div style={displayStyle}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: settings.counter_color || '#e94560', animation: 'pulse 2s infinite' }}></div>

      <div className="text-center px-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {settings.logo && (
          <div className="mb-4" style={{ animation: 'fadeInDown 1s ease' }}>
            <img
              src={`${getBaseUrl()}/uploads/${settings.logo}`}
              alt="Party Logo"
              style={{ maxHeight: '150px', maxWidth: '300px', objectFit: 'contain', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
            />
          </div>
        )}

        <h1 style={{
          fontSize: settings.header_font_size || '48px',
          color: settings.header_color || '#ffffff',
          fontFamily: settings.header_font_style || 'Arial',
          fontWeight: '800',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          marginBottom: '20px',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          animation: 'fadeInDown 1s ease'
        }}>
          {settings.header_text || 'LIVE ELECTORS COUNT'}
        </h1>

        <div style={{
          fontSize: settings.counter_size || '120px',
          fontWeight: '900',
          color: settings.counter_color || '#e94560',
          lineHeight: 1.1,
          fontFamily: 'monospace',
          textShadow: `0 0 40px ${settings.counter_color || '#e94560'}40, 0 4px 20px rgba(0,0,0,0.3)`,
          animation: 'fadeInUp 1s ease, pulse 2s infinite',
          marginBottom: '10px',
          letterSpacing: '4px',
          padding: '0 20px'
        }}>
          {displayCount?.toLocaleString() ?? 0}
        </div>

        <div style={{
          fontSize: '28px',
          color: settings.header_color || '#ffffff',
          fontWeight: '600',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          opacity: 0.8,
          animation: 'fadeInUp 1.5s ease'
        }}>
          {settings.subtitle_text || 'TOTAL ELECTORS'}
        </div>
      </div>

      {settings.footer_enabled !== 0 && (
        <div style={{
          padding: '20px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '16px',
          textAlign: 'center',
          animation: 'fadeIn 2s ease'
        }}>
          {settings.footer_text || 'Developed By Amanuel ICT Solution'}
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

export default LiveDisplay;
