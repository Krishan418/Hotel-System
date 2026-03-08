/**
 * Unauthorized.jsx
 *
 * Shown when a logged-in user tries to access a page
 * they don't have permission for (wrong role).
 *
 * Example: A customer goes to /admin → sees this page.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_HOME = {
  admin: '/admin', staff: '/staff', cashier: '/cashier',
  delivery: '/delivery', customer: '/customer',
};

function Unauthorized() {
  const { user } = useAuth();
  const dashboardLink = user ? (ROLE_HOME[user.role] || '/') : '/';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)',
      fontFamily: 'var(--font-family)',
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: 'var(--radius-xl)',
        padding: '48px', textAlign: 'center', maxWidth: '450px',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
        <h1 style={{ color: 'var(--secondary)', marginBottom: '12px', fontSize: '1.8rem' }}>
          Access Denied
        </h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '8px' }}>
          You don't have permission to view this page.
        </p>
        {user && (
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginBottom: '28px' }}>
            Your role: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{user.role}</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {user ? (
            <Link to={dashboardLink} className="btn btn-primary">
              Go to My Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          )}
          <Link to="/" className="btn btn-outline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
