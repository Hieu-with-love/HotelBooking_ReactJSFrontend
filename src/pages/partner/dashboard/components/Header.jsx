import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/partner/login');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          Hello, {currentUser?.fullName || 'Partner'}!
        </div>
        <div className="dropdown" ref={dropdownRef}>
          <button className="dropdown-trigger" aria-label="User menu" onClick={toggleDropdown}>
            <span className="user-avatar">{currentUser?.fullName?.[0] || 'P'}</span>
          </button>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <div className="dropdown-header">
              <strong>{currentUser?.fullName || 'Partner Account'}</strong>
              <small>{currentUser?.email || 'partner@example.com'}</small>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={() => { navigate('/partner/profile'); setDropdownOpen(false); }}>
              <span className="material-icons">person</span>
              Profile
            </div>
            <div className="dropdown-item" onClick={() => { navigate('/partner/settings'); setDropdownOpen(false); }}>
              <span className="material-icons">settings</span>
              Settings
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={handleLogout}>
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