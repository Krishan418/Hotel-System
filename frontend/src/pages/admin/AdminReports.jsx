/**
 * AdminReports.jsx — Admin: Reports sub-page
 *
 * Shows key business metrics fetched from the API:
 *   - Room statistics (GET /api/rooms/stats)
 *   - Order statistics (GET /api/orders/stats)
 *   - Summary cards
 */

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';

const NAV_ITEMS = [
  { label: 'Overview',        to: '/admin',            icon: '📊', exact: true },
  { label: 'Room Management', to: '/admin/rooms',       icon: '🛏️' },
  { label: 'Wedding Mgmt',    to: '/admin/weddings',    icon: '💍' },
  { label: 'Restaurant',      to: '/admin/restaurant',  icon: '🍽️' },
  { label: 'Reports',         to: '/admin/reports',     icon: '📈' },
  { label: 'User Management', to: '/admin/users',       icon: '👥' },
];

function AdminReports() {
  const { get, loading } = useApi();
  const [roomStats,  setRoomStats]  = useState(null);
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const rs = await get('/api/rooms/stats');
        setRoomStats(rs.stats || rs.data || rs);
      } catch {}
      try {
        const os = await get('/api/orders/stats');
        setOrderStats(os.stats || os.data || os);
      } catch {}
    }
    load();
  }, []);

  return (
    <DashboardLayout title="Reports & Analytics" navItems={NAV_ITEMS}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>📊 Business Overview</h3>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
          Live data pulled from the database.
        </p>
      </div>

      {loading && <div className="loading-spinner"><div className="spinner" /></div>}

      {/* Room Stats */}
      <h4 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>🛏️ Room Statistics</h4>
      {roomStats ? (
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          {[
            { icon: '🏠', label: 'Total Rooms',     val: roomStats.total        ?? '—' },
            { icon: '✅', label: 'Available',        val: roomStats.available    ?? '—' },
            { icon: '🔴', label: 'Occupied',         val: roomStats.occupied     ?? '—' },
            { icon: '🔧', label: 'Maintenance',      val: roomStats.maintenance  ?? '—' },
            { icon: '📈', label: 'Occupancy Rate',   val: roomStats.occupancyRate != null ? `${roomStats.occupancyRate}%` : '—' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="alert alert-warning" style={{ marginBottom: '32px' }}>
          Room statistics unavailable — server may be offline.
        </div>
      )}

      {/* Order Stats */}
      <h4 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>🍽️ Order Statistics</h4>
      {orderStats ? (
        <div className="stats-grid">
          {[
            { icon: '📋', label: 'Total Orders',   val: orderStats.total     ?? '—' },
            { icon: '✅', label: 'Completed',       val: orderStats.completed ?? '—' },
            { icon: '⏳', label: 'Pending',         val: orderStats.pending   ?? '—' },
            { icon: '💰', label: 'Total Revenue',   val: orderStats.revenue != null ? `$${orderStats.revenue}` : '—' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div className="alert alert-warning">
          Order statistics unavailable — server may be offline.
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminReports;
