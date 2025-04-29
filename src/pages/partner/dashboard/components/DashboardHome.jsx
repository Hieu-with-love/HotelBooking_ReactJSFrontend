import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardHome.css';

const DashboardHome = () => {
  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome, Partner!</h1>
        <p>Manage your hotels, rooms, and discounts from this central dashboard.</p>
      </div>
      
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="card-icon hotel-icon">
            <span className="material-icons">hotel</span>
          </div>
          <div className="card-content">
            <h3>2</h3>
            <p>Hotels</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon room-icon">
            <span className="material-icons">meeting_room</span>
          </div>
          <div className="card-content">
            <h3>15</h3>
            <p>Rooms</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon booking-icon">
            <span className="material-icons">calendar_today</span>
          </div>
          <div className="card-content">
            <h3>8</h3>
            <p>Bookings</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-icon discount-icon">
            <span className="material-icons">local_offer</span>
          </div>
          <div className="card-content">
            <h3>3</h3>
            <p>Discounts</p>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h2><span className="material-icons">flash_on</span> Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/partner/hotel-management" className="action-card">
            <span className="material-icons">add_business</span>
            <h3>Add New Hotel</h3>
            <p>Create a new hotel listing</p>
          </Link>
          <Link to="/partner/room-management" className="action-card">
            <span className="material-icons">add_home</span>
            <h3>Add New Room</h3>
            <p>Add rooms to your hotels</p>
          </Link>
          <Link to="/partner/discount-management" className="action-card">
            <span className="material-icons">percent</span>
            <h3>Create Discount</h3>
            <p>Set up special offers</p>
          </Link>
          <Link to="/partner/bookings" className="action-card">
            <span className="material-icons">list_alt</span>
            <h3>View Bookings</h3>
            <p>Manage all reservations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;