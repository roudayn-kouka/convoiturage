const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const passegershema = new mongoose.Schema({
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
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      unique: true,
      validate: {
          validator: function(value) {
              // Expression régulière pour valider le mot de passe
              return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          },
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
    },
    phoneNumber: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      match: [/^\d{8}$/, 'Le numéro de téléphone doit contenir 8 chiffres']
    },
    
    
})
passegershema.pre('save', async function () {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
})
passegershema.methods.createJWT= function () {
        return jwt.sign(
          { userId: this._id, name: this.name },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFETIME,
          }
        )
      }
  
passegershema.methods.comparePassword = async function (canditatePassword) {
        const isMatch = await bcrypt.compare(canditatePassword, this.password)
        return isMatch
      }

module.exports = mongoose.model('Passenger', passegershema)

