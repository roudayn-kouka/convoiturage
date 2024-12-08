const express = require('express');
const { getCovoitureursWithPaymentIssues,getPendingCovoitureurs, handleCovoitureurValidation, handleOffreValidation , getAllCov,getReservations} = require('../controllers/admin');
const auth = require('../middleware/authentification'); // Middleware général avec rôles

const router = express.Router();

// Routes d'authentification admin
// router.post('/login', loginAdmin);

// Routes de gestion avec authentification admin
router.post('/covoitureurs/validate',auth(['admin']), handleCovoitureurValidation);
router.post('/covoitureurs/offres/validate',auth(['admin']), handleOffreValidation);
router.get('/covoitureurs/offres/pending',auth(['admin']), getCovoitureursWithPaymentIssues);
router.get('/covoitureurs/pending',auth(['admin']), getPendingCovoitureurs);
router.get('/covoitureurs/consulter',auth(['admin']), getAllCov);
router.get('/reservations/consulter',auth(['admin']), getReservations);

module.exports = router;