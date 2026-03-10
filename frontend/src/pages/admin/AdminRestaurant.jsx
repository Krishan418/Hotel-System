import React from 'react';
import PageHeader from '../../components/PageHeader';

function AdminRestaurant() {
  return (
    <div className="admin-page">
      <PageHeader 
        title="Restaurant Management" 
        subtitle="Manage restaurant menus, dining hours, and special events." 
      />
      <div className="admin-content">
        <p>Restaurant Management dashboard under construction.</p>
        <div className="card">
          <h3>Current Menu Items</h3>
          <p>Menu features are currently managed in the backend.</p>
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurant;
