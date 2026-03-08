/**
 * Weddings.jsx — Public Wedding packages page
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const packages = [
  {
    emoji: '💫',
    name: 'Silver Package',
    price: 2500,
    capacity: 100,
    features: ['Hall decoration', 'Basic catering', 'Sound system', 'Photographer'],
  },
  {
    emoji: '✨',
    name: 'Gold Package',
    price: 5000,
    capacity: 250,
    features: ['Premium decoration', 'Buffet & plated meal', 'Live band', 'Video + Photography', 'Bridal suite'],
  },
  {
    emoji: '👑',
    name: 'Platinum Package',
    price: 10000,
    capacity: 500,
    features: ['Luxury decoration', 'Full gourmet menu', 'International DJ', '4K videography', 'Honeymoon suite', 'Airport transfer', 'Floral arrangements'],
  },
];

const halls = [
  { name: 'Grand Ballroom', capacity: 500, emoji: '🏛️', desc: 'Our largest and most opulent venue with chandeliers and marble flooring.' },
  { name: 'Garden Pavilion', capacity: 200, emoji: '🌿', desc: 'An enchanting outdoor venue surrounded by tropical gardens.' },
  { name: 'Crystal Hall', capacity: 150, emoji: '💎', desc: 'Intimate and elegant with crystal lighting and panoramic views.' },
];

function Weddings() {
  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <h1>💍 Dream Wedding Venues</h1>
          <p>Create cherished memories at our stunning wedding halls with world-class service.</p>
        </div>
      </div>

      {/* Wedding Halls */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container text-center">
          <h2 className="section-title">Our Venues</h2>
          <p className="section-subtitle">Three exquisite halls to suit your dream wedding style and size.</p>
          <div className="grid-3">
            {halls.map((hall) => (
              <div key={hall.name} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{hall.emoji}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>{hall.name}</h3>
                <span className="badge badge-gold" style={{ marginBottom: '12px' }}>Up to {hall.capacity} guests</span>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{hall.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">Wedding Packages</h2>
          <p className="section-subtitle">Choose a package that fits your style and budget.</p>
          <div className="grid-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className="card" style={{ textAlign: 'left', border: '1px solid var(--gray-200)', position: 'relative' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{pkg.emoji}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '8px', fontSize: '1.2rem' }}>{pkg.name}</h3>
                <p style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>${pkg.price.toLocaleString()}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: '16px' }}>Up to {pkg.capacity} guests</p>
                <ul style={{ marginBottom: '20px' }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ fontSize: '0.88rem', color: 'var(--gray-700)', padding: '4px 0' }}>✓ {f}</li>
                  ))}
                </ul>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Enquire Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--secondary)', color: 'var(--white)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Let's Plan Your Perfect Day</h2>
          <p style={{ opacity: 0.8, marginBottom: '24px' }}>Our dedicated wedding coordinators are here to make your dream a reality.</p>
          <Link to="/contact" className="btn btn-primary">Talk to a Coordinator</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Weddings;
