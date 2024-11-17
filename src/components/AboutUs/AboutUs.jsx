import React from 'react';
import './AboutUs.css'; 
import Footer from '../Footer/Footer';

const AboutUs = () => {
  return (
    <div>
    <div className="about-us-page">
      <div className="about-us-content">
        <h1>About Us</h1>
        <p>
        Welcome to Merwe7a Merte7a! Our mission is to make transportation easier, more affordable, and environmentally friendly for students of Campus El Manar. We are a dedicated carpooling platform specifically designed to connect students traveling to and from the campus. By offering a convenient way to share rides, we aim to reduce transportation costs, minimize environmental impact, and strengthen the campus community.
        </p>
        <p>
        Whether you're looking for a ride or offering one, Merwe7a Merte7a provides a safe, reliable, and simple way to find fellow students heading in the same direction. Join us in making every commute more enjoyable and sustainable! Together, let’s make travel a stress-free and community-driven experience.
        </p>
        <h2>Our Team</h2>
        <p>
          Our team consists of passionate individuals dedicated to improving the transportation experience. We are committed to
          providing excellent service and ensuring that our platform remains safe and secure for all users.
        </p>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default AboutUs;
