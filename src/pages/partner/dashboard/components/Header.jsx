import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Link to={'/partner/dashboard'}>Menu</Link>
        </button>
        <Link to={'/partner'}>Partner Dashboard</Link>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          <span className="material-icons">Notifications</span>
          <span className="notification-badge">2</span>
        </div>
        <div className="user-greeting">
          Hello, Partner!
        </div>
        <div className="dropdown">
          <button className="dropdown-trigger" aria-label="User menu">
            <span className="user-avatar">P</span>
          </button>
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <strong>Partner Account</strong>
              <small>partner@example.com</small>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item">
              <span className="material-icons">person</span>
              Profile
            </div>
            <div className="dropdown-item">
              <span className="material-icons">settings</span>
              Settings
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item">
              <span className="material-icons">logout</span>
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;