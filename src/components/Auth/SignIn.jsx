import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './Auth.css';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false); // Etat pour "Se souvenir de moi"
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook pour la redirection

  // Charger l'email de localStorage si "Se souvenir de moi" est activé
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "L'e-mail est obligatoire.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "S'il vous plaît, mettez une adresse email valide.";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire.";
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

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/login_auth/login', formData);
  
        // Store the JWT in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role',response.data.user.Role);
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('ID', response.data.user.UserId);
        localStorage.setItem('phone', response.data.user.phoneNumber);
        localStorage.setItem('solde', response.data.user.solde);
        localStorage.setItem('montantp', response.data.user.montant_payé);
        localStorage.setItem('image', response.data.user.image);
        
  
        console.log('Connexion réussie:', response.data);
  
        if (response.data.user.Role === "driver"){
          navigate('/dashboard/addtrajet');
        }
        else if(response.data.user.Role === "passenger"){
          navigate('/dashboard/all-rides');
        }
        else{
          navigate('/DashboardAdmin')
        }
        
      } catch (error) {
        console.error('Erreur lors de la connexion:', error.response?.data?.message || error.message);
        setErrors({ general: error.response?.data?.message || 'Une erreur est survenue.' });
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Bienvenue de nouveau</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
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
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className="form-extra">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                />{' '}
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié</a>
            </div>
            <button type="submit" className="auth-button">Se connecter</button>
          </form>
          <p className="auth-redirect">
            Vous n'avez pas de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
