/**
 * CashierDashboard.jsx
 *
 * Cashier POS (Point of Sale) system. Cashier can:
 *  - View open orders
 *  - Process payments
 *  - Print / generate receipts
 */

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const NAV_ITEMS = [
  { label: 'POS Overview', to: '/cashier', icon: '🏠', exact: true },
  { label: 'Orders', to: '/cashier/orders', icon: '📋' },
  { label: 'Payments', to: '/cashier/payments', icon: '💳' },
  { label: 'Receipts', to: '/cashier/receipts', icon: '🧾' },
];

// Mock open orders pending payment
const openOrders = [
  { id: 'ORD001', customer: 'Table 4', items: 'Wagyu Steak x1, Wine x2', total: 95, status: 'unpaid' },
  { id: 'ORD002', customer: 'Room 201', items: 'Breakfast Buffet x2', total: 50, status: 'unpaid' },
  { id: 'ORD003', customer: 'Table 7', items: 'Lobster Bisque x2, Crème Brûlée x2', total: 64, status: 'unpaid' },
];

function CashierDashboard() {
  const [paid, setPaid] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  function processPayment(id) {
    setPaid([...paid, id]);
    setSelectedOrder(null);
  }

  return (
    <DashboardLayout title="Cashier POS" navItems={NAV_ITEMS}>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { icon: '📋', value: openOrders.length, label: 'Open Orders' },
          { icon: '✅', value: paid.length, label: 'Paid Today' },
          { icon: '💰', value: '$1,240', label: "Today's Collections" },
          { icon: '🧾', value: paid.length, label: 'Receipts Issued' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Receipt Preview Modal (simple) */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}>
          <div className="card" style={{ width: '380px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '16px' }}>🧾 Receipt Preview</h3>
            <p><strong>Order:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Items:</strong> {selectedOrder.items}</p>
            <hr style={{ margin: '16px 0' }} />
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
              Total: ${selectedOrder.total}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={() => processPayment(selectedOrder.id)}>
                ✅ Confirm Payment
              </button>
              <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Orders Table */}
      <h3 style={{ color: 'var(--secondary)', margin: '24px 0 16px' }}>Open Orders</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Customer / Table</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {openOrders.map((o) => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td>{o.items}</td>
                <td>${o.total}</td>
                <td>
                  {paid.includes(o.id) ? (
                    <span className="badge badge-success">Paid</span>
                  ) : (
                    <span className="badge badge-warning">Unpaid</span>
                  )}
                </td>
                <td>
                  {paid.includes(o.id) ? (
                    <button className="btn btn-sm" style={{ background: 'var(--gray-200)', cursor: 'default' }}>Printed</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedOrder(o)}>
                      Pay Now
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

export default CashierDashboard;
