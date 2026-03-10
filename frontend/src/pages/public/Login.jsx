/**
 * Login.jsx — Authentication page
 *
 * Calls the backend POST /api/auth/login endpoint.
 * On success, saves JWT + user to AuthContext and redirects to dashboard.
 *
 * FIX: If user is already logged in, redirect them straight to their dashboard.
 *      Prevents the awkward state of seeing the login page while already authenticated.
 */

import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

// Maps each role to its dashboard URL
const ROLE_ROUTES = {
  admin:    '/admin',
  staff:    '/staff',
  cashier:  '/cashier',
  delivery: '/delivery',
  customer: '/customer',
};

function Login() {
  const { login, user, authLoading } = useAuth();
  const navigate = useNavigate();

  // ── If already logged in, redirect to their dashboard immediately ──
  // authLoading check prevents a flash redirect while the token is being verified
  if (!authLoading && user) {
    return <Navigate to={ROLE_ROUTES[user.role] || '/'} replace />;
  }

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the backend login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message from server (e.g. "Invalid credentials")
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      // Save user info to AuthContext (localStorage)
      login(data.user, data.token);

      // Redirect each role to their own dashboard
      navigate(ROLE_ROUTES[data.user.role] || '/');
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">🏨 Hotel Ceylon</div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your account</p>

        {/* Error alert */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one free</Link>
        </p>
        <p className="auth-footer">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

