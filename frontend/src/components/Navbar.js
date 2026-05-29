import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getBaseUrl } from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const navStyle = {
    background: settings.theme === 'dark' ? (settings.background_color || '#1a1a2e') : '#ffffff',
    borderBottom: `2px solid ${settings.counter_color || '#e94560'}`
  };

  const linkStyle = {
    color: settings.theme === 'dark' ? (settings.text_color || '#ffffff') : '#333333'
  };

  const activeLinkStyle = {
    ...linkStyle,
    borderBottom: `2px solid ${settings.counter_color || '#e94560'}`
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={navStyle}>
      <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to={isAdmin ? '/admin' : '/dashboard'} style={{ color: settings.text_color || '#fff', fontSize: '1.2rem' }}>
            {settings.logo ? (
              <img src={`${getBaseUrl()}/uploads/${settings.logo}`} alt="Logo" style={{ height: '35px' }} />
            ) : (
              <i className="bi bi-bar-chart-fill fs-4" style={{ color: settings.counter_color || '#e94560' }}></i>
            )}
            <span>Koye Fache Prosperity Party</span>
          </Link>
        <button className="navbar-toggler border-0" type="button" onClick={() => setExpanded(!expanded)} style={{ color: settings.text_color }}>
          <i className="bi bi-list fs-3"></i>
        </button>
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {user && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/submit" style={location.pathname === '/submit' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-plus-circle me-1"></i>Submit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/history" style={location.pathname === '/history' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-clock-history me-1"></i>History
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin" style={location.pathname === '/admin' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-grid-fill me-1"></i>Admin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users" style={location.pathname === '/admin/users' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-people-fill me-1"></i>Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/submissions" style={location.pathname === '/admin/submissions' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-file-earmark-text me-1"></i>Submissions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/reports" style={location.pathname === '/admin/reports' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-bar-chart-fill me-1"></i>Reports
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/control-panel" style={location.pathname === '/admin/control-panel' ? activeLinkStyle : linkStyle}>
                    <i className="bi bi-gear-fill me-1"></i>Control Panel
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item dropdown ms-lg-2">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" style={linkStyle}>
                  <i className="bi bi-person-circle me-1"></i>{user.full_name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
