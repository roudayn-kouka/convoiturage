import React, { useState } from "react";

const ProfilPass = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    phone: "21 345 678",
    email: "john.doe@example.com",
    password: "",
    confirmPassword: "",
   
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");



  const handleImageChange  = (e) => {
    const file = e.target.files[0];
    setProfile((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(profile.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un symbole spécial.";
      isValid = false;
    }

    if (profile.password !== profile.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Profil mis à jour :", profile);
      setSuccessMessage("Profil mis à jour avec succès !");
      setProfile({ ...profile, password: "", confirmPassword: "" });

      // Masquer l'alerte après quelques secondes
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header text-center bg-success text-white">
          <h3>Profil</h3>
        </div>
        <div className="card-body">
          <div className="text-center mb-4">
            <img
              src={profile.image}
              alt="Profile"
              className="rounded-circle img-thumbnail"
              width="150"
              height="150"
            />
            <label
              htmlFor="imageUpload"
              className="btn btn-sm btn-success position-relative mt-2"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-pencil-fill"></i>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Champ non modifiable */}
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
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

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
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
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
                  setProfile({ ...profile, confirmPassword: e.target.value })
                }
              />
              {errors.confirmPassword && (
                <small className="text-danger">
                  {errors.confirmPassword}
                </small>
              )}
            </div>

           
            {successMessage && (
          <div className="alert alert-success mb-3">
            {successMessage}
          </div>
        )}
            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Modifier Profil
              </button>
            </div>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default ProfilPass;
