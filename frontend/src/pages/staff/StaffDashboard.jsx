/**
 * StaffDashboard.jsx
 *
 * Hotel staff portal. Staff can:
 *  - Check guests in
 *  - Check guests out
 *  - Manage current bookings
 */

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { label: 'Overview', to: '/staff', icon: '🏠', exact: true },
  { label: 'Check-In', to: '/staff/checkin', icon: '✅' },
  { label: 'Check-Out', to: '/staff/checkout', icon: '🚪' },
  { label: 'Bookings', to: '/staff/bookings', icon: '📋' },
];

// Mock bookings awaiting action
const pendingCheckIns = [
  { id: 'BK001', guest: 'Amara Silva', room: '201 – Deluxe', date: '2026-03-08', nights: 3 },
  { id: 'BK003', guest: 'Priya Nair', room: '105 – Standard', date: '2026-03-08', nights: 2 },
];

const currentGuests = [
  { id: 'BK009', guest: 'James Perera', room: '301 – Junior Suite', checkOut: '2026-03-10', nights: 2 },
  { id: 'BK010', guest: 'Ali Hassan', room: '509 – Presidential', checkOut: '2026-03-12', nights: 4 },
];

function StaffDashboard() {
  const [checkedIn, setCheckedIn] = useState([]);
  const [checkedOut, setCheckedOut] = useState([]);

  function doCheckIn(id) {
    setCheckedIn([...checkedIn, id]);
  }

  function doCheckOut(id) {
    setCheckedOut([...checkedOut, id]);
  }

  return (
    <DashboardLayout title="Staff Dashboard" navItems={NAV_ITEMS}>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { icon: '🛏️', value: '36', label: 'Occupied Rooms' },
          { icon: '✅', value: pendingCheckIns.length, label: 'Pending Check-Ins' },
          { icon: '🚪', value: currentGuests.length, label: 'Due Check-Outs' },
          { icon: '✨', value: '12', label: 'Rooms to Clean' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Check-Ins */}
      <h3 style={{ color: 'var(--secondary)', margin: '24px 0 16px' }}>📥 Pending Check-Ins Today</h3>
      <div className="table-wrapper" style={{ marginBottom: '32px' }}>
        <table>
          <thead>
            <tr>
              <th>Booking ID</th><th>Guest</th><th>Room</th><th>Date</th><th>Nights</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingCheckIns.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.id}</strong></td>
                <td>{b.guest}</td>
                <td>{b.room}</td>
                <td>{b.date}</td>
                <td>{b.nights}</td>
                <td>
                  {checkedIn.includes(b.id) ? (
                    <span className="badge badge-success">✓ Checked In</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => doCheckIn(b.id)}>
                      Check In
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current Guests / Check-Out */}
      <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>🚪 Due Check-Outs Today</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th><th>Guest</th><th>Room</th><th>Check-Out Date</th><th>Nights</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentGuests.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.id}</strong></td>
                <td>{b.guest}</td>
                <td>{b.room}</td>
                <td>{b.checkOut}</td>
                <td>{b.nights}</td>
                <td>
                  {checkedOut.includes(b.id) ? (
                    <span className="badge badge-success">✓ Checked Out</span>
                  ) : (
                    <button className="btn btn-danger btn-sm" onClick={() => doCheckOut(b.id)}>
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default StaffDashboard;
