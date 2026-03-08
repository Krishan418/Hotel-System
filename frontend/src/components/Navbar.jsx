/**
 * Navbar.jsx
 *
 * The top navigation bar shown on all PUBLIC pages (Home, Rooms, etc.).
 * Dashboard pages use their own sidebar instead.
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

  function handleLogout() {
    logout();
    navigate('/');
  }

  // Build a dashboard link based on the user's role
  function getDashboardLink() {
    if (!user) return null;
    const routes = {
      admin: '/admin',
      staff: '/staff',
      cashier: '/cashier',
      delivery: '/delivery',
      customer: '/customer',
    };
    return routes[user.role] || '/customer';
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🏨 LuxeHotel
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/rooms" onClick={() => setMenuOpen(false)}>Rooms</NavLink></li>
          <li><NavLink to="/weddings" onClick={() => setMenuOpen(false)}>Weddings</NavLink></li>
          <li><NavLink to="/restaurant" onClick={() => setMenuOpen(false)}>Restaurant</NavLink></li>
          <li><NavLink to="/pool" onClick={() => setMenuOpen(false)}>Pool</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink></li>
        </ul>

        {/* Auth Buttons */}
        <div className={`navbar-auth ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="btn btn-outline btn-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
