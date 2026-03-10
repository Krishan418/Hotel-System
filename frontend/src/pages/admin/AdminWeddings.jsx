import React from 'react';
import PageHeader from '../../components/PageHeader';

function AdminWeddings() {
  return (
    <div className="admin-page">
      <PageHeader 
        title="Wedding Management" 
        subtitle="Manage wedding inquiries, bookings, and event spaces." 
      />
      <div className="admin-content">
        <p>Wedding Management dashboard under construction.</p>
        <div className="card">
          <h3>Upcoming Events</h3>
          <p>No upcoming events.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminWeddings;
