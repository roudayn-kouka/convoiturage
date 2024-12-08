import React from 'react';
import './DriverList.css';

const DriverList = ({ drivers, onDriverSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Liste des covoitureurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.length > 0 ? (
          drivers.map((driver) => (
            <div
              key={driver._id}
              onClick={() => onDriverSelect(driver._id)}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">{driver.name}</p>
              <p className="text-gray-600">Tél: {driver.phoneNumber}</p>
              <p className="text-gray-600">Solde: {driver.solde} TND</p>
              <p className="text-gray-600">Montant_payé: {driver.montant_payé} TND</p>
              <p className="text-gray-600">Commission: {driver.commission_plateforme} TND</p>
              <p className="text-emerald-600 text-sm mt-2">
                Cliquez pour voir les offres
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun covoitureur trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default DriverList;
