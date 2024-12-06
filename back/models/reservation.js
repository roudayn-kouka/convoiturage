const mongoose =require('mongoose')
const Passenger=require('./passenger')
const Offre =require('./offre')
const reservationshema =new mongoose.Schema({
    passenger :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Passenger',
        required: [true, 'Le passager est requis'],

    },
    offre:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Offre',
        required:[true],
    },
    numbreplacereservée: {
        type: Number,
        required: [true, 'Le nombre de places est requis'],
        min: [1, 'Le nombre de places doit être au moins 1'],
    },
    status: {
        type: String,
        enum: ['En attente', 'Confirmée','Rejetée','Annulée','Effectuée'],
        default: 'En attente',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})
module.exports=mongoose.model('Reservation',reservationshema) 