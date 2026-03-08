/**
 * Contact.jsx — Public Contact Us page
 */

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function Contact() {
  // Simple form state
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // In a real app this would call an API. For now it just shows a success message.
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const contactInfo = [
    { icon: '📍', label: 'Address', value: '123 Luxury Avenue, Colombo 03, Sri Lanka' },
    { icon: '📞', label: 'Phone', value: '+94 11 234 5678' },
    { icon: '✉️', label: 'Email', value: 'info@luxehotel.com' },
    { icon: '🕐', label: 'Hours', value: 'Reception open 24/7' },
  ];

  return (
    <div>
      <Navbar />

      <div className="page-hero">
        <div className="container">
          <h1>📬 Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll get back to you within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px', alignItems: 'start' }}>

            {/* Contact Info */}
            <div>
              <h2 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Get in Touch</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '32px', fontSize: '0.93rem' }}>
                Our friendly team is always happy to help.
              </p>
              {contactInfo.map((info) => (
                <div key={info.label} style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '1.5rem' }}>{info.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '0.9rem' }}>{info.label}</div>
                    <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{info.value}</div>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div style={{
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gray-500)',
                fontSize: '0.9rem',
                border: '1px solid var(--gray-200)',
                marginTop: '16px',
              }}>
                🗺️ Map — Colombo 03, Sri Lanka
              </div>
            </div>

            {/* Contact Form */}
            <div className="card">
              <h3 style={{ color: 'var(--secondary)', marginBottom: '24px' }}>Send a Message</h3>

              {submitted ? (
                <div className="alert alert-success">
                  ✅ Thank you! Your message has been sent. We'll be in touch soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        required
                        value={form.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Select a subject…</option>
                      <option>Room Booking Enquiry</option>
                      <option>Wedding Planning</option>
                      <option>Restaurant Reservation</option>
                      <option>Pool & Spa</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Write your message here…"
                      required
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
