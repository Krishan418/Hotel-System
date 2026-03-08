/**
 * CashierOrders.jsx — Cashier: Orders sub-page
 *
 * Cashier sees all active orders and updates their status.
 * Calls: GET /api/orders → list all orders
 *        PUT /api/orders/:id/status → update status
 */

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useApi from '../../hooks/useApi';

const NAV_ITEMS = [
  { label: 'POS Overview', to: '/cashier',          icon: '🏠', exact: true },
  { label: 'Orders',       to: '/cashier/orders',   icon: '📋' },
  { label: 'Payments',     to: '/cashier/payments', icon: '💳' },
  { label: 'Receipts',     to: '/cashier/receipts', icon: '🧾' },
];

const STATUS_STEPS = ['pending', 'preparing', 'ready', 'served', 'paid'];

function statusBadge(s) {
  const m = { pending: 'badge-warning', preparing: 'badge-info', ready: 'badge-gold', served: 'badge-success', paid: 'badge-success', cancelled: 'badge-danger' };
  return m[s] || 'badge-info';
}

function CashierOrders() {
  const { get, put, loading, error } = useApi();
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState('all');
  const [actioning, setActioning] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    try {
      const data = await get('/api/orders');
      setOrders(data.orders || data.data || []);
    } catch {}
  }

  async function nextStatus(order) {
    const idx = STATUS_STEPS.indexOf(order.status);
    if (idx < 0 || idx >= STATUS_STEPS.length - 1) return;
    const next = STATUS_STEPS[idx + 1];
    setActioning(order._id);
    try {
      await put(`/api/orders/${order._id}/status`, { status: next });
      fetchOrders();
    } catch {}
    setActioning(null);
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <DashboardLayout title="Orders Management" navItems={NAV_ITEMS}>
      {/* Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: '24px' }}>
        {STATUS_STEPS.map(s => (
          <div key={s} className="stat-card" style={{ textAlign: 'center', padding: '16px' }}>
            <div className="stat-value" style={{ fontSize: '1.5rem' }}>
              {orders.filter(o => o.status === s).length}
            </div>
            <div className="stat-label" style={{ textTransform: 'capitalize' }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', ...STATUS_STEPS].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            style={{ textTransform: 'capitalize' }}>
            {f}
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
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Type</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-500)' }}>No orders.</td></tr>
              ) : (
                filtered.map(o => {
                  const isLast = STATUS_STEPS.indexOf(o.status) >= STATUS_STEPS.length - 1;
                  return (
                    <tr key={o._id}>
                      <td><strong>{o._id?.slice(-6).toUpperCase()}</strong></td>
                      <td>{o.customer?.name || o.user?.name || 'Guest'}</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {o.items?.map(i => `${i.menuItem?.name || 'Item'} ×${i.quantity}`).join(', ') || '—'}
                      </td>
                      <td>${o.totalAmount ?? '—'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{o.orderType || '—'}</td>
                      <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                      <td>
                        {!isLast && o.status !== 'cancelled' ? (
                          <button className="btn btn-primary btn-sm"
                            disabled={actioning === o._id}
                            onClick={() => nextStatus(o)}>
                            {actioning === o._id ? '…' : `→ ${STATUS_STEPS[STATUS_STEPS.indexOf(o.status) + 1]}`}
                          </button>
                        ) : <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CashierOrders;
