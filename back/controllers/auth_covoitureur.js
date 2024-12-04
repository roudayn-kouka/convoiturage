
require('dotenv').config();
const Covoitureur = require('../models/covoitureur');
const sendEmail = require('../services/emailService');
const checkPasswordUsage = require('../utils/checkPasswordUsage')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, InternalServerError } = require('../errors');

// Fonction d'inscription
const register = async (req, res) => {
  const { name, email, phoneNumber, password, image} = req.body;

  try {
    console.log('Début de la vérification du mot de passe')
    // Vérification si le mot de passe a déjà été utilisé
    const { isPasswordUsed, message } = await checkPasswordUsage(email, password);
    if (isPasswordUsed) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }
    console.log('Vérification du mot de passe terminée')
    console.log('Recherche d\'un utilisateur existant');
    // Vérifier si l'email est déjà utilisé
    const existingCovoitureur = await Covoitureur.findOne({ email });
    console.log('Recherche terminée :', existingCovoitureur)
    if (existingCovoitureur) {
      return res.status(StatusCodes.BAD_REQUEST).json( 'cet email est deja utilisé' );
    }
    console.log('Création du covoitureur...')
    // Créer un nouveau covoitureur
    const covoitureur = await Covoitureur.create({ ...req.body, isValidated: false });
    console.log('Covoitureur créé avec succès', covoitureur);
    // Envoi de l'email à l'administrateur
    const subject = 'Nouvelle inscription - Covoitureur'
    const text = `
    Un nouveau covoitureur s'est inscrit : 
    - Nom : ${name}
    - Email : ${email}
    - PhoneNumber : ${phoneNumber}

    Merci de valider ou refuser son compte dans le tableau de bord.`;

    try {
      console.log('Envoi de l\'email à l\'admin...');
      await sendEmail(process.env.ADMIN_EMAIL, subject, text);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email à l\'admin :', error);
    }

    // Réponse à l'utilisateur
    res.status(StatusCodes.CREATED).json({
      message: 'Inscription réussie. Votre compte doit être validé par un administrateur avant de pouvoir vous connecter.',
    });

  } catch (error) {
    // Gestion des erreurs
    if (error instanceof BadRequestError) {
      throw error;
    }
    console.error('Erreur dans la fonction register :', error);
    throw new InternalServerError('Erreur lors de l\'inscription du covoitureur');
  }
}








// Fonction de connexion
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  try {
    // Recherche du covoitureur dans la base de données
    const covoitureur = await Covoitureur.findOne({ email });
    if (!covoitureur) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    // Vérification si le compte est validé par un administrateur
    if (!covoitureur.isValidated) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: 'Votre compte n\'a pas encore été validé par un administrateur.',
      });
    }

    // Vérification du mot de passe
    const isPasswordCorrect = await covoitureur.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    // Génération du JWT (token)
    const token = covoitureur.createJWT();
    res.status(StatusCodes.OK).json({ covoitureur: { name: covoitureur.name,email:covoitureur.email,image:covoitureur.image }, token });

  } catch (error) {
    // Gestion des erreurs : si c'est une erreur spécifique, la relancer
    if (error instanceof UnauthenticatedError || error instanceof BadRequestError) {
      throw error;
    }
    // Erreur générique
    throw new InternalServerError('Erreur lors de la connexion');
  }
};







module.exports = {
  register,
  login,
};
