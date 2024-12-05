const Passenger = require('../models/passenger');
const Covoitureur = require('../models/covoitureur');

const checkPasswordUsage = async (email, password) => {
  // Vérifier dans le modèle Passenger
  const existingPassenger = await Passenger.findOne({ email });
  if (existingPassenger) {
    const isSamePassword = await existingPassenger.comparePassword(password);
    if (isSamePassword) {
      return {
        isPasswordUsed: true,
        message: "Le mot de passe est déjà utilisé par un autre utilisateur (Passenger). Veuillez choisir un autre mot de passe.",
      }
    }
  }

  // Vérifier dans le modèle Covoitureur
  const existingCovoitureur = await Covoitureur.findOne({ email });
  if (existingCovoitureur) {
    const isSamePassword = await existingCovoitureur.comparePassword(password);
    if (isSamePassword) {
      return {
        isPasswordUsed: true,
        message: "Le mot de passe est déjà utilisé par un autre utilisateur (Covoitureur). Veuillez choisir un autre mot de passe.",
      };
    }
  }

  // Si le mot de passe n'est pas utilisé
  return {
    isPasswordUsed: false,
  };
};

module.exports = checkPasswordUsage;
