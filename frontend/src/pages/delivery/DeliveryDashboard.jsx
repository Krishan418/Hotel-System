/**
 * DeliveryDashboard.jsx
 *
 * Delivery person portal. They can:
 *  - View assigned delivery orders
 *  - Update delivery status
 *  - View their earnings
 */

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { label: 'Overview', to: '/delivery', icon: '🏠', exact: true },
  { label: 'My Orders', to: '/delivery/orders', icon: '📦' },
  { label: 'Delivery Status', to: '/delivery/status', icon: '🚴' },
  { label: 'Earnings', to: '/delivery/earnings', icon: '💰' },
];

// Delivery status flow: assigned → picked-up → on-the-way → delivered
const STATUS_FLOW = ['assigned', 'picked-up', 'on-the-way', 'delivered'];

const initialOrders = [
  { id: 'DEL001', customer: 'Room 301', items: 'Truffle Pasta x1, Mocktail x2', total: 48, status: 'assigned' },
  { id: 'DEL002', customer: 'Room 105', items: 'Club Sandwich x2', total: 32, status: 'picked-up' },
  { id: 'DEL003', customer: 'Room 509', items: 'Steak + Wine', total: 110, status: 'on-the-way' },
];

function statusBadge(status) {
  const map = {
    assigned: 'badge-warning',
    'picked-up': 'badge-info',
    'on-the-way': 'badge-gold',
    delivered: 'badge-success',
  };
  return map[status] || 'badge-info';
}

function DeliveryDashboard() {
  const [orders, setOrders] = useState(initialOrders);

  function advanceStatus(id) {
    setOrders(orders.map((o) => {
      if (o.id !== id) return o;
      const idx = STATUS_FLOW.indexOf(o.status);
      if (idx < STATUS_FLOW.length - 1) {
        return { ...o, status: STATUS_FLOW[idx + 1] };
      }
      return o; // already delivered
    }));
  }

  const earnings = orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total * 0.1, 0); // 10% commission

  return (
    <DashboardLayout title="Delivery Dashboard" navItems={NAV_ITEMS}>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { icon: '📦', value: orders.length, label: 'Assigned Orders' },
          { icon: '🚴', value: orders.filter((o) => o.status === 'on-the-way').length, label: 'In Transit' },
          { icon: '✅', value: orders.filter((o) => o.status === 'delivered').length, label: 'Delivered' },
          { icon: '💰', value: `$${earnings.toFixed(2)}`, label: "Today's Earnings" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Delivery Orders */}
      <h3 style={{ color: 'var(--secondary)', margin: '24px 0 16px' }}>My Delivery Orders</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Destination</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td>${o.total}</td>
                <td><span className={`badge ${statusBadge(o.status)}`}>{o.status}</span></td>
                <td>
                  {o.status === 'delivered' ? (
                    <span className="badge badge-success">Done ✓</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => advanceStatus(o.id)}>
                      Next Step →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Legend */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)', fontWeight: 600 }}>Status Flow:</span>
        {STATUS_FLOW.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
            <span className={`badge ${statusBadge(s)}`}>{s}</span>
            {i < STATUS_FLOW.length - 1 && <span style={{ color: 'var(--gray-400)' }}>→</span>}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

export default DeliveryDashboard;
