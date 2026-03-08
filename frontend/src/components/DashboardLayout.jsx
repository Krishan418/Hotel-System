/**
 * DashboardLayout.jsx
 *
 * A reusable layout wrapper for all dashboard pages.
 * It renders the sidebar (left) + content area (right).
 *
 * Props:
 *   - title: string  → shown in the top header
 *   - navItems: array → [{ label, to, icon }] for sidebar links
 *   - children: any  → the actual page content
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardLayout({ title, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">🏨 LuxeHotel</div>

        {/* Role badge */}
        <div style={{ padding: '0 24px', marginBottom: '12px' }}>
          <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
            {user?.role} Panel
          </span>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.exact}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer: user info + logout */}
        <div className="sidebar-footer">
          <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginBottom: '8px' }}>
            Signed in as<br />
            <strong style={{ color: 'var(--white)' }}>{user?.name || user?.email}</strong>
          </p>
          <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="dashboard-content">
        {/* Top header bar */}
        <div className="dashboard-header">
          <h2>{title}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
            Welcome, {user?.name || 'User'} 👋
          </span>
        </div>

        {/* Page body */}
        <div className="dashboard-body">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
