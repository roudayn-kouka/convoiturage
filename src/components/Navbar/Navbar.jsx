import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // State to control dropdown visibility for SignUp and SignIn
  const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);
  const [showSignInDropdown, setShowSignInDropdown] = useState(false);

  const handleSignUpHover = (isHovering) => {
    setShowSignUpDropdown(isHovering);
  };

  const handleSignInHover = (isHovering) => {
    setShowSignInDropdown(isHovering);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close any open dropdowns after navigation
    setShowSignUpDropdown(false);
    setShowSignInDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Car className="logo-icon" />
        <span className="logo-text">Merwe7a Merte7a</span>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/AboutUs">About us</Link>
        
        {/* Sign Up Dropdown */}
        <div 
          className={`custom-dropdown ${showSignUpDropdown ? 'active' : ''}`} 
          onMouseEnter={() => handleSignUpHover(true)}
          onMouseLeave={() => handleSignUpHover(false)}
        >
          <button className="btn-signup">Sign Up</button>
          <div className="custom-dropdown-menu">
            <button onClick={() => handleNavigation('/signupcov')}>Ride</button>
            <button onClick={() => handleNavigation('/signup')}>Client</button>
          </div>
        </div>

        {/* Sign In Dropdown */}
        <div 
          className={`custom-dropdown ${showSignInDropdown ? 'active' : ''}`} 
          onMouseEnter={() => handleSignInHover(true)}
          onMouseLeave={() => handleSignInHover(false)}
        >
          <button className="btn-login" onClick={() => handleNavigation('/signin')}>Login</button>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
