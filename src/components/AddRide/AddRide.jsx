import React, { useState, useEffect } from 'react';
import { governorates, cities } from '../../Data/locations';
import axios from 'axios';
export default function CreateRide({ passenger }) {
  const [formData, setFormData] = useState({
    phone: '',
    price: '',
    date: '',
    time: '',
    seats: 1,
    hasBaggage: 'sans bagage',
    gender: 'Femme',
    fromGov: '',
    fromCity: '',
    toGov: '',
    toCity: '',
  });
  

  const [fromCities, setFromCities] = useState([]);
  const [toCities, setToCities] = useState([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (formData.fromGov) {
      setFromCities(cities[formData.fromGov] || []);
    }
  }, [formData.fromGov]);

  useEffect(() => {
    if (formData.toGov) {
      setToCities(cities[formData.toGov] || []);
    }
  }, [formData.toGov]);

  const validateFSTLocation = () => {
    const hasFSTDeparture = formData.fromGov === 'Tunis' && formData.fromCity === 'FST';
    const hasFSTArrival = formData.toGov === 'Tunis' && formData.toCity === 'FST';
    
    if (!hasFSTDeparture && !hasFSTArrival) {
      
      return false;
    }
    setFormError('');
    return true;
  };

  const validateDate = () => {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore l'heure pour comparer les dates

    if (selectedDate < today) {
      
      return false;
    }
    return true;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const validatePrice = (price) => {
    return !isNaN(price) && price > 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      setFormError('Le numéro de téléphone doit contenir seulement des chiffres et être composé de 8 chiffres.');
      return;
    }

    if (!validatePrice(formData.price)) {
      setFormError('Le prix doit être un nombre valide.');
      return;
    }
    if (!validateDate()) {
      setFormError('La date doit être aujourd\'hui ou dans le futur.');
      return
    }
    if (!validateFSTLocation()) {
      setFormError('Le trajet doit inclure FST (Tunis) comme point de départ ou d\'arrivée');
      return
    }
    

    try {
    const token = passenger.token; 
    
    const response = await axios.post(
      'http://localhost:3000/api/v1/offre/creation', 
      {
        gouvernorat_arrivée: formData.toGov,
        lieu_arrivée: formData.toCity,
        gouvernorat_depart: formData.fromGov,
        lieu_depart: formData.fromCity,
        dateDepart: formData.date,
        heureDepart: formData.time,
        phoneNumber: formData.phone,
        bagage: formData.hasBaggage,
        nombreplacedisponible: formData.seats,
        genre: formData.gender,
        prixparplace: formData.price,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
      }
    );

    setSuccessMessage(response.data.message);
        setFormData({
          phone: '',
          hasBaggage: '',
          price: '',
          time: '',
          date: '', 
          seats: '1',
          fromGov: '',
          fromCity: '',
          toGov: '',
          toCity: '',
          gender: ''
        });
  } catch (error) {
    console.error('Error creating offer:', error);
    setFormError(error.response?.data?.message || 'Erreur inconnue.');
    }
    // if (validateFSTLocation() && validateDate()) {
    //   console.log(formData);
    //   // Affichage de l'alerte de succès
    //   setSuccessMessage('Le trajet a été créé avec succès!');
    //   // Réinitialisation des champs du formulaire
    //   setTimeout(() => {
    //     setFormData({
    //       phone: '',
    //       hasBaggage: '',
    //       price: '',
    //       time: '',
    //       date: '', 
    //       seats: '1',
    //       fromGov: '',
    //       fromCity: '',
    //       toGov: '',
    //       toCity: '',
    //       gender: ''
    //     });
    //     setSuccessMessage('');
    //   }, 3000); // L'alerte disparaît après 3 secondes
    // }
  };

  return (
    <div className="container bg-white p-5 rounded shadow-sm">
      <h2 className="text-center text-2xl font-bold text-success mb-4">Créer un nouveau trajet</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Numéro de téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-control"
              placeholder="XX XXX XXX"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Prix par personne (DT)</label>
            <input
              type="number"
              step="0.10"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-control"
              min="0"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date du départ</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Heure de départ</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Places disponibles</label>
            <select
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
              className="form-select"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-6 d-flex justify-content-between">
            {/* Bagages autorisés */}
            <div className="me-2" style={{ flex: 1 }}>
              <label className="form-label">Bagages autorisés</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={formData.hasBaggage === 'avec bagage'}
                  onChange={(e) => setFormData({ ...formData, hasBaggage: e.target.checked ? 'avec bagage' : 'sans bagage' })}
                  className="form-check-input"
                />
                <label className="form-check-label">Oui</label>
              </div>
            </div>

            {/* Sexe */}
            <div style={{ flex: 1 }}>
              <label className="form-label">Sexe</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="form-select"
                required
              >
                <option value="Femme" selected>Femme</option>
                <option value="Homme">Homme</option>
                <option value="Homme et Femme">Homme et Femme</option>

              </select>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Gouvernorat de départ</label>
            <select
              value={formData.fromGov}
              onChange={(e) => setFormData({ ...formData, fromGov: e.target.value, fromCity: '' })}
              className="form-select"
              required
            >
              <option value="">Sélectionner</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Lieu de départ</label>
            <select
              value={formData.fromCity}
              onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
              className="form-select"
              required
              disabled={!formData.fromGov}
            >
              <option value="">Sélectionner</option>
              {fromCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Gouvernorat d'arrivée</label>
            <select
              value={formData.toGov}
              onChange={(e) => setFormData({ ...formData, toGov: e.target.value, toCity: '' })}
              className="form-select"
              required
            >
              <option value="">Sélectionner</option>
              {governorates.map(gov => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Lieu d'arrivée</label>
            <select
              value={formData.toCity}
              onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
              className="form-select"
              required
              disabled={!formData.toGov}
            >
              <option value="">Sélectionner</option>
              {toCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {formError && (
          <div className="text-danger mb-3">
            {formError}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success mb-3">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-success w-100"
        >
          Créer le trajet
        </button>
      </form>
    </div>
  );
}
