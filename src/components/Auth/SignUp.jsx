import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './Auth.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook pour la redirection

  const validateForm = () => {
    const newErrors = {};

    // Validation stricte du nom complet
    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est obligatoire.";
    } else {
      // Vérification : au moins deux mots
      if (!/^.+\s.+$/.test(formData.name)) {
        newErrors.nameWords = "Le nom complet doit contenir au moins deux mots.";
      }

      // Vérification : que des lettres et espaces
      else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
        newErrors.nameLetters = "Le nom complet doit contenir uniquement des lettres et des espaces.";
      }
      // Limite la longueur du nom complet à 20 caractères
      else if (formData.name.length > 20) {
        newErrors.nameLength = "Le nom complet ne doit pas dépasser 20 caractères.";
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "e-mail est obligatoire.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "S'il vous plaît, mettez une adresse email valide.";
    }
   // Validation phone
    const phoneRegex = /^[0-9]{8}$/;
    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est obligatoire.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Veuillez entrer un numéro de téléphone valide (8 chiffres).";
    }
    // Validation du mot de passe
    const passwordRegexLength = /^.{8,}$/;
    const passwordRegexStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else {
      if (!passwordRegexLength.test(formData.password)) {
        newErrors.passwordLength = "Le mot de passe doit comporter au moins 8 caractères.";
      }
      else if (!passwordRegexStrength.test(formData.password)) {
        newErrors.passwordStrength = "Le mot de passe doit contenir une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial.";
      }

    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmer le mot de passe est obligatoire.";
    } else 
    // Validation de la confirmation du mot de passe
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
        try {
            // Save the role in localStorage
            localStorage.setItem('role', 'passenger');
          
            // Send data to backend
            const response = await fetch('http://localhost:3000/api/v1/auth_passenger/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

            console.log('Registration successful:', response.data);

            // Navigate to the SignIn
            navigate('/SignIn');
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
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
              <label htmlFor="phone">Numéro de téléphone</label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Entrez votre numéro de téléphone"
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
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
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>
            <button type="submit" className="auth-button">S'inscrire</button>
          </form>
          <p className="auth-redirect">
          Vous avez déjà un compte ? <Link to="/signin">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
