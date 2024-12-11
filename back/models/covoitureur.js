const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const covoitureurschema = new mongoose.Schema({
    name:{
        type : String,
        required:[true],
        maxlength :[20,'name can not be more than 20 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email'],
        unique:true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis'],
        match: [/^\d{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
          validator: function (value) {
            // Ignore validation if the password is hashed
            if (value.startsWith('$2b$') || value.startsWith('$2a$')) return true;
    
            // Validation pour les mots de passe non hachés
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(value);
          },
          message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    },
    image:{
        type :String,
        required:[true,'must provide image'],
       
    },
    solde: {
         type: Number,
         default: 0 ,
    },
    montant_payé:{
        type:Number,
        default:0,
    },
    // isValidated: {
    //     type: Boolean,
    //     default: false, // Compte non validé par défaut
    // },
    commission_plateforme:{
        type:Number,
        default:0,
    },
    isPaymentInsuffisant: {
        type: Boolean,
        default: false, // Compte non validé par défaut
    },
})
covoitureurschema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      // Si le mot de passe n'est pas modifié, ne pas le re-hacher
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
covoitureurschema.methods.createJWT = function () {
        return jwt.sign(
          { userId: this._id, name: this.name },
          process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME })
        }

covoitureurschema.methods.comparePassword = async function (canditatePassword) {
        const isMatch = await bcrypt.compare(canditatePassword, this.password)
        return isMatch
}
    
const Covoitureur = mongoose.models.Covoitureur || mongoose.model('Covoitureur', covoitureurschema)
module.exports = Covoitureur


