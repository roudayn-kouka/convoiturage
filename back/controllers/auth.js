const Covoitureur = require('../models/covoitureur');
const Passenger = require('../models/passenger');
const Admin = require('../models/admin');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, InternalServerError } = require('../errors');




const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Veuillez fournir un email et un mot de passe' });
    }
    try {
      // Liste des modèles à vérifier pour l'authentification
      const models = [
        { model: Covoitureur, role: 'driver' },
        { model: Passenger, role: 'passenger' },
        { model: Admin, role: 'admin' },
      ];
  
      let user = null;
      let role = null;
  
      // Parcourir chaque modèle pour trouver l'utilisateur
      for (const { model, role: currentRole } of models) {
        user = await model.findOne({ email });
        if (user) {
          role = currentRole;
          break;
        }
      }
  
      // Si aucun utilisateur n'est trouvé
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Identifiants invalides' });
      }
  
      // Vérification du mot de passe
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Identifiants invalides' });
      }
  
      // Pour les covoitureurs, vérifier si le compte est validé
      // if (role === 'driver' && !user.isValidated) {
      //   return res.status(StatusCodes.FORBIDDEN).json({
      //     message: 'Votre compte n\'a pas encore été validé par un administrateur.',
      //   });
      // }
  
      // Génération du JWT (token)
      const token = user.createJWT();
  
      // Réponse avec les informations de l'utilisateur et le token
      res.status(StatusCodes.OK).json({
        user: { name: user.name || "",email:user.email,image:user.image || "",UserId:user._id , phoneNumber:user.phoneNumber || "" , solde:user.solde || "", montant_payé:user.montant_payé || "",Role:role},
        token,
      });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne lors de la connexion.' });
    }
  };
  


  module.exports = {login}