const Covoitureur = require('../models/covoitureur');
const Admin = require('../models/admin');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const sendEmail = require('../services/emailService'); // Fonction utilitaire pour envoyer des emails
const Offre = require("../models/offre");
const Reservation = require('../models/reservation')
const Passenger = require('../models/passenger')



// Connexion d'un administrateur
// const loginAdmin = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new BadRequestError('Veuillez fournir un email et un mot de passe');
//   }

//   const admin = await Admin.findOne({ email });
//   console.log(admin)
//   if (!admin) {
//     throw new UnauthenticatedError('Identifiants invalides');
//   }

//   const isPasswordCorrect = await admin.comparePassword(password);
//   console.log(isPasswordCorrect)
//   if (!isPasswordCorrect) {
//     throw new UnauthenticatedError('Identifiants invalides');
//   }

//   const token = admin.createJWT();
//   res.status(StatusCodes.OK).json({ admin: { name: admin.name }, token });
// };




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
    covoitureur.isPaymentInsuffisant = false
    covoitureur.commission_plateforme = 0
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



const getPendingCovoitureurs = async (req, res) => {
  try {
    const Accounts = await Covoitureur.find({ isValidated: false });
    res.status(200).json({pendingAccounts:Accounts});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending accounts' });
  }
}


const getCovoitureursWithPaymentIssues = async (req, res) => {
  try {
    // Récupérer tous les covoitureurs avec isPaymentInsufficient = true
    const covoitureurs = await Covoitureur.find({ isPaymentInsuffisant: true });

    if (covoitureurs.length === 0) {
      return res.status(StatusCodes.OK).json({ message: 'Aucun covoitureur avec un problème de paiement.' });
    }

    res.status(StatusCodes.OK).json({ pendingOffres:covoitureurs });
  } catch (error) {
    console.error('Erreur lors de la récupération des covoitureurs :', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erreur interne du serveur' });
  }
};


const getAllCov= async (req, res) => {
  try {
    const covoitureurs = await Covoitureur.find({});
    res.status(200).json(covoitureurs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch covoitureurs' });
  }
};


const getReservations = async (req, res) => {
  try {
     
    const reservations = await Reservation.find({});

    // Fetch associated offers and drivers for each reservation
    const reservationsWithDetails = await Promise.all(
      reservations.map(async (reservation) => {
        // Fetch the related offer
        const offer = await Offre.findById(reservation.offre).select('lieu_depart lieu_arrivée dateDepart heureDepart gouvernorat_depart gouvernorat_arrivée prixparplace createdBy');
        const passenger = await Passenger.findById(reservation.passenger).select('name email');
        // Fetch the driver details for the offer
        const driver = await Covoitureur.findById(offer.createdBy).select('name email');

        // Combine the details into a single object
        return {
          ...reservation.toObject(),
          passenger,
          offer,
          driver,
        };
      })
    );

    res.status(200).json({ reservations: reservationsWithDetails });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'An error occurred while fetching reservations.' });
  }
};












module.exports = {
   handleCovoitureurValidation, handleOffreValidation  ,getPendingCovoitureurs,
    getCovoitureursWithPaymentIssues, getAllCov, getReservations,}
