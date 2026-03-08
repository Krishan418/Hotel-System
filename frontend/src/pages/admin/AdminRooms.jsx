/**
 * AdminRooms.jsx — Admin: Room Management sub-page
 *
 * Calls GET /api/rooms to list all rooms.
 * Admin can see all rooms and their status.
 * (Create/Edit/Delete forms are ready for future enhancement.)
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

function statusBadge(status) {
  const map = { available: 'badge-success', occupied: 'badge-danger', maintenance: 'badge-warning', reserved: 'badge-info' };
  return map[status] || 'badge-info';
}

function AdminRooms() {
  const { get, loading, error } = useApi();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ roomNumber: '', type: 'standard', capacity: 2, pricePerNight: '' });
  const { post } = useApi();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const data = await get('/api/rooms');
      setRooms(data.rooms || data.data || []);
    } catch {}
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await post('/api/rooms', form);
      setSuccess('Room created successfully!');
      setShowForm(false);
      fetchRooms();
    } catch {}
    setSaving(false);
  }

  return (
    <DashboardLayout title="Room Management" navItems={NAV_ITEMS}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: 'var(--secondary)' }}>All Rooms</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Room'}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {/* Add Room Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--secondary)' }}>Create New Room</h4>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group">
                <label>Room Number</label>
                <input type="text" placeholder="e.g. 101" required
                  value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential</option>
                  <option value="family">Family</option>
                </select>
              </div>
              <div className="form-group">
                <label>Capacity (guests)</label>
                <input type="number" min="1" max="10" value={form.capacity}
                  onChange={e => setForm({...form, capacity: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price Per Night ($)</label>
                <input type="number" min="0" required placeholder="e.g. 150"
                  value={form.pricePerNight} onChange={e => setForm({...form, pricePerNight: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create Room'}
            </button>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Room #</th><th>Type</th><th>Capacity</th><th>Price/Night</th><th>Status</th><th>Floor</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '32px' }}>
                  No rooms found. Create your first room above.
                </td></tr>
              ) : (
                rooms.map((r) => (
                  <tr key={r._id}>
                    <td><strong>{r.roomNumber}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                    <td>{r.capacity} guests</td>
                    <td>${r.pricePerNight}</td>
                    <td><span className={`badge ${statusBadge(r.status)}`}>{r.status}</span></td>
                    <td>{r.floor || '—'}</td>
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

export default AdminRooms;
