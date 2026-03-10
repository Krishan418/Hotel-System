/**
 * App.jsx — Complete Router with Role-Based Routes
 *
 * HOW ROLE-BASED ROUTING WORKS:
 * ─────────────────────────────
 *
 *  1. User visits the app
 *  2. AuthContext checks localStorage for a saved JWT token
 *  3. If found, it calls GET /api/auth/me to verify the token still works
 *  4. While verifying: ProtectedRoute shows a loading spinner
 *  5. After verifying:
 *     - If no user → redirect to /login
 *     - If wrong role → redirect to their own dashboard
 *     - If correct role → render the page ✅
 *
 * ROLE → DASHBOARD MAPPING:
 *   admin    → /admin/*
 *   staff    → /staff/*
 *   cashier  → /cashier/*
 *   customer → /customer/*
 *   delivery → /delivery/*
 *
 * JWT IS AUTOMATICALLY ATTACHED TO EVERY API CALL via useApi() hook:
 *   Authorization: Bearer <jwt-from-localStorage>
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Public Pages ──
import Home         from './pages/public/Home';
import Rooms        from './pages/public/Rooms';
import Weddings     from './pages/public/Weddings';
import Restaurant   from './pages/public/Restaurant';
import Pool         from './pages/public/Pool';
import Contact      from './pages/public/Contact';
import Login        from './pages/public/Login';
import Register     from './pages/public/Register';
import Unauthorized from './pages/public/Unauthorized';

// ── Admin Dashboard Pages ──
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms     from './pages/admin/AdminRooms';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminReports   from './pages/admin/AdminReports';
import AdminWeddings  from './pages/admin/AdminWeddings';
import AdminRestaurant from './pages/admin/AdminRestaurant';

// ── Customer Dashboard Pages ──
import CustomerDashboard  from './pages/customer/CustomerDashboard';
import CustomerBookings   from './pages/customer/CustomerBookings';
import CustomerProfile    from './pages/customer/CustomerProfile';
import CustomerBookRoom   from './pages/customer/CustomerBookRoom';
import CustomerOrderFood  from './pages/customer/CustomerOrderFood';

// ── Staff Dashboard Pages ──
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBookings  from './pages/staff/StaffBookings';

// ── Cashier Dashboard Pages ──
import CashierDashboard from './pages/cashier/CashierDashboard';
import CashierOrders    from './pages/cashier/CashierOrders';

// ── Delivery Dashboard ──
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// Helper: wrap a page in ProtectedRoute with allowed roles
// This avoids repeating <ProtectedRoute allowedRoles={...}> everywhere
function Guard({ roles, children }) {
  return <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ══════════════════════════════════════════
              PUBLIC ROUTES — no login required
          ══════════════════════════════════════════ */}
          <Route path="/"            element={<Home />} />
          <Route path="/rooms"       element={<Rooms />} />
          <Route path="/weddings"    element={<Weddings />} />
          <Route path="/restaurant"  element={<Restaurant />} />
          <Route path="/pool"        element={<Pool />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ══════════════════════════════════════════
              ADMIN ROUTES — only role: admin
          ══════════════════════════════════════════
            /admin            → overview dashboard
            /admin/rooms      → room management
            /admin/users      → user management
            /admin/reports    → reports & analytics
            /admin/weddings   → wedding overview (uses main dashboard)
            /admin/restaurant → restaurant overview (uses main dashboard)
          ══════════════════════════════════════════ */}
          <Route path="/admin" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
          <Route path="/admin/rooms"      element={<Guard roles={['admin']}><AdminRooms /></Guard>} />
          <Route path="/admin/users"      element={<Guard roles={['admin']}><AdminUsers /></Guard>} />
          <Route path="/admin/reports"    element={<Guard roles={['admin']}><AdminReports /></Guard>} />
          {/* These sub-routes reuse the main dashboard until dedicated pages are built */}
          <Route path="/admin/weddings"   element={<Guard roles={['admin']}><AdminWeddings /></Guard>} />
          <Route path="/admin/restaurant" element={<Guard roles={['admin']}><AdminRestaurant /></Guard>} />

          {/* ══════════════════════════════════════════
              CUSTOMER ROUTES — only role: customer
          ══════════════════════════════════════════
            /customer              → overview
            /customer/book-room    → search + book rooms (uses real API)
            /customer/book-wedding → wedding enquiry
            /customer/order-food   → food menu + cart + order
            /customer/book-pool    → pool session booking
            /customer/bookings     → view all my bookings
            /customer/payments     → payment history
            /customer/profile      → edit profile + change password
          ══════════════════════════════════════════ */}
          <Route path="/customer"              element={<Guard roles={['customer']}><CustomerDashboard /></Guard>} />
          <Route path="/customer/book-room"    element={<Guard roles={['customer']}><CustomerBookRoom /></Guard>} />
          <Route path="/customer/book-wedding" element={<Guard roles={['customer']}><CustomerDashboard /></Guard>} />
          <Route path="/customer/order-food"   element={<Guard roles={['customer']}><CustomerOrderFood /></Guard>} />
          <Route path="/customer/book-pool"    element={<Guard roles={['customer']}><CustomerDashboard /></Guard>} />
          <Route path="/customer/bookings"     element={<Guard roles={['customer']}><CustomerBookings /></Guard>} />
          <Route path="/customer/payments"     element={<Guard roles={['customer']}><CustomerDashboard /></Guard>} />
          <Route path="/customer/profile"      element={<Guard roles={['customer']}><CustomerProfile /></Guard>} />

          {/* ══════════════════════════════════════════
              STAFF ROUTES — only role: staff
          ══════════════════════════════════════════
            /staff          → overview + today's check-ins/check-outs
            /staff/checkin  → bookings ready to check in
            /staff/checkout → guests ready to check out
            /staff/bookings → all bookings with filter
          ══════════════════════════════════════════ */}
          <Route path="/staff"          element={<Guard roles={['staff']}><StaffDashboard /></Guard>} />
          <Route path="/staff/checkin"  element={<Guard roles={['staff']}><StaffDashboard /></Guard>} />
          <Route path="/staff/checkout" element={<Guard roles={['staff']}><StaffDashboard /></Guard>} />
          <Route path="/staff/bookings" element={<Guard roles={['staff']}><StaffBookings /></Guard>} />

          {/* ══════════════════════════════════════════
              CASHIER ROUTES — only role: cashier
          ══════════════════════════════════════════
            /cashier          → POS overview (open orders, pay modal)
            /cashier/orders   → full orders list with status progression
            /cashier/payments → payment history
            /cashier/receipts → issued receipts
          ══════════════════════════════════════════ */}
          <Route path="/cashier"          element={<Guard roles={['cashier']}><CashierDashboard /></Guard>} />
          <Route path="/cashier/orders"   element={<Guard roles={['cashier']}><CashierOrders /></Guard>} />
          <Route path="/cashier/payments" element={<Guard roles={['cashier']}><CashierDashboard /></Guard>} />
          <Route path="/cashier/receipts" element={<Guard roles={['cashier']}><CashierDashboard /></Guard>} />

          {/* ══════════════════════════════════════════
              DELIVERY ROUTES — only role: delivery
          ══════════════════════════════════════════
            /delivery        → order list + status advancement + earnings
            /delivery/orders → same as above
            /delivery/status → in-transit orders
            /delivery/earnings → earnings summary
          ══════════════════════════════════════════ */}
          <Route path="/delivery"          element={<Guard roles={['delivery']}><DeliveryDashboard /></Guard>} />
          <Route path="/delivery/orders"   element={<Guard roles={['delivery']}><DeliveryDashboard /></Guard>} />
          <Route path="/delivery/status"   element={<Guard roles={['delivery']}><DeliveryDashboard /></Guard>} />
          <Route path="/delivery/earnings" element={<Guard roles={['delivery']}><DeliveryDashboard /></Guard>} />

          {/* ══════════════════════════════════════════
              FALLBACK — redirect unknown URLs to home
          ══════════════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
