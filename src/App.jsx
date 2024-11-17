import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';


function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/AboutUs" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;