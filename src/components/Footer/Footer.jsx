import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">  
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Merwe7a Merte7a. All rights reserved. </p>
      </div>
    </footer>
  );
};

export default Footer;
