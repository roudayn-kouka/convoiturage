import React, { useState } from 'react';
import { User, ChevronDown, Radius } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ passenger }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Récupérer le rôle depuis localStorage
    const role = localStorage.getItem('role');
    
    // Rediriger vers la page de connexion correspondante
    if (role === 'passenger') {
      window.location.href = '/signin';
    } else if (role === 'driver') {
      window.location.href = '/signincov';
    } 
    // Optionnel : Effacer les données de session/localStorage
    localStorage.clear();
  };

  const handleProfil = () => {
    // Récupérer le rôle depuis localStorage
    const role = localStorage.getItem('role');
    
    // Rediriger vers la page de connexion correspondante
    if (role === 'passenger') {
      window.location.href = '/dashboard/ProfilPass';
    } else if (role === 'driver') {
      window.location.href = '/dashboard/ProfilCond';
    } 
  
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
            {passenger.name} <ChevronDown className="arrow-icon" />
            </p>
            <p className="user-email">{passenger.email}</p>
          </div>
          <div className="user-avatar">
            {passenger.image ? (
              <img
                src={passenger.image}
                alt={passenger.name || "User Avatar"}
                style={{ width: "40px", height: "40px", borderRadius: "20px" }}
              />
            ) : (
                <User className="user-icon" />
            )}
          </div>


          {/* Dropdown Menu */}
          <div
            className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}
            role="menu"
          >
            <div className="dropdown-item" role="menuitem" onClick={handleProfil}>
              Profil
            </div>
           
            <div className="dropdown-item" role="menuitem" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
