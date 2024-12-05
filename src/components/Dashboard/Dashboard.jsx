import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate  } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Dashboard.css'; // Assurez-vous de lier votre fichier CSS
import Rides from '../Rides/Rides';
import RideCond from '../RideCond/RideCond';
import RidePassg from '../RidePassg/RidePassg';
import AddRide from '../AddRide/AddRide';
import UpdateRide from '../UpdateRide/UpdateRide';
import ProfilPass from '../Profil/ProfilPass';
import ProfilCond from '../Profil/ProfilCond';


const Dashboard = () => {
  const navigate = useNavigate();
const role = localStorage.getItem('role'); // Récupère le rôle depuis le stockage local

  const [passenger, setPassenger] = useState({ name: '', email: '' });

  // Fetch user info from localStorage
  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const image = localStorage.getItem('image')

    if (name && email) {
      if(!image){
      setPassenger({ name, email });
      }
      else{
        setPassenger({ name, email,image });
      }
    }
  }, []);
  return (
   
      <div className="dashboard-container">
        <Sidebar />
        
        <div className="content-container">
          <Navbar passenger={passenger}/>

          <main className="main-content">
            <Routes>
              {/* Route par défaut basée sur le rôle */}
            <Route
              path="/"
              element={
                role === 'driver' ? <Navigate to="/dashboard/my-rides" /> : <Navigate to="/dashboard/Rechercher" />
              }
            />

              <Route path="/Rechercher" element={<Rides />} />
              <Route path="/my-rides" element={<RideCond />} />
              <Route path="/reservations" element={<RidePassg />} />
              <Route path="/addtrajet" element={<AddRide />} />
              <Route path="/updateride/:rideId" element={<UpdateRide />} />

              <Route path="/GestionRev" element={<div>Gestion réservations</div>} />
              <Route path="/ProfilCond" element={<ProfilCond />} />
              <Route path="/ProfilPass" element={<ProfilPass />} />

            </Routes>
          </main>

        </div>
      </div>
    
  );
};

export default Dashboard;
