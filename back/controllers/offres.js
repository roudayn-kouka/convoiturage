const Offre = require("../models/offre");
const Covoitureur = require("../models/covoitureur")
const villesParGouvernorat = require("../models/lieu");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors');
const sendEmail = require('../services/emailService');
require('dotenv').config()



const getAllOffresco = async (req, res) => {
  try {
    // Récupérer toutes les offres créées par le covoitureur connecté
    const offres = await Offre.find({ createdBy: req.user.userId });

    // Retourner les résultats
    res.status(StatusCodes.OK).json({ offres, count: offres.length });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres :', error);
    throw new InternalServerError('Erreur lors de la récupération des offres');
  }
}






const getAllOffres = async (req, res) => {
  try {
    const now = new Date(); // La date et l'heure actuelles

    // Calculer l'heure actuelle en minutes
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Récupérer les offres où la date de départ et l'heure de départ sont supérieures ou égales à l'heure actuelle
    const offres = await Offre.find({
      $or: [
        // Offres dont la date de départ est après aujourd'hui
        { dateDepart: { $gt: now } },

        // Offres dont la date de départ est aujourd'hui et l'heure de départ >= heure actuelle
        {
          dateDepart: { $eq: now.toISOString().split('T')[0] }, // Comparer seulement la date sans l'heure
          heureDepart: { $gte: currentTimeInMinutes }, // Comparer l'heure et les minutes actuelles
        },
      ],
    });
    // Retourner les résultats
    res.status(StatusCodes.OK).json({ offres, count: offres.length });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres :', error);
    throw new InternalServerError('Erreur lors de la récupération des offres');
  }
}








const getOffreco = async (req, res) => {
  try {
    const {
      user: { userId }, // id de covoitureur
      params: { id: OffreId }, // id de l'offre
    } = req;

    const offre = await Offre.findOne({
      _id: OffreId,
      createdBy: userId,
    });
    if (!offre) {
      throw new NotFoundError(`No offre with id ${OffreId}`);
    }
  // Retourner l'offre directement
    res.status(StatusCodes.OK).json({ offre });
  } catch (error) {
    throw new InternalServerError('Erreur lors de la récupération de l\'offre');
  }
}


const getOffre = async (req, res) => {
  try {
    const OffreId = req.params.id;
    const offre = await Offre.findOne({ _id: OffreId });

    if (!offre) {
      throw new NotFoundError(`No offre with id ${OffreId}`);
    }

    // Retourner l'offre directement
    res.status(StatusCodes.OK).json({ offre });
  } catch (error) {
    throw new InternalServerError('Erreur lors de la récupération de l\'offre');
  }
};




const ajusterGouvernoratEtLieu = (offre) => {
  if (offre.lieu_arrivée !== 'FST') {
    offre.gouvernorat_depart = 'Tunis';
    offre.lieu_depart = 'FST';
  }

  if (offre.lieu_depart !== 'FST') {
    offre.gouvernorat_arrivée = 'Tunis';
    offre.lieu_arrivée = 'FST';
  }

  return offre;
};




const createOffre = async (req, res) => {
  try {
    // Ajout de l'utilisateur créateur de l'offre
    req.body.createdBy = req.user.userId;

    const { prixparplace, nombreplacerestant, phoneNumber } = req.body;

    // Vérifier si les champs nécessaires sont fournis
    if (!prixparplace || !nombreplacerestant) {
      throw new BadRequestError('Le prix par place et le nombre de places restantes sont requis.');
    }

    // Récupérer les informations du covoitureur
    const covoitureur = await Covoitureur.findById(req.user.userId);
    if (!covoitureur) {
      throw new BadRequestError('Covoitureur non trouvé.');
    }

    // Montant payé actuel par le covoitureur
    const montantPaye = covoitureur.montant_paye

    // Calcul de la commission minimale requise
    const commissionMinimale = 0.2 * nombreplacerestant * prixparplace;

    // Vérifier si le montant payé est suffisant pour couvrir la commission
    if (montantPaye < commissionMinimale) {
      // Envoi de l'email à l'administrateur
      const adminEmail = process.env.ADMIN_EMAIL; // Remplacez par l'email de l'admin
      const subject = 'Montant payé insuffisant pour une offre';
      const text = `
        Une offre a été créée avec un montant payé insuffisant.

        Détails de l'offre :
        - Prix par place: ${prixparplace}
        - Nombre de places restantes: ${nombreplacerestant}
        - Montant payé: ${montantPaye}
        - Téléphone du covoitureur: ${phoneNumber || covoitureur.phoneNumber}
        
        Veuillez contacter le covoitureur pour résoudre ce problème.
      `;

      try {
        await sendEmail(adminEmail, subject, text); // Envoi de l'email à l'admin
        console.log("Email envoyé à l'admin");
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email à l'admin:", error);
      }

      // Retourner une réponse pour empêcher la création de l'offre
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Le montant payé est insuffisant. L\'offre ne peut pas être créée.',
      });
    }

    // Ajuster le gouvernorat et le lieu si nécessaire
    const dataoffre = ajusterGouvernoratEtLieu(req.body);

    // Créer l'offre
    const offre = await Offre.create(dataoffre);

    res.status(StatusCodes.CREATED).json({ offre });
  } catch (error) {
    console.error(error);
    throw new InternalServerError("Erreur lors de la création de l'offre");
  }
}






 const updateOffre = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: OffreID },
    } = req;

    const dataoffre = ajusterGouvernoratEtLieu(req.body);
    const offre = await Offre.findByIdAndUpdate({ _id: OffreID, createdBy: userId }, dataoffre, {
      new: true,
      runValidators: true,
    });

    if (!offre) {
      throw new NotFoundError(`No offre with id ${OffreID}`);
    }
    res.status(StatusCodes.OK).json({ offre });

  } catch (error) {
    throw new InternalServerError('Erreur lors de la mise à jour de l\'offre');
  }
};





const deleteOffre = async (req, res) => {
  try {
    const {
      params: { id: OffreID },
      user: { userId },
    } = req;

    const offre = await Offre.findByIdAndDelete({ _id: OffreID, createdBy: userId });

    if (!offre) {
      throw new NotFoundError(`No offre with id ${OffreID}`);
    }

    res.status(StatusCodes.OK).send();
  } catch (error) {
    throw new InternalServerError('Erreur lors de la suppression de l\'offre');
  }
}






const getAllgouvernerat = async (req, res) => {
  try {
    const gouvernorats = await Object.keys(villesParGouvernorat);
    res.status(200).json(gouvernorats);
  } catch (error) {
    throw new InternalServerError('Erreur lors de la récupération des gouvernorats');
  }
}





const getVilles = async (req, res) => {
  try {
    const { gouvernorat } = req.params;
    const villes = villesParGouvernorat[gouvernorat];

    if (!villes) {
      return res.status(404).json({ message: `Le gouvernorat '${gouvernorat}' est introuvable` });
    }
    res.status(200).json(villes);
  } catch (error) {
    throw new InternalServerError('Erreur lors de la récupération des villes');
  }
}

module.exports = {
  getAllOffres,
  getOffreco,
  deleteOffre,
  updateOffre,
  createOffre,
  getVilles,
  getAllgouvernerat,
  getAllOffresco,
  getOffre,
}
