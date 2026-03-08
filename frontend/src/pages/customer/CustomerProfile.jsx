/**
 * CustomerProfile.jsx — Customer: Profile sub-page
 *
 * Loads user info and allows editing name, phone, address.
 * Calls: PUT /api/auth/me
 */

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';

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

function CustomerProfile() {
  const { user, login, token } = useAuth();
  const { put, loading, error } = useApi();

  const [form, setForm] = useState({
    name:    user?.name    || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });
  const [success, setSuccess] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  async function handleProfileSave(e) {
    e.preventDefault();
    setSuccess('');
    try {
      const data = await put('/api/auth/me', form);
      // Update auth context with fresh user data
      login(data.user, token);
      setSuccess('Profile updated successfully!');
    } catch {}
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    try {
      await put('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch {}
  }

  return (
    <DashboardLayout title="My Profile" navItems={NAV_ITEMS}>
      <div className="grid-2" style={{ gap: '24px' }}>

        {/* Profile Info */}
        <div className="card">
          <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>👤 Personal Information</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Role: <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            &nbsp;&nbsp;Email: <strong>{user?.email}</strong>
          </p>

          {success && <div className="alert alert-success">{success}</div>}
          {error   && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleProfileSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows={3} value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
                placeholder="Your address…" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ color: 'var(--secondary)', marginBottom: '20px' }}>🔒 Change Password</h3>

          {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}
          {pwError   && <div className="alert alert-danger">{pwError}</div>}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" required value={pwForm.currentPassword}
                onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required minLength={6} value={pwForm.newPassword}
                onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" required value={pwForm.confirm}
                onChange={e => setPwForm({...pwForm, confirm: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerProfile;
