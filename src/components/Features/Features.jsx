import React from 'react';
import { MapPin, Users, Shield, Clock, Leaf, CreditCard } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <MapPin />,
      title: 'Smart Route Matching',
      description: 'Our intelligent algorithm matches you with the perfect rides along your route'
    },
    {
      icon: <Users />,
      title: 'Verified Community',
      description: 'Connect with trusted drivers and passengers, all verified for your safety'
    },
    {
      icon: <Shield />,
      title: 'Secure Rides',
      description: 'Enhanced security features and real-time ride tracking for peace of mind'
    },
    {
      icon: <Clock />,
      title: 'Flexible Scheduling',
      description: 'Find rides that match your schedule, whether it\'s daily commute or one-time trips'
    },
    {
      icon: <Leaf />,
      title: 'Eco-Friendly',
      description: 'Reduce your carbon footprint while saving money on transportation'
    },
    {
      icon: <CreditCard />,
      title: 'Easy Payments',
      description: 'Hassle-free, secure payment system for all your rides'
    }
  ];

  return (
    <div className="features">
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;