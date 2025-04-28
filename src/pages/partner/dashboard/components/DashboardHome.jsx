import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './DashboardHome.css';

const DashboardHome = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <h1>Welcome, {currentUser?.name || 'Partner'}!</h1>
        <p>Manage your hotels, rooms, and discounts from this central dashboard.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon hotel-icon">
            <span className="material-icons">hotel</span>
          </div>
          <div className="stat-content">
            <h3>Hotels</h3>
            <p className="stat-number">2</p>
            <span className="stat-label">Active Properties</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon room-icon">
            <span className="material-icons">meeting_room</span>
          </div>
          <div className="stat-content">
            <h3>Rooms</h3>
            <p className="stat-number">15</p>
            <span className="stat-label">Total Rooms</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon booking-icon">
            <span className="material-icons">calendar_today</span>
          </div>
          <div className="stat-content">
            <h3>Bookings</h3>
            <p className="stat-number">8</p>
            <span className="stat-label">Upcoming Reservations</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon discount-icon">
            <span className="material-icons">local_offer</span>
          </div>
          <div className="stat-content">
            <h3>Discounts</h3>
            <p className="stat-number">3</p>
            <span className="stat-label">Active Promotions</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <a href="/partner/hotel-management" className="action-card">
            <span className="material-icons">add_business</span>
            <span>Add New Hotel</span>
          </a>
          <a href="/partner/room-management" className="action-card">
            <span className="material-icons">add_home</span>
            <span>Add New Room</span>
          </a>
          <a href="/partner/discount-management" className="action-card">
            <span className="material-icons">percent</span>
            <span>Create Discount</span>
          </a>
          <a href="/partner/bookings" className="action-card">
            <span className="material-icons">list_alt</span>
            <span>View Bookings</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;