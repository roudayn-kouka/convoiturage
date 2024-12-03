import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { governorates, cities } from '../../Data/locations';
import './FindRide.css';

const SearchRides = ({ onSearch }) => {
  const [fromGov, setFromGov] = useState('');
  const [toGov, setToGov] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
    const allFieldsAreFilled = fromGov && toGov && fromCity && toCity && genderFilter;
    setAllFieldsFilled(allFieldsAreFilled);

    const isFSTConditionMet =
      (fromGov === 'Tunis' && fromCity === 'FST') || (toGov === 'Tunis' && toCity === 'FST');
    setIsValid(isFSTConditionMet);
  }, [fromGov, toGov, fromCity, toCity, genderFilter]);

  const handleSearch = () => {
    if (isValid && allFieldsFilled) {
      onSearch({ fromGov, fromCity, toGov, toCity, genderFilter });
    }
  };

  return (
    <div className="search-rides-container">
      <div className="search-box">
        <h2>Trouver un trajet</h2>

        <div className="ride-selection">
          {/* Departure Section */}
          <div className="departure-section">
            <h3>Départ</h3>
            <div>
              <label className="form-label">Gouvernorat</label>
              <select
                value={fromGov}
                onChange={(e) => {
                  setFromGov(e.target.value);
                  setFromCity('');
                }}
                className="form-select"
              >
                <option value="">Sélectionnez le gouvernorat</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Lieu</label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                disabled={!fromGov}
                className="form-select"
              >
                <option value="">Sélectionnez le lieu</option>
                {fromGov &&
                  cities[fromGov]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Arrival Section */}
          <div className="arrival-section">
            <h3>Arrivée</h3>
            <div>
              <label className="form-label">Gouvernorat</label>
              <select
                value={toGov}
                onChange={(e) => {
                  setToGov(e.target.value);
                  setToCity('');
                }}
                className="form-select"
              >
                <option value="">Sélectionnez le gouvernorat</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Lieu</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                disabled={!toGov}
                className="form-select"
              >
                <option value="">Sélectionnez le lieu</option>
                {toGov &&
                  cities[toGov]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gender Filter Section */}
        <div className="gender-filter-section">
          <h3>Préférence de genre</h3>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="form-select"
          >
            <option value="">Sélectionnez le genre</option>
            <option value="fille">Fille</option>
            <option value="garçon">Garçon</option>
            <option value="fille&garçon">Fille & Garçon</option>
          </select>
        </div>

        {!isValid && fromGov && toGov && fromCity && toCity && (
          <p className="error-message">Au moins un point doit être Tunis/FST</p>
        )}

        <button
          disabled={!isValid || !allFieldsFilled}
          onClick={handleSearch}
          className={`search-button ${isValid && allFieldsFilled ? 'enabled' : 'disabled'}`}
        >
          <Search className="me-2" />
          Rechercher des trajets
        </button>
      </div>
    </div>
  );
};

export default SearchRides;
