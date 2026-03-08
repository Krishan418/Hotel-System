/**
 * CustomerBookRoom.jsx — Customer: Book a Room sub-page
 *
 * This is the booking form. It:
 * 1. Searches for available rooms (GET /api/bookings/available?checkIn=&checkOut=)
 * 2. Lets the customer pick a room
 * 3. Confirms via POST /api/bookings
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';

const NAV_ITEMS = [
  { label: 'My Overview',       to: '/customer',              icon: '🏠', exact: true },
  { label: 'Book a Room',       to: '/customer/book-room',    icon: '🛏️' },
  { label: 'Book Wedding Hall', to: '/customer/book-wedding', icon: '💍' },
  { label: 'Order Food',        to: '/customer/order-food',   icon: '🍽️' },
  { label: 'Book Pool',         to: '/customer/book-pool',    icon: '🏊' },
  { label: 'My Bookings',       to: '/customer/bookings',     icon: '📋' },
  { label: 'Payments',          to: '/customer/payments',     icon: '💳' },
  { label: 'Profile',           to: '/customer/profile',      icon: '👤' },
];

// Today's date in YYYY-MM-DD format (minimum date for date inputs)
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

function CustomerBookRoom() {
  const { get, post, loading, error } = useApi();
  const [checkIn, setCheckIn]   = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState(null); // null = not searched yet
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null); // confirmed booking result
  const [searching, setSearching] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function searchRooms(e) {
    e.preventDefault();
    setSearching(true);
    setSelected(null);
    setAvailableRooms(null);
    try {
      const data = await get(`/api/bookings/available?checkIn=${checkIn}&checkOut=${checkOut}`);
      setAvailableRooms(data.rooms || data.data || []);
    } catch {}
    setSearching(false);
  }

  async function confirmBooking() {
    if (!selected) return;
    setConfirming(true);
    try {
      const data = await post('/api/bookings', {
        room: selected._id,
        checkIn,
        checkOut,
        numberOfGuests: guests,
      });
      setBooking(data.booking || data.data);
    } catch {}
    setConfirming(false);
  }

  // ── Success screen ──
  if (booking) {
    return (
      <DashboardLayout title="Book a Room" navItems={NAV_ITEMS}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: 'var(--secondary)' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--gray-600)', margin: '12px 0 8px' }}>
            <strong>Room:</strong> {booking.room?.roomNumber || selected?.roomNumber}
          </p>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
            <strong>Total:</strong> ${booking.totalPrice}
          </p>
          <Link to="/customer/bookings" className="btn btn-primary">View My Bookings</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Book a Room" navItems={NAV_ITEMS}>
      {/* Search Form */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '20px' }}>🔍 Find Available Rooms</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={searchRooms}>
          <div className="grid-3">
            <div className="form-group">
              <label>Check-In Date</label>
              <input type="date" min={today} required
                value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Check-Out Date</label>
              <input type="date" min={checkIn || today} required
                value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Guests</label>
              <input type="number" min="1" max="10" value={guests}
                onChange={e => setGuests(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={searching || loading}>
            {searching ? 'Searching…' : 'Search Rooms'}
          </button>
        </form>
      </div>

      {/* Results */}
      {availableRooms !== null && (
        <div>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>
            {availableRooms.length > 0
              ? `✅ ${availableRooms.length} Room(s) Available`
              : '❌ No rooms available for these dates'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {availableRooms.map(room => (
              <div key={room._id} className="card"
                style={{ cursor: 'pointer', border: selected?._id === room._id ? '2px solid var(--primary)' : '1px solid var(--gray-200)' }}
                onClick={() => setSelected(room)}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛏️</div>
                <h4 style={{ color: 'var(--secondary)' }}>Room {room.roomNumber}</h4>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{room.type}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>${room.pricePerNight}<span style={{ color: 'var(--gray-500)', fontWeight: 400, fontSize: '0.8rem' }}>/night</span></p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Up to {room.capacity} guests</p>
                {selected?._id === room._id && <div style={{ marginTop: '8px' }}><span className="badge badge-success">✓ Selected</span></div>}
              </div>
            ))}
          </div>

          {selected && (
            <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
              <h4 style={{ marginBottom: '12px', color: 'var(--secondary)' }}>Confirm Your Booking</h4>
              <p>Room <strong>{selected.roomNumber}</strong> ({selected.type}) • {checkIn} → {checkOut} • {guests} guest(s)</p>
              <p style={{ marginTop: '8px' }}>
                Estimated Total: <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>
                  ${selected.pricePerNight * Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)}
                </strong>
              </p>
              <button className="btn btn-primary" style={{ marginTop: '16px' }}
                onClick={confirmBooking} disabled={confirming}>
                {confirming ? 'Confirming…' : '✅ Confirm Booking'}
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default CustomerBookRoom;
