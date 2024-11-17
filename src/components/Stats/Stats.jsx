import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <div className="stats">
      <div className="stat-item">
        <h2>15K+</h2>
        <p>Active Users</p>
      </div>
      <div className="stat-item">
        <h2>50K+</h2>
        <p>Rides Shared</p>
      </div>
      <div className="stat-item">
        <h2>120K+</h2>
        <p>CO₂ Saved (kg)</p>
      </div>
    </div>
  );
};

export default Stats;