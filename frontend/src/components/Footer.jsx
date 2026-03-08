/**
 * Footer.jsx
 *
 * The bottom footer shown on all PUBLIC pages.
 */

import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h3>🏨 LuxeHotel</h3>
          <p>Your premier destination for luxury stays, unforgettable weddings, and exquisite dining experiences.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rooms">Rooms</Link></li>
            <li><Link to="/weddings">Weddings</Link></li>
            <li><Link to="/restaurant">Restaurant</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h4>Services</h4>
          <ul>
            <li><Link to="/pool">Pool & Spa</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>📍 123 Luxury Ave, Colombo</li>
            <li>📞 +94 11 234 5678</li>
            <li>✉️ info@luxehotel.com</li>
            <li>🕐 24/7 Open</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {year} LuxeHotel. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
