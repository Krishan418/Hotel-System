/**
 * ProtectedRoute.jsx (Enhanced)
 *
 * Changes from v1:
 *   1. Waits for `authLoading` to finish before making any decisions.
 *      Previously it might redirect to /login before token verification completed.
 *   2. Shows a full-screen spinner while the token is being verified.
 *   3. Wrong-role access now goes to /unauthorized instead of silently
 *      redirecting to their dashboard (clearer error message for the user).
 *
 * HOW THE LOADING FLOW WORKS:
 *   App loads → authLoading = true (verifying JWT)
 *     → Show spinner (don't redirect yet!)
 *     → Verification done → authLoading = false
 *       ├── No user  → <Navigate to="/login" />
 *       ├── Wrong role → <Navigate to="/unauthorized" />
 *       └── Correct role → render children ✅
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Which dashboard each role should be sent to if they try to access a wrong route
const ROLE_HOME = {
  admin:    '/admin',
  staff:    '/staff',
  cashier:  '/cashier',
  delivery: '/delivery',
  customer: '/customer',
};

function ProtectedRoute({ children, allowedRoles }) {
  const { user, authLoading } = useAuth();

  // ── Step 1: Wait while we verify the token ──
  if (authLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  // ── Step 2: Not logged in → go to login ──
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ── Step 3: Wrong role → go to their own dashboard ──
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] || '/';
    return <Navigate to={home} replace />;
  }

  // ── Step 4: All checks passed → render the page ──
  return children;
}

export default ProtectedRoute;
