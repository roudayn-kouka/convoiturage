import React from 'react';
import { Car, Search, Users, Calendar, MessageSquare, Settings, LogOut,MapPin,CalendarCheck,MapPinPlus,ClipboardList,} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  /*const menuItems = [
    { icon: Search, text: 'Rechercher des trajets', path: '/dashboard/' },
    { icon: Car, text: 'Mes trajets', path: '/dashboard/my-rides' },
    { icon: CalendarCheck, text: 'Mes réservations', path: '/dashboard/reservations' },
    { icon: MapPinPlus, text: 'Créer un trajet', path: '/dashboard/addtrajet' },
    { icon: ClipboardList, text: 'Gestion réservations', path: '/dashboard/GestionRev' },
  ];*/

  const role = localStorage.getItem('role');


  // Menu items pour conducteur
  const driverMenuItems = [
    { icon: Car, text: 'Mes trajets', path: '/dashboard/my-rides' },
    { icon: MapPinPlus, text: 'Créer un trajet', path: '/dashboard/addtrajet' },
    { icon: ClipboardList, text: 'Gestion réservations', path: '/dashboard/GestionRev' },

  ];

  // Menu items pour passager
  const passengerMenuItems = [
    { icon: Search, text: 'Rechercher des trajets', path: '/dashboard/Rechercher' },
    { icon: CalendarCheck, text: 'Mes réservations', path: '/dashboard/reservations' },
  ];
  // Choisir les items en fonction du rôle
  const menuItems = role === 'driver' ? driverMenuItems : passengerMenuItems;

  const handleLogout = () => {
    // Récupérer le rôle depuis localStorage
    const role = localStorage.getItem('role');
    
    // Rediriger vers la page de connexion correspondante
    if (role === 'passenger') {
      window.location.href = '/signin';
    } else if (role === 'driver') {
      window.location.href = '/signincov';
    } 
    // Optionnel : Effacer les données de session/localStorage
    localStorage.clear();
  };
  return (
    <div className="sidebar-container">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="title-container">
          <Car className="icon" />
          <h1 className="sidebar-title">Merwe7a Merte7a</h1>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
