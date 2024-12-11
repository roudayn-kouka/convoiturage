const Reservation = require('../models/reservation')
const Offre = require('../models/offre')
const Passenger = require('../models/passenger')
const sendEmail = require('../services/emailService')
const { StatusCodes } = require('http-status-codes')
const Covoitureur= require ("../models/covoitureur")
const mongoose=require ("mongoose")






// creation se fait par le passenger en appuiant sur le bouton "reserver"
const createReservation = async (req, res) => {
  const { passenger: passengerId, offre: offerId, numbreplacereservée } = req.body; // Récupération des éléments
  console.log('Offer ID:', offerId);

  try {
    // Vérifier si l'offre existe
    const offer = await Offre.findById(offerId);
    if (!offer) {
      return res.status(404).json({ msg: 'Offre non trouvée' });
    }

    // Vérifier si le passager existe
    const passenger = await Passenger.findById(passengerId);
    if (!passenger) {
      return res.status(404).json({ msg: 'Passager non trouvé' });
    }

    // Vérifier si le conducteur existe
    const driver = await Covoitureur.findById(offer.createdBy);
    if (!driver) {
      return res.status(404).json({ msg: 'Covoitureur non trouvé' });
    }

    // Vérifier si une réservation existe déjà pour ce passager et cette offre
    const existingReservation = await Reservation.findOne({
      passenger: passengerId,
      offre: offerId,
    });
    if (existingReservation) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Merci, tu l’avais déjà réservée.',
      });
    }

    // Vérifier que le nombre de places demandées ne dépasse pas le nombre disponible
    if (numbreplacereservée > offer.nombreplacerestant) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Le nombre de places demandées dépasse le nombre de places disponibles.',
      });
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      passenger: passengerId,
      offre: offerId,
      numbreplacereservée,
    });

    // Envoi d'un email au covoitureur
    await sendEmail(
      driver.email,
      'Nouvelle demande de réservation',
      `Le passager ${passenger.name} a demandé ${numbreplacereservée} places pour votre trajet vers ${offer.lieu_arrivée}.`
    );

    res.status(StatusCodes.CREATED).json({
      message: 'Réservation créée avec succès.',
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Une erreur est survenue lors de la création de la réservation.',
    });
  }
}






// le covoitureur confirme la reservation ( appuie sur une boutton "confimer")
const confirmReservation = async (req, res) => {
  const { id } = req.params;
  console.log("Reservation ID:", id);

  // Vérification de la validité de l'ID de réservation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'ID de réservation invalide.' });
  }

  try {
    // Trouver la réservation
    const reservation = await Reservation.findById(id).populate('offre');
    console.log(reservation); // Vérifier la réservation récupérée

    if (!reservation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Réservation introuvable.' });
    }

    const offre = reservation.offre;

    // Vérifier si l'offre existe
    if (!offre) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Offre associée introuvable.' });
    }

    // Vérifier le nombre de places disponibles
    if (reservation.numbreplacereservée > offre.nombreplacerestant) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Le nombre de places demandées dépasse le nombre de places restantes.',
      });
    }

    // Décrémenter le nombre de places restantes
    offre.nombreplacerestant -= reservation.numbreplacereservée;
    await offre.save();

    // Mettre à jour le statut de la réservation
    reservation.status = 'Confirmée';
    await reservation.save();

    // Appel à la fonction pour mettre à jour la balance du conducteur uniquement si la réservation est confirmée
    if (reservation.status === 'Confirmée') {
      await updateDriverBalanceForReservation(reservation._id);
    }

    // Envoyer un email au passager
    const passenger = await Passenger.findById(reservation.passenger);
    await sendEmail(
      passenger.email,
      'Réservation confirmée',
      `Votre réservation de ${reservation.numbreplacereservée} place(s) a été confirmée pour le trajet vers ${offre.lieu_arrivée}.`
    );

    res.status(StatusCodes.OK).json({
      message: 'Réservation confirmée par le covoitureur et email envoyé au passager.',
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Une erreur est survenue lors de la confirmation de la réservation.',
    });
  }
};









//le covoitureur refuse la reservation (appuie sur une boutton "rejeter" )
const rejectReservation = async (req, res) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Réservation introuvable.' });
  }

  // Mise à jour du statut en "rejected"
  reservation.status = 'Rejetée';
  await reservation.save();
  const loginLink = 'https://votre-site.com/api/v1/auth_passenger/login'
  // Envoi d'un email au passager
  const passenger = await Passenger.findById(reservation.passenger);
  await sendEmail(
    passenger.email,
    'Réservation annulée',
    `Bonjour ${passenger.name},

    Nous vous remercions d'avoir effectué une réservation via notre plateforme.

    Malheureusement, votre réservation a été annulée par le covoitureur.
    N'hésitez pas à explorer d'autres offres de covoiturage disponibles sur notre plateforme via ce lien ci dessous:
     ${loginLink} 
     Cordialement,  
     L'équipe de support de Merwe7aMerte7a.`
  );

  res.status(StatusCodes.OK).json({ message: 'Réservation rejetée avec succès.' });
}






const deleteReservation = async (req, res) => { //supression par l'admin
  const { reservationId } = req.params;

  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Réservation introuvable.' });
  }

  // Suppression de la réservation
  await Reservation.findByIdAndDelete(reservationId);

  res.status(StatusCodes.OK).json({ message: 'Réservation supprimée avec succès.' });
}




//en appuiant sur bouton "modifier"
const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { numbreplacereservée } = req.body;
  console.log(numbreplacereservée)

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Réservation introuvable.' });
  }

  const offer = await Offre.findById(reservation.offre);
  if (!offer) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Offre introuvable.' });
  }
console.log("reservation numbreplacereseervée",reservation.numbreplacereservée)
  // Si le statut de la réservation est 'confirmée', annuler la réservation précédente
  if (reservation.status === 'Confirmée') {
    const nb = offer.nombreplacerestant + reservation.numbreplacereservée
    offer.nombreplacerestant = nb 
    reservation.status = 'En attente';
  }
  await offer.save()
  
  
  console.log(offer.nombreplacerestant)
  // Vérifier que le nombre de places demandées ne dépasse pas les places restantes
  if (numbreplacereservée > offer.nombreplacerestant) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Le nombre de places demandées dépasse le nombre de places restantes.',
    });
  }

  
  

  // Mettre à jour le nombre de places réservées dans la réservation
  reservation.numbreplacereservée = numbreplacereservée;
  await reservation.save();

  


  // Envoi d'un email au covoitureur
  const driver = await Covoitureur.findById(offer.createdBy);
  const passenger = await Passenger.findById(reservation.passenger);

  const reservationLink = `http://votre-application-web.com/reservation/${reservation._id}`; // Remplacez par l'URL réelle de votre application

  await sendEmail(
    driver.email,
    'Mise à jour de la réservation',
    `
    Bonjour ${driver.name},

    La réservation du passager ${passenger.name} a été mise à jour. Le nombre de places réservées a changé.

    Détails de la réservation :
    - Nombre de places réservées : ${numbreplacereservée}
    - Nombre de places restantes : ${offer.nombreplacerestant}

    Pour confirmer ou rejeter cette demande, veuillez utiliser le lien suivant :
    ${reservationLink}

    Merci pour votre collaboration.

    Cordialement,
    L'équipe de votre application
    `
  );

  res.status(StatusCodes.OK).json({
    message: 'Réservation mise à jour avec succès.',
    reservation,
  });
}






//en appuiant sur bouton "annuler"
const cancelReservation = async (req, res) => {
  const { id } = req.params;

  // Récupérer la réservation
  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Réservation introuvable.' });
  }

  const offer = await Offre.findById(reservation.offre);
  if (!offer) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Offre introuvable.' });
  }

  // Calculer la date et l'heure combinées pour le départ
  const [hours, minutes] = offer.heureDepart.split(':');
  const departureDateTime = new Date(`${offer.dateDepart}T${hours}:${minutes}:00`);

  // Récupérer l'heure actuelle
  const now = new Date();

  // Vérifier que la date et l'heure de départ n'ont pas encore été atteintes
  if (now > departureDateTime) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'L\'annulation de la réservation est impossible car l\'heure de départ est déjà passée.',
    });
  }

  // Annuler la réservation et réajuster le nombre de places restantes
  if (reservation.status==="Confirmée"){
    offer.nombreplacerestant += reservation.numbreplacereservée;
    await offer.save();
  }
  
  // Mise à jour du statut de la réservation
  reservation.status = 'Annulée';
  await reservation.save();

  // Envoi d'un email au covoitureur pour l'annulation
  const driver = await Covoitureur.findById(offer.createdBy);
  await sendEmail(
    driver.email,
    'Réservation annulée',
    `Le passager ${reservation.passenger.name} a annulé sa réservation pour le trajet vers ${offer.lieu_arrivée}.`
  );

  res.status(StatusCodes.OK).json({ message: 'Réservation annulée et places réajustées.' });
};




const updateDriverBalanceForReservation = async (reservationId) => {
  try {
    const reservation = await Reservation.findById(reservationId).populate('offre');
    if (!reservation || reservation.status !== 'Confirmée') {
      return; // Ne pas mettre à jour si la réservation n'est pas confirmée
    }

    const offer = reservation.offre;

    if (!offer) {
      console.error('Offre introuvable pour cette réservation.');
      return;
    }

    // Assurez-vous que dateDepart est une instance de Date ou la formatez correctement
    const departureDate = offer.dateDepart instanceof Date ? offer.dateDepart : new Date(offer.dateDepart);

    // Calcul de l'heure de départ + 10 minutes
    const departureTime = new Date(departureDate);
    const [hours, minutes] = offer.heureDepart.split(':'); // Assurez-vous que heureDepart est une chaîne de type "hh:mm"
    departureTime.setHours(hours);
    departureTime.setMinutes(minutes);
    
    const timeAfter10Minutes = new Date(departureTime.getTime() + 10 * 60 * 1000);

    // Vérification si le temps actuel est avant l'heure de départ + 10 minutes
    const now = new Date();
    if (now < timeAfter10Minutes) {
      console.log("Il est encore trop tôt pour mettre à jour le solde du conducteur.");

      // Attendre jusqu'à timeAfter10Minutes
      const timeDifference = timeAfter10Minutes - now; // Calculer la différence en millisecondes
      setTimeout(async () => {
        await processBalanceUpdate(reservation, offer);
      }, timeDifference); // Délai d'attente jusqu'à timeAfter10Minutes
      return;
    }

    // Si le temps actuel est déjà après timeAfter10Minutes, mettre à jour immédiatement
    await processBalanceUpdate(reservation, offer);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la balance du conducteur:', error);
  }
};

// Fonction pour gérer la mise à jour de la balance
const processBalanceUpdate = async (reservation, offer) => {
  try {
    // Vérification si la réservation est toujours confirmée
    if (reservation.status === 'Annulée') {
      console.log("La réservation a été annulée, les modifications ne sont pas effectuées.");
      return;
    }

    // Mise à jour des balances
    const driver = await Covoitureur.findById(offer.createdBy);
    if (!driver) {
      console.error('Covoitureur introuvable.');
      return;
    }

    const totalAmount = reservation.numbreplacereservée * offer.prixparplace;

    // Calcul de la commission (20%)
    const commission = 0.2 * totalAmount;

    // Mise à jour des données du conducteur
    driver.solde += totalAmount; // Ajouter le montant total
    driver.commission_plateforme += commission; // Ajouter la commission
    driver.montant_payé -= commission; // Réduire la commission du montant payé

    await driver.save();

    console.log(`Solde et commission mis à jour pour le covoitureur. Nouveau solde: ${driver.solde}, commission: ${driver.commission_plateforme}`);

    // Envoi de l'e-mail de confirmation au conducteur
    const subject = 'Mise à jour de votre solde';
    const text = `
      Cher ${driver.name},

      Votre solde a été mis à jour suite à une réservation confirmée.

      - **Montant total ajouté :** ${totalAmount.toFixed(2)} €
      - **Commission prélevée :** ${commission.toFixed(2)} €
      - **Nouveau solde :** ${driver.solde.toFixed(2)} €
      - **Commission totale accumulée :** ${driver.commission_plateforme.toFixed(2)} €
      - **Montant payé restant :** ${driver.montant_payé.toFixed(2)} €

      Merci pour votre contribution à notre plateforme.

      Cordialement,  
      L'équipe de support
    `;

    try {
      await sendEmail(driver.email, subject, text);
      console.log('Email de mise à jour du solde envoyé à', driver.email);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation :', emailError);
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la balance du conducteur dans processBalanceUpdate:', error);
  }
};




const getPassengerReservations = async (req, res) => {
  try {
     
    const reservations = await Reservation.find({ passenger: req.user.userId });

    // Fetch associated offers and drivers for each reservation
    const reservationsWithDetails = await Promise.all(
      reservations.map(async (reservation) => {
        // Fetch the related offer
        const offer = await Offre.findById(reservation.offre);

        // Fetch the driver details for the offer
        const driver = await Covoitureur.findById(offer.createdBy, 'name image');

        // Combine the details into a single object
        return {
          ...reservation.toObject(),
          offer: {
            ...offer.toObject(),
            driver,
          },
        };
      })
    );

    res.status(200).json({ reservations: reservationsWithDetails });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'An error occurred while fetching reservations.' });
  }
};

const getReservationsForCovoitureur = async (req, res) => {
  try {
    const covoitureurId = req.user.userId; // Assuming `req.user.userId` contains the authenticated covoitureur's ID

    // Step 1: Find all offers created by this covoitureur
    const offers = await Offre.find({ createdBy: covoitureurId }).select('_id');

    // Step 2: Extract the offer IDs
    const offerIds = offers.map(offer => offer._id);

    // Step 3: Find all reservations for these offers
    const reservations = await Reservation.find({ offre: { $in: offerIds } });

    // Step 4: Fetch passengers and offer details manually
    const detailedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        // Fetch passenger details
        const passenger = await Passenger.findById(reservation.passenger).select('name email');

        // Fetch offer details
        const offer = await Offre.findById(reservation.offre).select('lieu_depart lieu_arrivée dateDepart heureDepart gouvernorat_depart gouvernorat_arrivée prixparplace');

        // Combine reservation, passenger, and offer details
        return {
          ...reservation.toObject(),
          passenger,
          offer,
        };
      })
    );

    // Step 5: Send the response
    res.status(200).json({ success: true, reservations: detailedReservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createReservation,
  confirmReservation,
  rejectReservation,
  cancelReservation,
  updateReservation,
  deleteReservation,
  getPassengerReservations,
  getReservationsForCovoitureur,
}


