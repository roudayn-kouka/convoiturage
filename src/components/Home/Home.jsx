import React from 'react';
import Hero from '../Hero/Hero';
import Features from '../Features/Features';
import Stats from '../Stats/Stats';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import Values from '../Values/Values';
import Safety from '../Safety/Safety';
import Impact from '../Impact/Impact';
import News from '../News/News';
import OurTeam from '../OurTeam/OurTeam'
const Home = () => {
  return (
    
    <>
    <Navbar/>
      <Hero />
      <Stats />
      <Values />
      <Safety />
      <Impact />
      <News />
      <Features />
      <OurTeam />
      <Footer />
    </>
  );
};

export default Home;