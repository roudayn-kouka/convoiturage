import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './DriverReservations.css';

const DriverReservations = ({ driver, reservations, onBack }) => {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la liste
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{driver.name}</h2>
          <p className="text-gray-600">Tél: {driver.phone}</p>
          <p className="text-gray-600">Total des trajets: {driver.totalRides}</p>
        </div>

        <h3 className="text-lg font-medium mb-4">Offres</h3>
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border rounded-lg p-4">
              <p className="font-medium">{reservation.clientName}</p>
              <p className="text-gray-600">Tél: {reservation.phone}</p>
              <p className="text-gray-600">Montant: {reservation.amount} DT</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                reservation.status === 'confirmed' 
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverReservations;