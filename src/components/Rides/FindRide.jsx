import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { governorates, cities } from "../../Data/locations";
import "./FindRide.css";

const FindRide = ({ onSearch }) => {
  const [fromGov, setFromGov] = useState("");
  const [toGov, setToGov] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [genderFilter, setGenderFilter] = useState("Femme");
  const [isValid, setIsValid] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  useEffect(() => {
    const allFieldsAreFilled = fromGov && toGov && fromCity && toCity;
    setAllFieldsFilled(allFieldsAreFilled);

    const isFSTConditionMet =
      (fromGov === "Tunis" && fromCity === "FST") ||
      (toGov === "Tunis" && toCity === "FST");
    setIsValid(isFSTConditionMet);
  }, [fromGov, toGov, fromCity, toCity]);

  const handleSearch = () => {
    // Construct filter object
    const filters = {
      fromGov,
      fromCity,
      toGov,
      toCity,
      genderFilter: genderFilter || null, // Include gender filter only if selected
    };

    // Pass filters to RideOffers
    onSearch(filters);
  };

  const handleReset = () => {
    setFromGov("");
    setToGov("");
    setFromCity("");
    setToCity("");
    setGenderFilter("");
    onSearch(null); // Reset the filtered offers
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
                  setFromCity("");
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
                  setToCity("");
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
           
            <option value="Femme">Femme</option>
            <option value="Homme">Homme</option>
            <option value="Homme et Femme">Homme et Femme</option>
          </select>
        </div>

        {!isValid && fromGov && toGov && fromCity && toCity && (
          <p className="error-message">Au moins un point doit être Tunis/FST</p>
        )}

        <div className="buttons-container">
          <button
            disabled={!isValid || !allFieldsFilled}
            onClick={handleSearch}
            className={`search-button ${isValid && allFieldsFilled ? "enabled" : "disabled"}`}
          >
            <Search className="me-2" />
            Rechercher
          </button>
          <button onClick={handleReset} className={`reset-button ${!isValid && !allFieldsFilled ? "disabled" : ""}`}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindRide;
