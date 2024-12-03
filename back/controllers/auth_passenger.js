const Passenger = require('../models/passenger');
const checkPasswordUsage = require('../utils/checkPasswordUsage');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, InternalServerError } = require('../errors');

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérification si le mot de passe a déjà été utilisé
    const { isPasswordUsed, message } = await checkPasswordUsage(email, password);
    if (isPasswordUsed) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    // Vérification si l'email est déjà utilisé
    const existingPassenger = await Passenger.findOne({ email });
    if (existingPassenger) {
      throw new BadRequestError('Cet email est déjà utilisé par un autre passager.');
    }

    // Création d'un nouveau passager
    const passenger = await Passenger.create({ ...req.body });

    // Création du JWT
    const token = passenger.createJWT();

    // Réponse avec le nom du passager et le token
    res.status(StatusCodes.CREATED).json({
      passenger: { name: passenger.name },
      token,
    });
  } catch (error) {
    // Gestion des erreurs internes
    if (error instanceof BadRequestError) {
      throw error;  // Si c'est une erreur déjà gérée, la relancer
    }
    console.error('Erreur lors de l\'inscription du passager :', error);
    throw new InternalServerError('Erreur interne lors de l\'inscription.');
  }
}






const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    // Recherche du passager dans la base de données
    const passenger = await Passenger.findOne({ email });
    if (!passenger) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    // Vérification du mot de passe
    const isPasswordCorrect = await passenger.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Invalid Credentials');
    }

    // Création du token JWT
    const token = passenger.createJWT();

    // Réponse avec les informations du passager et le token
    res.status(StatusCodes.OK).json({
      passenger: { name: passenger.name },
      token,
    });
  } catch (error) {
    // Gestion des erreurs spécifiques
    if (error instanceof BadRequestError || error instanceof UnauthenticatedError) {
      throw error;  // Relancer l'erreur spécifique
    }
    // Gestion des erreurs internes
    console.error('Erreur lors de la connexion du passager :', error);
    throw new InternalServerError('Erreur interne lors de la connexion.');
  }
};

module.exports = {
  register,
  login,
}
