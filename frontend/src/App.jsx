/**
 * App.jsx — Main Router
 *
 * This file is the heart of the React frontend.
 * It defines ALL routes for:
 *   - Public pages (no login required)
 *   - Login / Register
 *   - Protected dashboards (login required + correct role)
 *
 * How routing works:
 *   <Routes> looks at the URL and renders the matching <Route>.
 *   <ProtectedRoute> checks if the user is logged in (and has the right role)
 *   before rendering the dashboard page.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// ── Public Pages ──
import Home       from './pages/public/Home';
import Rooms      from './pages/public/Rooms';
import Weddings   from './pages/public/Weddings';
import Restaurant from './pages/public/Restaurant';
import Pool       from './pages/public/Pool';
import Contact    from './pages/public/Contact';

// ── Auth Pages ──
import Login    from './pages/public/Login';
import Register from './pages/public/Register';

// ── Dashboard Pages ──
import AdminDashboard    from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import StaffDashboard    from './pages/staff/StaffDashboard';
import CashierDashboard  from './pages/cashier/CashierDashboard';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';

// ── Route Guard ──
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    /*
     * AuthProvider wraps everything so any component can call useAuth()
     * BrowserRouter enables URL-based routing (uses the browser's history API)
     */
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ══════════════════════════════════
              PUBLIC ROUTES — no login needed
          ══════════════════════════════════ */}
          <Route path="/"          element={<Home />} />
          <Route path="/rooms"     element={<Rooms />} />
          <Route path="/weddings"  element={<Weddings />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/pool"      element={<Pool />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* ══════════════════════════════════
              ADMIN ROUTES — role: admin only
          ══════════════════════════════════ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin sub-routes all load the same dashboard for now.
              You can swap these for dedicated sub-pages later. */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ══════════════════════════════════
              CUSTOMER ROUTES — role: customer
          ══════════════════════════════════ */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/*"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* ══════════════════════════════════
              STAFF ROUTES — role: staff
          ══════════════════════════════════ */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/*"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* ══════════════════════════════════
              CASHIER ROUTES — role: cashier
          ══════════════════════════════════ */}
          <Route
            path="/cashier"
            element={
              <ProtectedRoute allowedRoles={['cashier']}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier/*"
            element={
              <ProtectedRoute allowedRoles={['cashier']}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />

          {/* ══════════════════════════════════
              DELIVERY ROUTES — role: delivery
          ══════════════════════════════════ */}
          <Route
            path="/delivery"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/*"
            element={
              <ProtectedRoute allowedRoles={['delivery']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />

          {/* ══════════════════════════════════
              FALLBACK — redirect unknown URLs
          ══════════════════════════════════ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
