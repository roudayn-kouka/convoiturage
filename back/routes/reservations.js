const { 
    createReservation,
    confirmReservation,
    rejectReservation,
    cancelReservation,
    updateReservation,
    deleteReservation,
    getPassengerReservations,
    getReservationsForCovoitureur,
  } = require('../controllers/reservation');
  const express = require('express');
  const auth = require('../middleware/authentification'); // Middleware pour authentification et rôle
  
  const router = express.Router();
  
  // Routes protégées avec auth et rôles
  router.route('/').post(auth(['passenger']), createReservation); // Seuls les passagers peuvent créer une réservation

  router.route('/consulter').get(auth(['passenger']), getPassengerReservations);
  
  router.route('/confirme/:id').patch(auth(['covoitureur']), confirmReservation); // Seuls les covoitureurs peuvent confirmer une réservation
  
  router.route('/annuler/:id').patch(auth(['passenger']), cancelReservation); // Seuls les passagers peuvent annuler une réservation
  
  router.route('/update/:id').patch(auth(['passenger']), updateReservation); // Seuls les passagers peuvent mettre à jour une réservation
  
  router.route('/refuse/:id').patch(auth(['covoitureur']), rejectReservation); // Seuls les covoitureurs peuvent refuser une réservation
  
  router.route('/delete/:id').patch(auth(['admin']), deleteReservation); // Seuls les administrateurs peuvent supprimer une réservation

  router.route('/consultercov').get(auth(['covoitureur']), getReservationsForCovoitureur);
  
  module.exports = router;
  