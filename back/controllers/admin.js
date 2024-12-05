const Covoitureur = require('../models/Covoitureur');
const Admin = require('../models/Admin');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const sendEmail = require('../services/emailService'); // Fonction utilitaire pour envoyer des emails






// Connexion d'un administrateur
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Veuillez fournir un email et un mot de passe');
  }

  const admin = await Admin.findOne({ email });
  console.log(admin)
  if (!admin) {
    throw new UnauthenticatedError('Identifiants invalides');
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  console.log(isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Identifiants invalides');
  }

  const token = admin.createJWT();
  res.status(StatusCodes.OK).json({ admin: { name: admin.name }, token });
};




// Valider ou refuser une inscription


const handleCovoitureurValidation = async (req, res) => {
  const { userId, action, montantPaye } = req.body; // `action` : 'accept' ou 'reject'

  const covoitureur = await Covoitureur.findById(userId);
  if (!covoitureur) {
    throw new BadRequestError('Covoitureur non trouvé');
  }

  if (action === 'accept') {
    covoitureur.isValidated = true; // Valider le covoitureur
    if (montantPaye) {
      covoitureur.montant_payé += montantPaye; // Mettre à jour le montant payé si fourni
    }
    await covoitureur.save();
    return res.status(StatusCodes.OK).json({ message: 'Covoitureur validé avec succès' });
  }

  if (action === 'reject') {
    // Envoi d'un email en cas de rejet
    const subject = 'Rejet de votre inscription';
    const text = `
      Bonjour ${covoitureur.name},

      Merci pour votre inscription. Veuillez d'abord contacter l'administrateur sur le numéro : 55000541 pour finaliser votre validation.
    `;

    try {
      await sendEmail(covoitureur.email, subject, text);
      console.log('Email de rejet envoyé à', covoitureur.email);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    }

    return res.status(StatusCodes.OK).json({ message: 'Inscription rejetée et email envoyé.' });
  }

  throw new BadRequestError('Action non valide');
};




// Valider ou refuser une demande de création d'offre
const handleOffreValidation = async (req, res) => {
  const { userId, action, montantPaye } = req.body;

  const covoitureur = await Covoitureur.findById(userId);
  if (!covoitureur) {
    throw new BadRequestError('Covoitureur non trouvé');
  }

  if (action === 'accept') {
    covoitureur.montant_payé += montantPaye; // Mettre à jour le montant payé
    await covoitureur.save();
    return res.status(StatusCodes.OK).json({ message: 'Montant mis à jour et demande acceptée' });
  }

  if (action === 'reject') {
    // Envoi d'un email en cas de rejet
    const subject = 'Rejet de votre demande de création d\'offre';
    const text = `
      Bonjour ${covoitureur.name},

      Merci. Veuillez contacter l'administrateur sur le numéro : 55000541. Votre montant payé est insuffisant pour valider votre offre.
    `;

    try {
      await sendEmail(covoitureur.email, subject, text);
      console.log('Email de rejet envoyé à', covoitureur.email);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    }

    return res.status(StatusCodes.OK).json({ message: 'Demande rejetée et email envoyé.' });
  }

  throw new BadRequestError('Action non valide');
}

module.exports = { handleCovoitureurValidation, handleOffreValidation , loginAdmin }
