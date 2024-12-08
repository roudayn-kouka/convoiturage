import React from 'react';

const ReservationList = ({ reservations}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4"></h2>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation._id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">Client: {reservation.passenger.name}</p>
              <p className="text-gray-600">Covoitureur: {reservation.driver.name}</p>
              <p className="text-gray-600">Gouvernorat Depart: {reservation.offer.gouvernorat_depart}</p>
              <p className="text-gray-600">Lieu Depart: {reservation.offer.lieu_depart}</p>
              <p className="text-gray-600">Gouvernorat Arrivée: {reservation.offer.gouvernorat_arrivée}</p>
              <p className="text-gray-600">Lieu Arrivée: {reservation.offer.lieu_arrivée}</p>
              <p className="text-gray-600">Date Depart: {new Date(reservation.offer.dateDepart).toLocaleDateString('en-GB')}</p>
              <p className="text-gray-600">Heure Depart: {reservation.offer.heureDepart}</p>
              <p className="text-gray-600">Nombre de places réservées: {reservation.numbreplacereservée}</p>
              <p className="text-gray-600">Montant: {reservation.offer.prixparplace * reservation.numbreplacereservée} DT</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
