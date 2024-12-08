const Passenger = require('../models/passenger');
const Covoitureur = require('../models/covoitureur');
const Admin=require('../models/admin')

const checkEmailUsage = async (email) => {
  // Liste des modèles à vérifier
  const models = [
    { model: Passenger, role: 'Passenger' },
    { model: Covoitureur, role: 'Covoitureur' },
    { model: Admin, role: 'Admin' },
  ];

  // Vérifier si l'email existe déjà dans l'un des modèles
  for (const { model, role } of models) {
    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return {
        isEmailUsed: true,
        message: `Cet email est déjà utilisé par un autre utilisateur (${role}). Veuillez choisir un autre email.`,
      };
    }
  }

  // Si l'email n'est pas utilisé
  return {
    isEmailUsed: false,
  };
};


module.exports = checkEmailUsage;