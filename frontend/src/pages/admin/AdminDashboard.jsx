/**
 * AdminDashboard.jsx
 *
 * Admin-only dashboard. Shows:
 *  - Stats overview
 *  - Quick links to admin sub-sections
 *
 * The sidebar uses DashboardLayout which renders for all dashboards.
 * Admin can manage Rooms, Weddings, Restaurant, Users, and view Reports.
 */

import DashboardLayout from '../../components/DashboardLayout';

// Sidebar nav items for the Admin
const NAV_ITEMS = [
  { label: 'Overview', to: '/admin', icon: '📊', exact: true },
  { label: 'Room Management', to: '/admin/rooms', icon: '🛏️' },
  { label: 'Wedding Management', to: '/admin/weddings', icon: '💍' },
  { label: 'Restaurant', to: '/admin/restaurant', icon: '🍽️' },
  { label: 'Reports', to: '/admin/reports', icon: '📈' },
  { label: 'User Management', to: '/admin/users', icon: '👥' },
];

// Quick stats shown on the overview page
const stats = [
  { icon: '🛏️', value: '48', label: 'Total Rooms' },
  { icon: '✅', value: '36', label: 'Occupied Rooms' },
  { icon: '📦', value: '12', label: 'Pending Bookings' },
  { icon: '💰', value: '$8,420', label: "Today's Revenue" },
  { icon: '👥', value: '124', label: 'Total Customers' },
  { icon: '🎉', value: '3', label: 'Events Today' },
];

// Recent bookings mock data — will come from API later
const recentBookings = [
  { id: 'BK001', guest: 'Amara Silva', room: 'Deluxe Room', checkIn: '2026-03-08', status: 'confirmed' },
  { id: 'BK002', guest: 'James Perera', room: 'Junior Suite', checkIn: '2026-03-09', status: 'pending' },
  { id: 'BK003', guest: 'Priya Nair', room: 'Standard Room', checkIn: '2026-03-10', status: 'confirmed' },
  { id: 'BK004', guest: 'Ali Hassan', room: 'Presidential Suite', checkIn: '2026-03-10', status: 'cancelled' },
];

// Map status string to badge class
function statusBadge(status) {
  const map = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger' };
  return map[status] || 'badge-info';
}

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Overview" navItems={NAV_ITEMS}>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>Recent Bookings</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room Type</th>
                <th>Check-In Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.id}</strong></td>
                  <td>{b.guest}</td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>Quick Actions</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: '➕ Add Room', bg: 'var(--secondary)' },
          { label: '📋 View Reports', bg: 'var(--primary)' },
          { label: '👤 Manage Users', bg: 'var(--success)' },
          { label: '🎉 Add Event', bg: 'var(--info)' },
        ].map((a) => (
          <button
            key={a.label}
            className="btn"
            style={{ background: a.bg, color: '#fff', border: 'none' }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
