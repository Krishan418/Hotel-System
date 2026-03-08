/**
 * Rooms.jsx — Public Rooms page
 * Shows available room categories with images, features, and booking button.
 */

import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Rooms.css';

const rooms = [
  {
    id: 1,
    type: 'Standard Room',
    price: 120,
    emoji: '🛏️',
    desc: 'Comfortable room with modern amenities perfect for business or leisure stays.',
    features: ['King-size bed', 'Free Wi-Fi', 'Air conditioning', 'Flat-screen TV'],
    badge: 'Popular',
  },
  {
    id: 2,
    type: 'Deluxe Room',
    price: 200,
    emoji: '🏡',
    desc: 'Spacious deluxe room with premium furnishings and garden or pool views.',
    features: ['King-size bed', 'City view', 'Mini-bar', 'Balcony'],
    badge: 'Best Value',
  },
  {
    id: 3,
    type: 'Junior Suite',
    price: 320,
    emoji: '🛋️',
    desc: 'Elegant suite with a separate living area and stunning panoramic views.',
    features: ['Separate living area', 'Sea view', 'Jacuzzi', 'Butler service'],
    badge: null,
  },
  {
    id: 4,
    type: 'Presidential Suite',
    price: 600,
    emoji: '👑',
    desc: 'The ultimate luxury experience. Our flagship suite with every comfort imaginable.',
    features: ['3 Bedrooms', 'Private pool', 'Personal chef', 'Airport transfer'],
    badge: 'Luxury',
  },
  {
    id: 5,
    type: 'Family Room',
    price: 180,
    emoji: '👨‍👩‍👧‍👦',
    desc: 'Ideal for families with extra space, two bathrooms, and playful decor.',
    features: ['2 Queen beds', 'Kids corner', 'Baby crib available', 'Connecting room'],
    badge: 'Family',
  },
  {
    id: 6,
    type: 'Honeymoon Suite',
    price: 400,
    emoji: '💕',
    desc: 'Romantic suite designed for couples with rose petals, mood lighting, and champagne.',
    features: ['Canopy bed', 'Spa bath', 'Champagne on arrival', 'Ocean view'],
    badge: 'Romantic',
  },
];

function Rooms() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <h1>🛏️ Our Rooms & Suites</h1>
          <p>From cosy standard rooms to lavish presidential suites — we have the perfect stay for every occasion.</p>
        </div>
      </div>

      {/* Room Cards */}
      <section className="section">
        <div className="container">
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                {room.badge && <span className="badge badge-gold room-badge">{room.badge}</span>}
                <div className="room-emoji">{room.emoji}</div>
                <div className="room-info">
                  <h3>{room.type}</h3>
                  <p>{room.desc}</p>

                  <ul className="room-features">
                    {room.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>

                  <div className="room-footer">
                    <div className="room-price">
                      <span className="price-value">${room.price}</span>
                      <span className="price-per"> / night</span>
                    </div>
                    <Link to="/login" className="btn btn-primary btn-sm">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Rooms;
