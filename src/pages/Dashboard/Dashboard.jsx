import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ReservationList from '../../components/ReservationList/ReservationList';
import AccountList from '../../components/AccountList/AccountList';
import DriverList from '../../components/DriverList/DriverList';
import OffreList from '../../components/OffreList/ReservationList'
import DriverReservations from '../../components/DriverReservations/DriverReservations';
import './Dashboard.css';
import axios from 'axios'; // For HTTP requests
const token = localStorage.getItem('token')
const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('reservations');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [pendingOffres, setPendingOffres] = useState([]);

  useEffect(() => {
    if (activeSection === 'drivers') {
      fetchDrivers();
    }
    if (activeSection === 'reservations') {
      fetchReservations();
    }
    if (activeSection === 'accounts') {
      fetchPendingAccounts();
    }
    if (activeSection === 'offres') {
      fetchPendingOffres();
    }
  }, [activeSection]);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/admin/covoitureurs/consulter',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to fetch covoitureurs:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/admin/reservations/consulter',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(response.data.reservations);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  const fetchPendingAccounts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/admin/covoitureurs/pending',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.pendingAccounts){
        setPendingAccounts(response.data.pendingAccounts);
      }
      else{
        setPendingAccounts([]);
      }
    } catch (error) {
      console.error('Failed to fetch pending accounts:', error);
    }
  };


  const fetchPendingOffres = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/admin/covoitureurs/offres/pending',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.data.pendingOffres){
        setPendingOffres(response.data.pendingOffres);
      }
      else{
        setPendingOffres([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch pending accounts:', error);
    }
  };

  const handleApproveAccount = async (id,montantp) => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/admin/covoitureurs/validate',
        { userId: id, action: 'accept',montant_payé:montantp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingAccounts((prev) => prev.filter((account) => account._id !== id));
    } catch (error) {
      console.error('Failed to approve account:', error);
    }
  };


  const handleApproveOffre = async (id,montantp) => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/admin/covoitureurs/offres/validate',
        { userId: id, action: 'accept',montantPaye:montantp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingOffres((prev) => prev.filter((offre) => offre._id !== id));
    } catch (error) {
      console.error('Failed to approve account:', error);
    }
  };

  const handleRejectAccount = async (id) => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/admin/covoitureurs/validate',
        { userId: id, action: 'reject' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (error) {
      console.error('Failed to reject account:', error);
    }
  };


  const handleRejectOffre = async (id,montantp) => {
    try {
      await axios.post(
        'http://localhost:3000/api/v1/admin/covoitureurs/offres/validate',
        { userId: id, action: 'reject',montantPaye:montantp},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingOffres((prev) => prev.filter((offre) => offre._id !== id));
    } catch (error) {
      console.error('Failed to reject account:', error);
    }
  };

  const handleDriverSelect = (driverId) => {
    setSelectedDriver(driverId);
  };

  const handleBackToDrivers = () => {
    setSelectedDriver(null);
  };

  const renderContent = () => {
    if (activeSection === 'drivers' && selectedDriver) {
      return (
        <DriverReservations
          driver={drivers.find((d) => d.id === selectedDriver)}
          reservations={reservations.filter((r) => r.driverId === selectedDriver)}
          onBack={() => setSelectedDriver(null)}
        />
      );
    }

    switch (activeSection) {
      case 'reservations':
        return (
          <div className="space-y-6">
            <ReservationList reservations={reservations} isPending={false} />
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-6">
            <AccountList
              accounts={pendingAccounts}
              onApprove={handleApproveAccount}
              onReject={handleRejectAccount}
              isPending={true}
              title="Validation des Comptes"
            />
          </div>
        );
        case 'offres':
        return (
          <div className="space-y-6">
            <OffreList
              offres={pendingOffres}
              onApprove={handleApproveOffre}
              onReject={handleRejectOffre}
              isPending={true}
              title="Validation des offres"
            />
          </div>
        );
      case 'drivers':
        return <DriverList drivers={drivers} onDriverSelect={handleDriverSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
