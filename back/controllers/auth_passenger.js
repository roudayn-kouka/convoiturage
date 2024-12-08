const Passenger = require('../models/passenger');
const checkEmailUsage = require('../utils/checkEmailUsage');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, InternalServerError } = require('../errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const register = async (req, res) => {
//   const {name, email,phoneNumber, password } = req.body;

//   try {
//     // Vérification si le mot de passe a déjà été utilisé
//     const { isPasswordUsed, message } = await checkPasswordUsage(email, password);
//     if (isPasswordUsed) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ message });
//     }

//     // Vérification si l'email est déjà utilisé
//     const existingPassenger = await Passenger.findOne({ email });
//     if (existingPassenger) {
//       return res.status(StatusCodes.BAD_REQUEST).json( 'cet email est deja utilisé' );
//     }

//     // Création d'un nouveau passager
//     const passenger = await Passenger.create({ ...req.body });

//     // Création du JWT
//     const token = passenger.createJWT();

//     // Réponse avec le nom du passager et le token
//     res.status(StatusCodes.CREATED).json({
//       passenger: { name: passenger.name,email:passenger.email,phone:passenger.phoneNumber },
//       token,
//     });
//   } catch (error) {
//     // Gestion des erreurs internes
//     if (error instanceof BadRequestError) {
//       throw error;  // Si c'est une erreur déjà gérée, la relancer
//     }
//     console.error('Erreur lors de l\'inscription du passager :', error);
//     return res.status(StatusCodes.BAD_REQUEST).json( `Erreur interne lors de l'inscription` );
//   }
// }

const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // Vérification si l'email est déjà utilisé
    const { isEmailUsed, message } = await checkEmailUsage(email);
    if (isEmailUsed) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message });
    }

    // Création d'un nouveau passager
    const passenger = await Passenger.create({ name, email, password, phoneNumber });

    // Création du JWT
    const token = passenger.createJWT();

    // Réponse avec le nom du passager et le token
    res.status(StatusCodes.CREATED).json({
      passenger: { name: name },
      token,
    });
  } catch (error) {
    // Gestion des erreurs internes
    if (error instanceof BadRequestError) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    console.error('Erreur lors de l\'inscription du passager :', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Erreur interne lors de l\'inscription.',
    });
  }
};






// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     if (!email || !password) {
//       throw new BadRequestError('Please provide email and password');
//     }

//     // Recherche du passager dans la base de données
//     const passenger = await Passenger.findOne({ email });
//     if (!passenger) {
//       throw new UnauthenticatedError('Invalid Credentials');
//     }

//     // Vérification du mot de passe
//     const isPasswordCorrect = await passenger.comparePassword(password);
//     if (!isPasswordCorrect) {
//       throw new UnauthenticatedError('Invalid Credentials');
//     }

//     // Création du token JWT
//     const token = passenger.createJWT();

//     // Réponse avec les informations du passager et le token
//     res.status(StatusCodes.OK).json({
//       passenger: { name: passenger.name,email:passenger.email,PasId:passenger._id,phoneNumber:passenger.phoneNumber },
//       token,
//     });
//   } catch (error) {
//     // Gestion des erreurs spécifiques
//     if (error instanceof BadRequestError || error instanceof UnauthenticatedError) {
//       throw error;  // Relancer l'erreur spécifique
//     }
//     // Gestion des erreurs internes
//     console.error('Erreur lors de la connexion du passager :', error);
//     throw new InternalServerError('Erreur interne lors de la connexion.');
//   }
// };


const updatepass = async (req, res) => {
  const { id, email, phone, password } = req.body;

  try {
    // Find the existing Passenger by ID
    const existingUser = await Passenger.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Passenger introuvable" });
    }

    const updatedFields = {
      phoneNumber: phone,
    };

    // Check if the provided email is different from the existing email
    if (email && email !== existingUser.email) {
      const emailExists = await Passenger.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
      updatedFields.email = email; // If email is different, update it
    }

    // Check if the password is provided and different from the current one
    if (password) {
      const bcrypt = require("bcryptjs");

      // Compare the provided password with the existing password
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        return res.status(400).json({ message: "Le mot de passe est identique à l'existant" });
      }

      // If the password is different, hash the new password and update it
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    // Update the user profile in the database
    const user = await Passenger.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });

    // Respond with the updated user profile
    res.status(200).json({ message: "Profil mis à jour avec succès", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur du serveur" });
  }
};


module.exports = {
  register,
  updatepass,
}
