import React from 'react';
import './Footer.css';
import { Car } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="jdid">
          <div className="footer-left">
          <div className="navbar-brands">
           <Car className="footer-logo" />
           <div className="logo-text">
           <p >Merwe7a</p>
           <p >Merte7a</p>
           </div>
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon wiki"><i className="W"></i></a>
            <a href="#" className="social-icon facebook"><i className="f"></i></a>
            <a href="#" className="social-icon instagram"><i className="ig"></i></a>
            <a href="#" className="social-icon twitter"><i className="X"></i></a>
          </div>
          
         </div>
         <div className="footer-nav">
          <div className="footer-section">
            <h3>Our services</h3>
            <ul>
              <li><a href="#">City rides</a></li>
              <li><a href="#">City to City rides</a></li>
              <li><a href="#">Courier delivery</a></li>
              <li><a href="#">Freight delivery</a></li>
              <li><a href="#">Specialists</a></li>
              <li><a href="#">Why M.M</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Earn with us</h3>
            <ul>
              <li><a href="#">City rides</a></li>
              <li><a href="#">City to City rides</a></li>
              <li><a href="#">Courier delivery</a></li>
              <li><a href="#">Freight delivery</a></li>
              <li><a href="#">Specialists</a></li>
              <li><a href="#">M.M Money</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>For business</h3>
            <ul>
              <li><a href="#">Courier delivery</a></li>
              <li><a href="#">Freight delivery</a></li>
              <li><a href="#">Why M.M</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Values</h3>
            <ul>
            <li><a href="#">Safety</a></li>
            <li><a href="#">Accessibility</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Trust</a></li>
            <li><a href="#">Community</a></li>
            </ul>
          </div>
         </div>
        </div>
        

        <div className="footer-links">
          <div className="copyright">
            © SUOL INNOVATIONS LTD, 2024-2025
          </div>
          <div className="legal-links">
            <a href="#">Legal documents</a>
            <a href="#">Terms of use</a>
            <a href="#">Delete account</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;