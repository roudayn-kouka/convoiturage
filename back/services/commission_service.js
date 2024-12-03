/* const Covoitureur = require('../models/covoitureur');
const Reservation = require('../models/reservation');

// Ajouter des gains après une course
const addEarningsForCovoitureur = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId).populate('offre.covoitureur');
  if (!reservation) {
    throw new Error('Réservation introuvable.');
  }

  const covoitureur = reservation.offre.covoitureur;

  // Augmenter le compteur de courses
  covoitureur.coursesCount += 1;

  // Déterminer le taux de commission
  let commissionRate = 0.7; // Taux par défaut : 70%

  if (covoitureur.coursesCount === 11) {
    // Appliquer 80% pour la 11ᵉ course
    commissionRate = 0.8;
  } else if (covoitureur.coursesCount > 11) {
    // Réinitialiser le compteur et revenir à 70%
    covoitureur.coursesCount = 1;
    commissionRate = 0.7;
  }

  const totalAmount = reservation.numbreplacereservée * reservation.offre.prixParPlace;
  const earnings = totalAmount * commissionRate;

  // Ajouter les gains au solde
  covoitureur.solde += earnings;

  await covoitureur.save();

  return { earnings, commissionRate, covoitureur };
};

module.exports = { addEarningsForCovoitureur };
 */