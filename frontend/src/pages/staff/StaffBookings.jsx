/**
 * StaffBookings.jsx — Staff: All Bookings sub-page
 *
 * Staff can see all bookings and perform check-in/check-out actions.
 * Calls: GET /api/bookings (backend returns all when role is staff/admin)
 */

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';

const NAV_ITEMS = [
  { label: 'Overview',    to: '/staff',            icon: '🏠', exact: true },
  { label: 'Check-In',   to: '/staff/checkin',     icon: '✅' },
  { label: 'Check-Out',  to: '/staff/checkout',    icon: '🚪' },
  { label: 'All Bookings', to: '/staff/bookings', icon: '📋' },
];

function statusBadge(s) {
  const m = { confirmed: 'badge-success', pending: 'badge-warning', cancelled: 'badge-danger', checked_in: 'badge-info', checked_out: 'badge-gold', completed: 'badge-success' };
  return m[s] || 'badge-info';
}

function StaffBookings() {
  const { get, put, loading, error } = useApi();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [actioning, setActioning] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    try {
      const data = await get('/api/bookings');
      setBookings(data.bookings || data.data || []);
    } catch {}
  }

  async function doAction(id, action) {
    setActioning(id + action);
    try {
      await put(`/api/bookings/${id}/${action}`, {});
      fetchBookings();
    } catch {}
    setActioning(null);
  }

  const filtered = filter === 'all' ? bookings
    : bookings.filter(b => b.status === filter);

  return (
    <DashboardLayout title="All Bookings" navItems={NAV_ITEMS}>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'confirmed', 'pending', 'checked_in', 'checked_out', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}>
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Guests</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>No bookings found.</td></tr>
              ) : (
                filtered.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b._id?.slice(-6).toUpperCase()}</strong></td>
                    <td>{b.guest?.name || b.user?.name || '—'}</td>
                    <td>{b.room?.roomNumber} — {b.room?.type}</td>
                    <td>{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}</td>
                    <td>{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}</td>
                    <td>{b.numberOfGuests}</td>
                    <td><span className={`badge ${statusBadge(b.status)}`}>{b.status?.replace('_',' ')}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {b.status === 'confirmed' && (
                          <button className="btn btn-primary btn-sm"
                            disabled={actioning === b._id + 'checkin'}
                            onClick={() => doAction(b._id, 'checkin')}>
                            Check In
                          </button>
                        )}
                        {b.status === 'checked_in' && (
                          <button className="btn btn-danger btn-sm"
                            disabled={actioning === b._id + 'checkout'}
                            onClick={() => doAction(b._id, 'checkout')}>
                            Check Out
                          </button>
                        )}
                        {!['confirmed','checked_in'].includes(b.status) && <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>—</span>}
                      </div>
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

export default StaffBookings;
