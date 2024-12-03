const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom'],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Veuillez fournir un email'],
    unique: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Veuillez fournir un email valide',
    ],
  },
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe'],
    minlength: 6,
  },
}, { timestamps: true });

// Méthode pour hacher le mot de passe
AdminSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour vérifier le mot de passe
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour créer un JWT
AdminSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

module.exports = mongoose.model('Admin',AdminSchema);
