/**
 * Restaurant.jsx — Public Restaurant page
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const menuHighlights = [
  { emoji: '🥗', name: 'Garden Fresh Salad', price: 12, category: 'Starters' },
  { emoji: '🍲', name: 'Lobster Bisque', price: 18, category: 'Starters' },
  { emoji: '🥩', name: 'Grilled Wagyu Steak', price: 65, category: 'Mains' },
  { emoji: '🐟', name: 'Pan-Seared Sea Bass', price: 45, category: 'Mains' },
  { emoji: '🍝', name: 'Truffle Pasta', price: 32, category: 'Mains' },
  { emoji: '🍮', name: 'Crème Brûlée', price: 14, category: 'Desserts' },
  { emoji: '🍫', name: 'Chocolate Fondant', price: 12, category: 'Desserts' },
  { emoji: '🍹', name: 'Tropical Mocktail', price: 8, category: 'Drinks' },
];

const diningOptions = [
  { icon: '🍽️', title: 'Fine Dining', desc: 'Exquisite à la carte menu with seasonal ingredients.' },
  { icon: '🥘', title: 'Buffet Breakfast', desc: 'Expansive breakfast spread from 6:30 AM to 10:30 AM.' },
  { icon: '🌃', title: 'Poolside BBQ', desc: 'Friday evening BBQ nights by the pool. Reserve a table!' },
  { icon: '🎂', title: 'Private Events', desc: 'Host celebrations and corporate dinners in our private dining room.' },
];

function Restaurant() {
  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <h1>🍽️ Culinary Excellence</h1>
          <p>Experience world-class cuisine crafted by our award-winning chefs using the finest local and international ingredients.</p>
        </div>
      </div>

      {/* Dining Options */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container text-center">
          <h2 className="section-title">Dining Experiences</h2>
          <p className="section-subtitle">Multiple ways to enjoy exceptional food at LuxeHotel.</p>
          <div className="grid-4">
            {diningOptions.map((opt) => (
              <div key={opt.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{opt.icon}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '8px', fontSize: '1rem' }}>{opt.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.87rem' }}>{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Menu Highlights</h2>
            <p className="section-subtitle">A tasteful selection from our full menu.</p>
          </div>
          <div className="grid-4">
            {menuHighlights.map((item) => (
              <div key={item.name} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{item.emoji}</div>
                <span className="badge badge-info" style={{ marginBottom: '8px' }}>{item.category}</span>
                <h4 style={{ color: 'var(--secondary)', fontSize: '0.95rem', margin: '8px 0 4px' }}>{item.name}</h4>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>${item.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '32px' }}>
            <Link to="/login" className="btn btn-primary">Order Now</Link>
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="section" style={{ background: 'var(--secondary)', color: 'var(--white)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Opening Hours</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
            {[
              ['🌅 Breakfast', '6:30 AM – 10:30 AM'],
              ['☀️ Lunch', '12:00 PM – 3:00 PM'],
              ['🌙 Dinner', '6:00 PM – 11:00 PM'],
            ].map(([meal, time]) => (
              <div key={meal} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '8px' }}>{meal}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Restaurant;
