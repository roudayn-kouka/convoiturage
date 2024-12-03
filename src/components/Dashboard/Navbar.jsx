import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar-container">
      <h2 className="navbar-title">Dashboard</h2>

      <div className="navbar-right">
        <div
          className={`user-info ${isDropdownOpen ? 'open' : ''}`}
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <div className="user-details">
            <p className="user-name">
              John Doe <ChevronDown className="arrow-icon" />
            </p>
            <p className="user-email">john.doe@example.com</p>
          </div>
          <div className="user-avatar">
            <User className="user-icon" />
          </div>

          {/* Dropdown Menu */}
          <div
            className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}
            role="menu"
          >
            <div className="dropdown-item" role="menuitem">
              Profile
            </div>
           
            <div className="dropdown-item" role="menuitem">
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
