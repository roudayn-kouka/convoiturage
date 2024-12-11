const Offre = require("../models/offre");
const Covoitureur = require("../models/covoitureur")
const villesParGouvernorat = require("../models/lieu");
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError, InternalServerError } = require('../errors');
const sendEmail = require('../services/emailService');
require('dotenv').config()
const Reservation = require('../models/reservation')



const getAllOffresco = async (req, res) => {
  try {
    // Récupérer toutes les offres créées par le covoitureur connecté
    const offres = await Offre.find({ createdBy: req.user.userId , isValidated:true });

    // Retourner les résultats
    res.status(StatusCodes.OK).json({message: 'Offres récupérées avec succès.', offres, count: offres.length });
  } catch (error) {
    console.error('Error retrieving user offers:', error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Erreur lors de la récupération des offres.', error: error.message });
  }
}






const getAllOffres = async (req, res) => {
  try {
    const now = new Date();
    const currentDateISO = now.toISOString(); // Current date and time in ISO format
    const currentDateOnly = now.toISOString().split("T")[0]; // Current date (YYYY-MM-DD)
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // Current time in minutes

    const offres = await Offre.aggregate([
      {
        $addFields: {
          // Calculate total minutes for heureDepart
          heureDepartInMinutes: {
            $add: [
              {
                $multiply: [
                  { $toInt: { $arrayElemAt: [{ $split: ["$heureDepart", ":"] }, 0] } }, // Extract and convert hours to minutes
                  60,
                ],
              },
              { $toInt: { $arrayElemAt: [{ $split: ["$heureDepart", ":"] }, 1] } }, // Extract and convert minutes
            ],
          },
        },
      },
      {
        $match: {
          isValidated: true,
          $or: [
            // Case 1: Today's offers where heureDepart > current time
            {
              $and: [
                { dateDepart: { $eq: new Date(currentDateOnly) } },
                { heureDepartInMinutes: { $gt: currentTimeInMinutes } },
              ],
            },
            // Case 2: Future offers
            { dateDepart: { $gt: new Date(currentDateISO) } },
          ],
        },
      },
    ]);

    // Enrich each offer with Covoitureur details
    const offresWithCovoitureur = await Promise.all(
      offres.map(async (offre) => {
          const covoitureur = await Covoitureur.findById(offre.createdBy, "name image");
        return {
          ...offre,
          covoitureur, // Attach covoitureur details
        };
        }
      )
    );

    // Return the results
    res.status(200).json({
      offres: offresWithCovoitureur,
      count: offresWithCovoitureur.length,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des offres." });
  }
};











const getOffreco = async (req, res) => {
  try {
    const { id: OffreId } = req.params;

    const offre = await Offre.findOne({
      _id: OffreId,
      createdBy: req.user.userId
    });
    if (!offre) {
      return res.status(404).json({ message: 'Offer not found' });
    }
  // Retourner l'offre directement
    res.status(StatusCodes.OK).json({ message: "offer found",offre });
  } catch (error) {
    console.error('Error finding offer:', error);
    res.status(500).json({ message: 'Error finding the offer', error: error.message });
  }
}


const getOffre = async (req, res) => {
  try {
    const offreId = req.params.id;
    const now = new Date();

    // Calcul de l'heure actuelle en minutes
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Rechercher l'offre avec des conditions supplémentaires pour exclure les offres expirées
    const offre = await Offre.findOne({
      _id: offreId,
      $or: [
        // Offres dont la date de départ est après aujourd'hui
        { dateDepart: { $gt: now } },

        // Offres dont la date de départ est aujourd'hui et l'heure de départ >= heure actuelle
        {
          dateDepart: { $eq: now.toISOString().split('T')[0] }, // Comparer uniquement la date
          heureDepart: { $gte: currentTimeInMinutes }, // Comparer l'heure actuelle
        },
      ],
    });

    // Si aucune offre n'est trouvée ou si elle est expirée
    if (!offre) {
      throw new NotFoundError(`Aucune offre valide trouvée avec l'ID ${offreId}`);
    }

    // Retourner l'offre
    res.status(StatusCodes.OK).json({ offre });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'offre :', error);
    throw new InternalServerError('Erreur lors de la récupération de l\'offre');
  }
}




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
    // req.body.createdBy = req.user.userId;

    const { 
      gouvernorat_arrivée, lieu_arrivée, gouvernorat_depart, lieu_depart, 
      dateDepart, heureDepart, phoneNumber, bagage, nombreplacedisponible, 
      genre, prixparplace 
    } = req.body;
    const nombreplacerestant=nombreplacedisponible
    // Vérifier si les champs nécessaires sont fournis
    if (!prixparplace ) {
      throw new BadRequestError('Le prix par place est requis.');
    }

    // Récupérer les informations du covoitureur
    const covoitureur = await Covoitureur.findById(req.user.userId);
    if (!covoitureur) {
      throw new BadRequestError('Covoitureur non trouvé.');
    }

    // Montant payé actuel par le covoitureur
    const montantPaye = covoitureur.montant_payé

    // Calcul de la commission minimale requise
    const commissionMinimale = 0.2 * nombreplacerestant * prixparplace;

    // Vérifier si le montant payé est suffisant pour couvrir la commission
    if (montantPaye < commissionMinimale) {
      // Envoi de l'email à l'administrateur
      covoitureur.isPaymentInsuffisant = true;
      await covoitureur.save();
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
        message: `Le montant payé est insuffisant ${covoitureur.montant_payé}. L\'offre ne peut pas être créée.Veuillez contacter l\'admin sur le numero : 23074149  `,
      });
    }

    // Ajuster le gouvernorat et le lieu si nécessaire
    // const dataoffre = ajusterGouvernoratEtLieu(req.body);

    // Créer l'offre
    const offer = new Offre({
      gouvernorat_arrivée,
      lieu_arrivée,
      gouvernorat_depart,
      lieu_depart,
      dateDepart,
      heureDepart,
      phoneNumber,
      bagage,
      nombreplacedisponible,
      nombreplacerestant,
      genre,
      prixparplace,
      createdBy: req.user.userId, // User ID from middleware
    });

    await offer.save();

    res.status(StatusCodes.CREATED).json({message: 'Offre créée avec succès.', offer });
  } catch (error) {
    console.error('Error creating offer:', error.message);
    res.status(500).json({ message: 'Erreur lors de la création de l\'offre.', error: error.message });
  }
};






 const updateOffre = async (req, res) => {
  try {
    const { id: OffreID }=req.params;
    const offre = await Offre.findByIdAndUpdate({ _id: OffreID, createdBy: req.user.userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offre) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    if (offre.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to modify this offer' });
    }
    res.status(StatusCodes.OK).json({ message: 'Offer updated successfully',offre });

  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Error updating the offer', error: error.message });
  }
};





const deleteOffre = async (req, res) => {
  try {
    const { id: OffreID }=req.params;

    const offre = await Offre.findOne({ _id: OffreID, createdBy: req.user.userId });
    offre.isValidated=false
    offre.save()
    const reservations = await Reservation.find({ offre: { $in: OffreID } });
    reservations.map(async (reservation) => {
      reservation.status="Offre Annulé"
      await reservation.save()
    })

    if (!offre) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the offer", error: error.message });
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
