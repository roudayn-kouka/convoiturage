import axios from "axios";

// Configurer une instance axios (optionnel)
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/offre", // Base URL de votre API backend
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour récupérer toutes les offres
export const getAllRides = async () => {
    try {
      const response = await apiClient.get("/rechercher");
      return response.data; // Retourne les données des offres
    } catch (error) {
      console.error("Erreur lors de la récupération des offres :", error);
      throw error;
    }
  };
  