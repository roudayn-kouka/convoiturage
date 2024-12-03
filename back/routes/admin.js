const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/auth_admin');
const { handleCovoitureurValidation, handleOffreValidation } = require('../controllers/admin');
const auth = require('../middleware/auth'); // Middleware général avec rôles

const router = express.Router();

// Routes d'authentification admin
router.post('/register', registerAdmin); // À utiliser une seule fois pour créer un admin
router.post('/login', loginAdmin);

// Routes de gestion avec authentification admin
router.post('/validate-covoitureur', auth(['admin']), handleCovoitureurValidation);
router.post('/validate-offre', auth(['admin']), handleOffreValidation);

module.exports = router;
