require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    }

    // Ajouter un contenu HTML si disponible
    if (html) {
      mailOptions.html = html
    }

    // Envoyer l'email
    await transporter.sendMail(mailOptions)
    console.log(`Email envoyé à ${to}`)
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error)
  }
}

module.exports = sendEmail
