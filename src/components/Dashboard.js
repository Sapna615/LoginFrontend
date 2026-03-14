import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}!</h2>
          <div className="user-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Profile Information</h3>
            <p>View and update your personal information</p>
            <button className="btn btn-primary">Edit Profile</button>
          </div>
          <div className="dashboard-card">
            <h3>Account Settings</h3>
            <p>Manage your account preferences and security</p>
            <button className="btn btn-primary">Settings</button>
          </div>
          <div className="dashboard-card">
            <h3>Activity Log</h3>
            <p>View your recent account activity</p>
            <button className="btn btn-primary">View Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
