import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Your Journey.<br/><span className="highlight">Shared.</span></h1>
        <p>Join thousands of people who trust Merwe7a for their daily commute. Save money, reduce your carbon footprint, and make new friends along the way.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Find a Ride</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;