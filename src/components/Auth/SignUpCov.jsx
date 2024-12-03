import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import Navbar from '../Navbar/Navbar';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    image: null,
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); // État pour la popup

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est obligatoire.";
    } else {
      if (!/^.+\s.+$/.test(formData.name)) {
        newErrors.nameWords = "Le nom complet doit contenir au moins deux mots.";
      } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
        newErrors.nameLetters = "Le nom complet doit contenir uniquement des lettres et des espaces.";
      } else if (formData.name.length > 20) {
        newErrors.nameLength = "Le nom complet ne doit pas dépasser 20 caractères.";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "L'e-mail est obligatoire.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "S'il vous plaît, mettez une adresse email valide.";
    }

    const phoneRegex = /^[0-9]{8}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Le numéro de téléphone est obligatoire.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Veuillez entrer un numéro de téléphone valide (8 chiffres).";
    }

    const passwordRegexLength = /^.{8,}$/;
    const passwordRegexStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else {
      if (!passwordRegexLength.test(formData.password)) {
        newErrors.passwordLength = "Le mot de passe doit comporter au moins 8 caractères.";
      } else if (!passwordRegexStrength.test(formData.password)) {
        newErrors.passwordStrength = "Le mot de passe doit contenir une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial.";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmer le mot de passe est obligatoire.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (!formData.image) {
      newErrors.image = "L'image est obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      // Set up the reader to convert the file to base64
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        })); // This will be a base64 string
      };
      
      // Read the image file as a data URL (base64 string)
      reader.readAsDataURL(file);
    }
    
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Save the role in localStorage
        localStorage.setItem('role', 'covoitureur');
      
        // Send data to backend
        const response = await fetch('http://localhost:3000/api/v1/auth_covoitureur/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
});

        console.log('Registration successful:', response.data);

        
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
    }
      setShowPopup(true); // Affiche la popup
     
      console.log('Formulaire soumis avec succès :', formData);
       
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Créer un compte</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nom et prénom</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez votre nom complet" 
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
              {errors.nameWords && <p className="error-message">{errors.nameWords}</p>}
              {errors.nameLetters && <p className="error-message">{errors.nameLetters}</p>}
              {errors.nameLength && <p className="error-message">{errors.nameLength}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Numéro de téléphone</label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Entrez votre numéro de téléphone"
              />
              {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
              {errors.passwordLength && <p className="error-message">{errors.passwordLength}</p>}
              {errors.passwordStrength && <p className="error-message">{errors.passwordStrength}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre mot de passe"
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="image">Image de profil</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.image && <p className="error-message">{errors.image}</p>}
            </div>
            <button type="submit" className="auth-button">S'inscrire</button>
          </form>
          <p className="auth-redirect">
            Vous avez déjà un compte ? <Link to="/signincov">Se connecter</Link>
          </p>
        </div>
      </div>
      {showPopup && (
  <div className="popup-overlay">
    <div className="popup">
      <button
        className="close-popup-cross"
        onClick={() => setShowPopup(false)}
        aria-label="Fermer la popup"
      >
        &times;
      </button>
      <div className="popup-icon">
        ✅
      </div>
      <h3>Inscription réussie !</h3>
      <p>
        Merci pour votre inscription. Votre compte est en attente de validation par l'administrateur. Merci de patienter.
      </p>
      <button
        onClick={() => setShowPopup(false)}
        className="close-popup-button"
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default SignUp;
