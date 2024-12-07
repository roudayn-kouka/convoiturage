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
import GestionRev from '../GestionRev/GestionRev'

const Dashboard = () => {
  const navigate = useNavigate();
const role = localStorage.getItem('role'); // Récupère le rôle depuis le stockage local

  const [passenger, setPassenger] = useState({ name: '', email: '' });

  // Fetch user info from localStorage
  useEffect(() => {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const image = localStorage.getItem('image')
    const token = localStorage.getItem('token')
    const Id = localStorage.getItem('ID')

    if (name && email) {
      if(!image){
      setPassenger({ name, email,Id,token });
      }
      else{
        setPassenger({ name, email,image,Id,token });
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
              <Route path="/all-rides" element={<Rides passenger={passenger} />} />
              <Route path="/my-rides" element={<RideCond passenger={passenger}/>} />
              <Route path="/reservations" element={<RidePassg passenger={passenger}/>} />
              <Route path="/addtrajet" element={<AddRide passenger={passenger}/>} />
              <Route path="/updateride/:rideId" element={<UpdateRide passenger={passenger}/>} />

              <Route path="/GestionRev" element={<GestionRev passenger={passenger}/>} />
              <Route path="/ProfilCond" element={<ProfilCond />} />
              <Route path="/ProfilPass" element={<ProfilPass />} />

            </Routes>
          </main>

        </div>
      </div>
    
  );
};

export default Dashboard;
