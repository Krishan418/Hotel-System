/**
 * CustomerOrderFood.jsx — Customer: Order Food sub-page
 *
 * Fetches menu items from GET /api/menu
 * Customer adds items to a cart and submits order to POST /api/orders
 */

import { useState, useEffect } from 'react';
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

function CustomerOrderFood() {
  const { get, post, loading, error } = useApi();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [notes, setNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMenu(); }, []);

  async function fetchMenu() {
    try {
      const data = await get('/api/menu');
      setMenuItems(data.items || data.data || []);
    } catch {}
  }

  function addToCart(id)    { setCart(c => ({...c, [id]: (c[id] || 0) + 1})); }
  function removeFromCart(id) {
    setCart(c => {
      const updated = {...c, [id]: (c[id] || 1) - 1};
      if (updated[id] <= 0) delete updated[id];
      return updated;
    });
  }

  const cartTotal = menuItems
    .filter(i => cart[i._id])
    .reduce((sum, i) => sum + (i.price * cart[i._id]), 0);

  async function placeOrder() {
    const items = Object.entries(cart).map(([menuItem, quantity]) => ({ menuItem, quantity }));
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      await post('/api/orders', { items, notes, orderType: 'dine-in' });
      setOrderPlaced(true);
      setCart({});
    } catch {}
    setSubmitting(false);
  }

  if (orderPlaced) {
    return (
      <DashboardLayout title="Order Food" navItems={NAV_ITEMS}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: 'var(--secondary)' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--gray-600)', margin: '12px 0 24px' }}>Your food is being prepared.</p>
          <button className="btn btn-primary" onClick={() => setOrderPlaced(false)}>Order Again</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Order Food" navItems={NAV_ITEMS}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Menu */}
        <div>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>🍽️ Menu</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : menuItems.length === 0 ? (
            <div className="alert alert-warning">No menu items available. Ask admin to add items.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {menuItems.map(item => (
                <div key={item._id} className="card" style={{ padding: '16px' }}>
                  <h4 style={{ color: 'var(--secondary)', fontSize: '0.95rem', marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '8px' }}>{item.category}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>${item.price}</span>
                    {cart[item._id] ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => removeFromCart(item._id)}>−</button>
                        <span style={{ fontWeight: 600 }}>{cart[item._id]}</span>
                        <button className="btn btn-sm btn-primary" onClick={() => addToCart(item._id)}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => addToCart(item._id)}>Add</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '16px' }}>🛒 Your Order</h3>
          {Object.keys(cart).length === 0 ? (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>Add items from the menu.</p>
          ) : (
            <>
              {menuItems.filter(i => cart[i._id]).map(i => (
                <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                  <span>{i.name} × {cart[i._id]}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>${(i.price * cart[i._id]).toFixed(2)}</span>
                </div>
              ))}
              <hr style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: '16px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="form-group">
                <label>Special Notes</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Allergie, spice level…" />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                onClick={placeOrder} disabled={submitting}>
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerOrderFood;
