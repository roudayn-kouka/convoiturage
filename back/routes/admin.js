const express = require('express');
const { handleCovoitureurValidation, handleOffreValidation, loginAdmin } = require('../controllers/admin');
const auth = require('../middleware/authentification'); // Middleware général avec rôles

const router = express.Router();

// Routes d'authentification admin
router.post('/login', loginAdmin);

// Routes de gestion avec authentification admin
router.post('/validate-covoitureur', auth(['admin']), handleCovoitureurValidation);
router.post('/validate-offre', auth(['admin']), handleOffreValidation);

module.exports = router;
