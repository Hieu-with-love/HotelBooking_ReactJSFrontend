import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const isMenuActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        <h3>ZOTEL</h3>
      </div>
      
      <div className="sidebar-menu">
        <Link 
          to="/partner/dashboard" 
          className={`sidebar-item ${location.pathname === '/partner/dashboard' ? 'active' : ''}`}
        >
          <span className="material-icons">dashboard</span>
          <span className="sidebar-text">Dashboard</span>
        </Link>
        
        <Link 
          to="/partner/hotel-management" 
          className={`sidebar-item ${isMenuActive('/partner/hotel-management') ? 'active' : ''}`}
        >
          <span className="material-icons">apartment</span>
          <span className="sidebar-text">Hotel Management</span>
        </Link>
        
        <Link 
          to="/partner/room-management" 
          className={`sidebar-item ${isMenuActive('/partner/room-management') ? 'active' : ''}`}
        >
          <span className="material-icons">king_bed</span>
          <span className="sidebar-text">Room Management</span>
        </Link>
        
        <Link 
          to="/partner/discount-management" 
          className={`sidebar-item ${isMenuActive('/partner/discount-management') ? 'active' : ''}`}
        >
          <span className="material-icons">discount</span>
          <span className="sidebar-text">Discount Management</span>
        </Link>
        
        <Link 
          to="/partner/bookings" 
          className={`sidebar-item ${isMenuActive('/partner/bookings') ? 'active' : ''}`}
        >
          <span className="material-icons">book_online</span>
          <span className="sidebar-text">Bookings</span>
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <Link to="/partner/settings" className="sidebar-item">
          <span className="material-icons">settings</span>
          <span className="sidebar-text">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;