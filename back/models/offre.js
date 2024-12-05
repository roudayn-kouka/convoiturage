const mongoose = require ("mongoose")
const OffreSchema = new mongoose.Schema({
    
    gouvernorat_arrivée :{
        type :String,
        required: [true, 'Le gouvernorat d\'arrivée est requis'],
        enum:['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'El Kef', 'Gabes', 'Gafsa',
      'Jendouba', 'Kairouan', 'Kasserine', 'Kebili', 'Mahdia', 'Manouba',
      'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
      'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan']

    },
    lieu_arrivée:{
        type: String,
        required: [true, 'La ville d\'arrivée est requise']
    },
    gouvernorat_depart :{
        type :String,
        required: [true, 'Le gouvernorat de depart est requis'],
        enum:['Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'El Kef', 'Gabes', 'Gafsa',
      'Jendouba', 'Kairouan', 'Kasserine', 'Kebili', 'Mahdia', 'Manouba',
      'Medenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana',
      'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan']

    },
    lieu_depart:{
        type: String,
        required: [true, 'La ville de depart est requise']
    },
    dateDepart: {
        type: Date,
        required: [true, 'La date de départ est requise'],
        validate: {
            validator: function (value) {
                // Vérifie si la date est aujourd'hui ou plus tard
                const now = new Date();
                now.setHours(0, 0, 0, 0); // Réinitialise l'heure à 00:00:00
                return value >= now;
            },
            message: 'La date de départ doit être aujourd\'hui ou dans le futur',
        },
    },
    heureDepart: {
        type: String,
        required: [true, 'L\'heure de départ est requise'],
        match: [/^\d{2}:\d{2}$/, 'Le format de l\'heure doit être HH:mm'],
        validate: {
            validator: function (value) {
                // Vérifier l'heure seulement si la date est aujourd'hui
                const now = new Date();
                const [hours, minutes] = value.split(':').map(Number);
                const enteredTime = new Date();
                enteredTime.setHours(hours, minutes, 0, 0);

                // Si la date de départ est aujourd'hui, comparer l'heure
                if (this.dateDepart && this.dateDepart.toDateString() === now.toDateString()) {
                    return enteredTime > now;
                }
                return true; // Si la date n'est pas aujourd'hui, pas besoin de validation
            },
            message: 'L\'heure de départ doit être supérieure à l\'heure actuelle pour la date d\'aujourd\'hui',
        },
    },
    phoneNumber: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        match: [/^\d{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres']
    },
    bagage:{
        type: String,
        required:true,
        enum:['avec bagage' , 'sans bagage']
    },
    nombreplacerestant:{
        type: Number,
        required:[true],
        enum:[1,2,3,4],

    },
    genre:{
        type:String,
        required:[true],
        enum:['femme','homme','homme et femme'],
    },
    prixparplace:{//j'ai besion d'enregistrer prix dans la base de donnees
        type:Number,
        required:[true],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'covoitureur',
        required: [true, 'Please provide covoitureur'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})
module.exports = mongoose.model('Offre',OffreSchema); 