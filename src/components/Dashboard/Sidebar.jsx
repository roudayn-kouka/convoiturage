import React from 'react';
import { Car, Search, Users, Calendar, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Search, text: 'Search Rides', path: '/dashboard/' },
    { icon: Users, text: 'My Rides', path: '/dashboard/my-rides' },
    { icon: Calendar, text: 'Mes réservations', path: '/dashboard/reservations' },
    { icon: MessageSquare, text: 'Créer un trajet', path: '/dashboard/addtrajet' },
    { icon: Settings, text: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar-container">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="title-container">
          <Car className="icon" />
          <h1 className="sidebar-title">Merwe7a Merte7a</h1>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
