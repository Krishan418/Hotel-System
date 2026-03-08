/**
 * ProtectedRoute.jsx
 *
 * Guards dashboard routes so only logged-in users with the correct role
 * can access them. If not logged in → redirect to /login.
 * If wrong role → redirect to their own dashboard.
 *
 * Usage in App.jsx:
 *   <ProtectedRoute allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </ProtectedRoute>
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Map each role to its home dashboard
const ROLE_REDIRECTS = {
  admin: '/admin',
  staff: '/staff',
  cashier: '/cashier',
  delivery: '/delivery',
  customer: '/customer',
};

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → send to their dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect = ROLE_REDIRECTS[user.role] || '/';
    return <Navigate to={redirect} replace />;
  }

  // All good — render the page
  return children;
}

export default ProtectedRoute;
