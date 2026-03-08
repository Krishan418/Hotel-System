/**
 * CustomerBookings.jsx — Customer: My Bookings sub-page
 *
 * Fetches the logged-in customer's room + wedding bookings from the API.
 * Calls: GET /api/bookings  (backend filters to user's own bookings)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';

const NAV_ITEMS = [
  { label: 'My Overview',      to: '/customer',              icon: '🏠', exact: true },
  { label: 'Book a Room',      to: '/customer/book-room',    icon: '🛏️' },
  { label: 'Book Wedding Hall',to: '/customer/book-wedding', icon: '💍' },
  { label: 'Order Food',       to: '/customer/order-food',   icon: '🍽️' },
  { label: 'Book Pool',        to: '/customer/book-pool',    icon: '🏊' },
  { label: 'My Bookings',      to: '/customer/bookings',     icon: '📋' },
  { label: 'Payments',         to: '/customer/payments',     icon: '💳' },
  { label: 'Profile',          to: '/customer/profile',      icon: '👤' },
];

function statusBadge(s) {
  const m = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', completed: 'badge-info' };
  return m[s] || 'badge-info';
}

function CustomerBookings() {
  const { get, put, loading, error } = useApi();
  const [bookings, setBookings] = useState([]);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    try {
      const data = await get('/api/bookings');
      setBookings(data.bookings || data.data || []);
    } catch {}
  }

  async function handleCancel(id) {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await put(`/api/bookings/${id}/cancel`, {});
      fetchBookings();
    } catch {}
    setCancelling(null);
  }

  return (
    <DashboardLayout title="My Bookings" navItems={NAV_ITEMS}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--secondary)' }}>Room Bookings</h3>
        <Link to="/customer/book-room" className="btn btn-primary btn-sm">➕ Book a Room</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Booking ID</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Nights</th><th>Total</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>
                  No bookings yet. <Link to="/customer/book-room" style={{ color: 'var(--primary)' }}>Book your first room!</Link>
                </td></tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b._id?.slice(-6).toUpperCase()}</strong></td>
                    <td>{b.room?.roomNumber} — {b.room?.type}</td>
                    <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}</td>
                    <td>{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}</td>
                    <td>{b.numberOfNights ?? '—'}</td>
                    <td>${b.totalPrice ?? '—'}</td>
                    <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                    <td>
                      {b.status === 'pending' || b.status === 'confirmed' ? (
                        <button className="btn btn-danger btn-sm"
                          disabled={cancelling === b._id}
                          onClick={() => handleCancel(b._id)}>
                          {cancelling === b._id ? '…' : 'Cancel'}
                        </button>
                      ) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CustomerBookings;
