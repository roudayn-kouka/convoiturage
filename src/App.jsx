import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import SignUp from './components/Auth/SignUp';
import SignUpCov from './components/Auth/SignUpCov';
import SignInCov from './components/Auth/SignInCov';

import SignIn from './components/Auth/SignIn';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './components/AboutUs/AboutUs';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardAdmin from './pages/Dashboard/Dashboard'

function App() {
  
  return (
    <Router>
      <div className="app">

        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signupcov" element={<SignUpCov />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signincov" element={<SignInCov />} />

          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/DashboardAdmin" element={<DashboardAdmin />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;