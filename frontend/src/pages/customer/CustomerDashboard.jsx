/**
 * CustomerDashboard.jsx
 *
 * Customer portal. A logged-in customer can:
 *  - Book rooms, wedding halls, pool slots
 *  - Order food
 *  - View their bookings and payments
 *  - Edit their profile
 */

import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'My Overview', to: '/customer', icon: '🏠', exact: true },
  { label: 'Book a Room', to: '/customer/book-room', icon: '🛏️' },
  { label: 'Book Wedding Hall', to: '/customer/book-wedding', icon: '💍' },
  { label: 'Order Food', to: '/customer/order-food', icon: '🍽️' },
  { label: 'Book Pool', to: '/customer/book-pool', icon: '🏊' },
  { label: 'My Bookings', to: '/customer/bookings', icon: '📋' },
  { label: 'Payments', to: '/customer/payments', icon: '💳' },
  { label: 'Profile', to: '/customer/profile', icon: '👤' },
];

// Mock: customer's recent bookings
const myBookings = [
  { id: 'BK001', type: 'Room', detail: 'Deluxe Room', date: '2026-03-08', status: 'confirmed', amount: 200 },
  { id: 'BK002', type: 'Pool', detail: 'Evening Session', date: '2026-03-09', status: 'confirmed', amount: 25 },
  { id: 'ORD01', type: 'Food', detail: 'Grilled Wagyu + Dessert', date: '2026-03-07', status: 'delivered', amount: 79 },
];

function statusBadge(status) {
  const map = { confirmed: 'badge-success', pending: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };
  return map[status] || 'badge-info';
}

function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="My Dashboard" navItems={NAV_ITEMS}>

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: 'var(--white)',
        marginBottom: '24px',
      }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>
          Welcome back, {user?.name || 'Guest'}! 👋
        </h3>
        <p style={{ opacity: 0.8, fontSize: '0.92rem' }}>
          Manage all your bookings and orders from one place.
        </p>
      </div>

      {/* Quick Booking Actions */}
      <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>Quick Book</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { icon: '🛏️', label: 'Book a Room', color: 'var(--secondary)' },
          { icon: '💍', label: 'Wedding Hall', color: '#8e44ad' },
          { icon: '🍽️', label: 'Order Food', color: 'var(--danger)' },
          { icon: '🏊', label: 'Pool Session', color: 'var(--info)' },
        ].map((item) => (
          <div key={item.label} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--gray-700)' }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* My Recent Bookings */}
      <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>My Recent Bookings</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Details</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td><span className="badge badge-info">{b.type}</span></td>
                <td>{b.detail}</td>
                <td>{b.date}</td>
                <td>${b.amount}</td>
                <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default CustomerDashboard;
