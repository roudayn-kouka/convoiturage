/* const Passenger = require('../models/passenger');
const Reservation = require('../models/reservation');
const { StatusCodes } = require('http-status-codes');

// Ajouter des points après une réservation
const addPointsForPassenger = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId).populate('passenger');
  if (!reservation) {
    throw new Error('Réservation introuvable.');
  }

  const passenger = reservation.passenger;

  // Mise à jour des points et des réservations effectuées
  passenger.points += 10;
  passenger.reservationsCount += 1;

  // Vérification des 100 points pour appliquer une réduction
  let discount = 0;
  if (passenger.points >= 100) {
    if (passenger.reservationsCount % 11 === 0) {
      discount = 0.1; // Réduction de 10%
    }
    passenger.points -= 100; // Réinitialisation des points après utilisation
  }

  await passenger.save();

  return { discount, passenger };
};

module.exports = { addPointsForPassenger }; */

