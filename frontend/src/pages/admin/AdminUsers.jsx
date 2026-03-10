/**
 * AdminUsers.jsx — Admin: User Management sub-page
 *
 * Calls GET /api/users to list all system users.
 * Admin can create staff/cashier/delivery accounts and toggle user active status.
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

const roleBadge = { admin: 'badge-danger', staff: 'badge-info', cashier: 'badge-warning', delivery: 'badge-gold', customer: 'badge-success' };

function AdminUsers() {
  const { get, post, put, loading, error } = useApi();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', phone: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const data = await get('/api/users');
      setUsers(data.users || data.data || []);
    } catch {}
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await post('/api/users', form);
      setSuccess(`User "${form.name}" created as ${form.role}!`);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'staff', phone: '' });
      fetchUsers();
    } catch {}
    setSaving(false);
  }

  async function toggleStatus(userId, currentStatus) {
    try {
      await put(`/api/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch {}
  }

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <DashboardLayout title="User Management" navItems={NAV_ITEMS}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'admin', 'staff', 'cashier', 'delivery', 'customer'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              className={`btn btn-sm ${filter === r ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize' }}>
              {r}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add User'}
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {/* Create User Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px', color: 'var(--secondary)' }}>Create System User</h4>
          <form onSubmit={handleCreate}>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="John Doe"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="john@hotelceylon.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required minLength={6} placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="cashier">Cashier</option>
                  <option value="delivery">Delivery Person</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="tel" placeholder="+94 77 123 4567"
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '32px' }}>
                  No users found.
                </td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${roleBadge[u.role] || 'badge-info'}`} style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline"
                        onClick={() => toggleStatus(u._id, u.isActive)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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

export default AdminUsers;

