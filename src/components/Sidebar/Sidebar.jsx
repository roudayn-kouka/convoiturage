import React from 'react';
import { Car, Calendar, UserCheck, Users, LogOut } from 'lucide-react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing tokens)
    navigate('/signin'); // Navigate to the /signin page
  };
  return (
    <div className="relative bg-emerald-700 text-white h-70 w-64 p-6">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1121&q=80')] opacity-10" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-8">
          <Car className="w-8 h-8" />
          <h1 className="text-xl font-bold">Merwe7a Merte7a</h1>
        </div>

        <nav className="space-y-4">
          <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === 'reservations'
                ? 'bg-emerald-600'
                : 'hover:bg-emerald-600/50'
            }`}
            onClick={() => onSectionChange('reservations')}
          >
            <Calendar className="w-5 h-5" />
            <span>Réservations</span>
          </button>

          <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === 'accounts'
                ? 'bg-emerald-600'
                : 'hover:bg-emerald-600/50'
            }`}
            onClick={() => onSectionChange('accounts')}
          >
            <UserCheck className="w-5 h-5" />
            <span>Validation Comptes</span>
          </button>

          <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === 'drivers'
                ? 'bg-emerald-600'
                : 'hover:bg-emerald-600/50'
            }`}
            onClick={() => onSectionChange('drivers')}
          >
            <Users className="w-5 h-5" />
            <span>Covoitureurs</span>
          </button>
          <button
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeSection === 'offres'
                ? 'bg-emerald-600'
                : 'hover:bg-emerald-600/50'
            }`}
            onClick={() => onSectionChange('offres')}
          >
            <UserCheck className="w-5 h-5" />
            <span>Validation Offres</span>
          </button>
        </nav>
        <br></br>
        <button className=" bottom-6 left-0 w-full flex items-center gap-3 p-3  hover:bg-emerald-600/50 rounded-lg transition-colors" onClick={handleLogout}>
        
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
