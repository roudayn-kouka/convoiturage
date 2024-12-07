const express = require('express');
const { getCovoitureursWithPaymentIssues,getPendingCovoitureurs, handleCovoitureurValidation, handleOffreValidation , loginAdmin} = require('../controllers/admin');
const auth = require('../middleware/authentification'); // Middleware général avec rôles

const router = express.Router();

// Routes d'authentification admin
router.post('/login', loginAdmin);

// Routes de gestion avec authentification admin
router.post('/validate-compte/:id', auth(['admin']), handleCovoitureurValidation);
router.post('/validate-offre/:id', auth(['admin']), handleOffreValidation);
router.get('/covoitureurs/payment-issues', auth(['admin']), getCovoitureursWithPaymentIssues);
router.get('/covoitureurs/pending', auth(['admin']), getPendingCovoitureurs);

module.exports = router;