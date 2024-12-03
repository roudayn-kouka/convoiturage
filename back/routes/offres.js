const { 
       getAllOffres,
       getOffre,
       deleteOffre,
       updateOffre,
       createOffre,
       getVilles,
       getAllgouvernerat,
       getAllOffresco,
       getOffreco
     } = require("../controllers/offres");
     
     const auth = require('../middleware/auth'); // Middleware pour authentification et gestion des rôles
     const express = require("express");
     const router = express.Router();
     
     // Routes protégées pour les covoitureurs
     router.route("/consulter").get(auth(['covoitureur']), getAllOffresco); // Consultation des offres du covoitureur connecté
     
     router.route("/consulter/:id").get(auth(['covoitureur']), getOffreco); // Consultation d'une offre spécifique du covoitureur connecté
     
     router.route("/creation/").post(auth(['covoitureur']), createOffre); // Création d'une offre par un covoitureur
     
     router.route("/update/:id").patch(auth(['covoitureur']), updateOffre); // Mise à jour d'une offre par un covoitureur
     
     router.route("/delete/:id").delete(auth(['covoitureur']), deleteOffre); // Suppression d'une offre par un covoitureur
     
     // Routes publiques (aucun rôle requis)
     router.route("/gouvernorats").get(getAllgouvernerat); // Liste des gouvernorats
     router.route("/villes/:gouvernorat").get(getVilles); // Liste des villes d'un gouvernorat
     
     // Routes protégées pour les passagers
     router.route("/rechercher").get(auth(['passenger']), getAllOffres); // Recherche d'offres pour les passagers
     
     router.route("/rechercher/:id").get(auth(['passenger']), getOffre); // Détails d'une offre spécifique pour les passagers
     
     module.exports = router;
     