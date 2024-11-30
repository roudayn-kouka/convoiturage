import React from 'react';
import Hero from '../Hero/Hero';
import Features from '../Features/Features';
import Stats from '../Stats/Stats';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const Home = () => {
  return (
    
    <>
    <Navbar/>
      <Hero />
      <Stats />
      <Features />
      <Footer />
    </>
  );
};

export default Home;