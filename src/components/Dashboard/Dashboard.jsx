import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Dashboard.css'; // Assurez-vous de lier votre fichier CSS
import Rides from '../Rides/Rides';
import RideCond from '../RideCond/RideCond';
import RidePassg from '../RidePassg/RidePassg';
import AddRide from '../AddRide/AddRide';


const Dashboard = () => {
  return (
   
      <div className="dashboard-container">
        <Sidebar />
        
        <div className="content-container">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Rides />} />
              <Route path="/my-rides" element={<RideCond />} />
              <Route path="/reservations" element={<RidePassg />} />
              <Route path="/addtrajet" element={<AddRide />} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Routes>
          </main>

        </div>
      </div>
    
  );
};

export default Dashboard;
