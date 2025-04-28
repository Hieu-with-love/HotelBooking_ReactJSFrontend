import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import './Header.css';

const Header = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
  
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span className="material-icons">menu</span>
        </button>
        <h2>Partner Dashboard</h2>
      </div>
      <div className="header-right">
        <div className="user-greeting">
          Hello, {user?.name || 'Partner'}!
        </div>
        <div className="dropdown">
          <button className="dropdown-trigger">
            <span className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </span>
          </button>
          <div className="dropdown-menu">
            <div className="dropdown-item">Profile</div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={handleLogout}>Logout</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;