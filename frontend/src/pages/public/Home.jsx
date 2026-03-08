/**
 * Home.jsx — Public home page
 *
 * Sections:
 *  1. Hero banner
 *  2. Services overview (rooms, events, restaurant, pool)
 *  3. Call-to-action (Book Now)
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Home.css';

function Home() {
  // Feature cards shown in the "Our Services" grid
  const services = [
    {
      icon: '🛏️',
      title: 'Luxury Rooms',
      desc: 'Spacious rooms and suites with stunning views and world-class amenities.',
      link: '/rooms',
    },
    {
      icon: '💍',
      title: 'Dream Weddings',
      desc: 'Make your special day unforgettable with our stunning wedding halls.',
      link: '/weddings',
    },
    {
      icon: '🍽️',
      title: 'Fine Dining',
      desc: 'Savour exquisite cuisine crafted by award-winning chefs.',
      link: '/restaurant',
    },
    {
      icon: '🏊',
      title: 'Pool & Spa',
      desc: 'Relax by our infinity pool and indulge in rejuvenating spa treatments.',
      link: '/pool',
    },
  ];

  const testimonials = [
    { name: 'Amara Silva', text: 'Best hotel experience I\'ve ever had. The staff was incredible!', stars: 5 },
    { name: 'James Perera', text: 'Our wedding was absolutely perfect. Every detail was taken care of.', stars: 5 },
    { name: 'Priya Nair', text: 'The restaurant food is outstanding. Will definitely come back!', stars: 5 },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <span className="hero-tag">Welcome to LuxeHotel</span>
            <h1>Experience Luxury <br /><span className="text-gold">Like Never Before</span></h1>
            <p>Discover world-class rooms, unforgettable events, and exceptional dining in the heart of Colombo.</p>
            <div className="hero-buttons">
              <Link to="/rooms" className="btn btn-primary">Book a Room</Link>
              <Link to="/weddings" className="btn btn-secondary">Plan Your Wedding</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="section services-section">
        <div className="container text-center">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">Everything you need for an extraordinary experience.</p>
          <div className="grid-4">
            {services.map((svc) => (
              <Link to={svc.link} key={svc.title} className="service-card">
                <div className="service-icon">{svc.icon}</div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <span className="service-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section about-section">
        <div className="container about-inner">
          <div className="about-text">
            <h2 className="section-title">Why Choose LuxeHotel?</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
              With over 20 years of hospitality excellence, we combine luxury with warmth.
            </p>
            <ul className="about-features">
              <li>✔ 5-star rated services</li>
              <li>✔ 24/7 concierge support</li>
              <li>✔ Private event planning</li>
              <li>✔ Award-winning restaurant</li>
              <li>✔ Spa and wellness centre</li>
              <li>✔ Prime Colombo location</li>
            </ul>
            <Link to="/contact" className="btn btn-outline" style={{ marginTop: '24px' }}>
              Contact Us
            </Link>
          </div>
          <div className="about-stats">
            {[['500+', 'Happy Guests / Month'], ['50+', 'Luxury Rooms'], ['200+', 'Events Hosted'], ['15+', 'Awards Won']].map(([val, lbl]) => (
              <div key={lbl} className="about-stat">
                <div className="about-stat-value">{val}</div>
                <div className="about-stat-label">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section testimonials-section">
        <div className="container text-center">
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-subtitle">Real experiences from our valued guests.</p>
          <div className="grid-3">
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="stars">{'⭐'.repeat(t.stars)}</div>
                <p>"{t.text}"</p>
                <strong>— {t.name}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready for an Unforgettable Stay?</h2>
          <p>Book today and get up to 20% off your first reservation.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            <Link to="/register" className="btn btn-primary">Create Account</Link>
            <Link to="/rooms" className="btn btn-secondary">View Rooms</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
