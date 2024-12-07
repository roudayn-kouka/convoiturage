import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilPass = ({ passenger }) => {
  const [profile, setProfile] = useState({
    id:"",
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (passenger) {
      setProfile({
        id:passenger.Id,
        fullName: passenger.name,
        phone: passenger.phoneNumber,
        email: passenger.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [passenger]);

  

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(profile.phone)) {
      newErrors.phone =
        "Le numéro de téléphone doit comporter exactement 8 chiffres.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      newErrors.email = "Veuillez entrer un email valide.";
      isValid = false;
    }

    if (profile.password && profile.password !== profile.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the form
    if (!validate()) return;
  
    try {
      // Make the PUT request to update the profile
      await axios.put("http://localhost:3000/api/v1/auth_passenger/update", profile);
  
      // Check if email or password is changed, then navigate
      if (profile.email !== passenger.email || profile.password) {
        setSuccessMessage("Profil mis à jour avec succès !");
        setEditMode(false);
        navigate("/signin"); // Redirect to the sign-in page
      } else {
        setSuccessMessage("Profil mis à jour avec succès !");
        setEditMode(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrors({ server: "Une erreur s'est produite lors de la mise à jour." });
    }
  };
  

  const handleEditClick = () => {
    // Only toggle edit mode without triggering form submission
    setEditMode(true);
    setSuccessMessage(""); // Clear success message when editing starts
    setErrors({}); // Clear any validation errors
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header text-center bg-success text-white">
          <h3>Profil</h3>
        </div>
        <div className="card-body">
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Nom et prénom
              </label>
              <div className="form-control bg-light text-muted">
                {profile.fullName}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={profile.phone}
                disabled={!editMode}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={profile.email}
                disabled={!editMode}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {editMode && (
              <>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={profile.password}
                    onChange={(e) =>
                      setProfile({ ...profile, password: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmez le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={profile.confirmPassword}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">
                      {errors.confirmPassword}
                    </small>
                  )}
                </div>
              </>
            )}

          <div className="text-end">
            {!editMode && (
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleEditClick}
              >
                Modifier Profil
              </button>
            )}

            {editMode && (
              <button type="submit" className="btn btn-success">
                Confirmer
              </button>
            )}
          </div>
          </form>

          {errors.server && (
            <div className="alert alert-danger mt-3">{errors.server}</div>
          )}
          {successMessage && (
            <div className="alert alert-success mt-3">{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};



export default ProfilPass;
