import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Submit from './pages/Submit';
import History from './pages/History';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSubmissions from './pages/AdminSubmissions';
import AdminReports from './pages/AdminReports';
import ControlPanel from './pages/ControlPanel';
import LiveDisplay from './pages/LiveDisplay';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { settings } = useTheme();

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const globalStyle = {
    fontFamily: settings.font_family || 'Inter, sans-serif',
    background: settings.background_color || '#1a1a2e',
    color: settings.text_color || '#ffffff',
    minHeight: '100vh'
  };

  const btnRadius = settings.button_style === 'pill' ? '50px' : settings.button_style === 'square' ? '0' : '10px';

  if (loading) {
    return (
      <div style={{ ...globalStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: '#e94560' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={globalStyle}>
      <style>{`
        :root {
          --bs-btn-border-radius: ${btnRadius};
          --bg-body: ${settings.background_color || '#1a1a2e'};
          --bg-card: ${settings.card_color || '#16213e'};
          --text-color: ${settings.text_color || '#ffffff'};
          --accent-color: ${settings.counter_color || '#e94560'};
          --border-color: ${settings.text_color === '#1a1a2e' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
        }
        body {
          font-family: ${settings.font_family || 'Inter, sans-serif'};
          background: var(--bg-body) !important;
          color: var(--text-color) !important;
          overflow-x: hidden;
        }
        .card { background: var(--bg-card) !important; }
        .table { --bs-table-bg: transparent; --bs-table-color: var(--text-color); }
        .page-container { background: var(--bg-body) !important; min-height: calc(100vh - 56px); padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        .card-custom { background: var(--bg-card) !important; border: 1px solid var(--border-color) !important; border-radius: 15px; }
        .modal-content-custom { background: var(--bg-card) !important; border: 1px solid var(--border-color) !important; border-radius: 15px; }
        .form-control-custom { background: ${settings.text_color === '#1a1a2e' ? '#f8f9fa' : '#1a1a2e'} !important; border-color: ${settings.text_color === '#1a1a2e' ? '#ddd' : '#444'} !important; color: var(--text-color) !important; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-body); }
        ::-webkit-scrollbar-thumb { background: var(--accent-color); border-radius: 4px; }
        .card .stat-number { font-size: clamp(1.2rem, 4vw, 2.5rem) !important; }
        .stat-number-admin { font-size: clamp(1rem, 3.5vw, 1.8rem) !important; }
        .total-electors-number { font-size: clamp(2rem, 8vw, 4rem) !important; }
        .live-count-number { font-size: clamp(2rem, 6vw, 3.5rem) !important; }
        .login-logo-circle { flex-shrink: 0; }
        .login-logo-img { flex-shrink: 0; }
        .navbar-logo { flex-shrink: 0; }
        .navbar-brand span { font-size: clamp(0.85rem, 2.5vw, 1.2rem) !important; }
        .dashboard-stats .col-md-3 { margin-bottom: 0.5rem; }
        @media (max-width: 768px) {
          .page-container { padding-left: 0.75rem !important; padding-right: 0.75rem !important; min-height: calc(100vh - 50px); }
          .card-custom { border-radius: 10px; }
          .modal-content-custom { border-radius: 10px; }
          h3.fw-bold { font-size: 1.25rem !important; }
          .table { font-size: 0.8rem; }
          .table td, .table th { white-space: nowrap; padding: 0.4rem 0.5rem; }
          .btn { font-size: 0.85rem !important; padding: 0.4rem 0.8rem !important; }
          .form-control, .form-select { font-size: 0.85rem !important; padding: 0.4rem 0.6rem !important; }
          .card-body.p-5 { padding: 1.5rem !important; }
          .card-body.p-4 { padding: 1rem !important; }
          div[class*="p-4"].card, div[class*="p-5"].card { padding: 1rem !important; }
        }
        @media (max-width: 480px) {
          .page-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
          h3.fw-bold { font-size: 1.1rem !important; }
          .table { font-size: 0.75rem; }
          .table td, .table th { padding: 0.3rem 0.4rem; }
          .d-flex.gap-2 { gap: 0.35rem !important; }
        }
      `}</style>

      <Routes>
        <Route path="/live-display" element={<LiveDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/submit" element={
          <ProtectedRoute>
            <Navbar />
            <Submit />
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <Navbar />
            <History />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <Navbar />
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly>
            <Navbar />
            <AdminUsers />
          </ProtectedRoute>
        } />

        <Route path="/admin/submissions" element={
          <ProtectedRoute adminOnly>
            <Navbar />
            <AdminSubmissions />
          </ProtectedRoute>
        } />

        <Route path="/admin/reports" element={
          <ProtectedRoute adminOnly>
            <Navbar />
            <AdminReports />
          </ProtectedRoute>
        } />

        <Route path="/admin/control-panel" element={
          <ProtectedRoute adminOnly>
            <Navbar />
            <ControlPanel />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to={user ? (isAdmin ? '/admin' : '/dashboard') : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
