import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './dashboard.css';

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) {
      // Redirect to login if user is not authenticated
      navigate('/login', { state: { from: location.pathname } });
    }
    // Check if user is a partner
    else if (currentUser && !currentUser.roles.includes('PARTNER')) {
      navigate('/'); // Redirect non-partners to home
    }
  }, [currentUser, loading, navigate, location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} />
      <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header toggleSidebar={toggleSidebar} user={currentUser} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;