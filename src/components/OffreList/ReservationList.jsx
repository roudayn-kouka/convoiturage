import React from 'react';
import { Check, X } from 'lucide-react';
import './ReservationList.css';

const OffreList = ({ offres, onApprove, onReject, isPending = true, title }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        {title || (isPending ? 'Comptes en attente' : 'Comptes validés')}
      </h2>
      <div className="space-y-4">
        {offres.map((offre) => (
          <div key={offre._id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Nom & Prenom: {offre.name}</p>
              <p className="text-gray-600">Tél: {offre.phoneNumber}</p>
              <p className="text-gray-600">Email: {offre.email}</p>
              
            </div>
            {isPending && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(offre._id,offre.montant_payé)}
                  className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onReject(offre._id,offre.montant_payé)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffreList;
