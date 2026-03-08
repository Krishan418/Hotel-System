/**
 * Pool.jsx — Public Pool & Spa page
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const sessions = [
  { time: '6:00 AM – 8:00 AM', label: 'Morning Swim', icon: '🌅', price: 15 },
  { time: '9:00 AM – 12:00 PM', label: 'Morning Session', icon: '☀️', price: 20 },
  { time: '1:00 PM – 4:00 PM', label: 'Afternoon Session', icon: '🏊', price: 20 },
  { time: '5:00 PM – 8:00 PM', label: 'Evening Session', icon: '🌆', price: 25 },
];

const amenities = [
  { icon: '🏊', title: 'Infinity Pool', desc: '25-metre infinity pool with stunning city views.' },
  { icon: '🧖', title: 'Spa Centre', desc: 'Full-service spa with massage, facials, and body treatments.' },
  { icon: '💪', title: 'Gym', desc: 'State-of-the-art fitness equipment open 24 hours.' },
  { icon: '🛁', title: 'Jacuzzi', desc: 'Relaxing hot tub available for hotel guests.' },
  { icon: '🌴', title: 'Sun Deck', desc: 'Spacious sun deck with loungers and poolside service.' },
  { icon: '🍹', title: 'Pool Bar', desc: 'Refreshing cocktails and snacks served poolside.' },
];

function Pool() {
  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <h1>🏊 Pool & Spa</h1>
          <p>Unwind, refresh, and rejuvenate at our world-class pool and spa complex.</p>
        </div>
      </div>

      {/* Amenities */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container text-center">
          <h2 className="section-title">Facilities & Amenities</h2>
          <p className="section-subtitle">Everything you need for the perfect relaxation day.</p>
          <div className="grid-3">
            {amenities.map((a) => (
              <div key={a.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{a.icon}</div>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>{a.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem' }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pool Sessions */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Book a Pool Session</h2>
            <p className="section-subtitle">Sessions available daily. Login to book your preferred time slot.</p>
          </div>
          <div className="grid-4">
            {sessions.map((s) => (
              <div key={s.label} className="card" style={{ textAlign: 'center', borderTop: '3px solid var(--primary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '4px' }}>{s.label}</h4>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.82rem', marginBottom: '12px' }}>{s.time}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px' }}>${s.price} / person</p>
                <Link to="/login" className="btn btn-outline btn-sm">Book Slot</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section style={{ background: 'var(--secondary)', color: 'var(--white)', padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.8rem' }}>Pool Rules & Guidelines</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
            {[
              'Shower before entering the pool',
              'No food or drinks inside the pool',
              'Children must be supervised',
              'Swimwear required at all times',
              'No diving in the shallow end',
              'Book in advance to guarantee your slot',
            ].map((rule) => (
              <div key={rule} style={{ fontSize: '0.88rem', opacity: 0.85 }}>✔ {rule}</div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Pool;
