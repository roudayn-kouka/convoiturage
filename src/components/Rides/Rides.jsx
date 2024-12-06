import React, { useState, useEffect  } from "react";
import FindRide from "./FindRide";
import CardRide from "./CardRide";

import axios from "axios";



export default function RideOffers({ passenger }) {
    //const [offers, setOffers] = useState([]);
    const [offers, setOffers] = useState([]); // Current offers
    const [filteredOffers, setFilteredOffers] = useState([]); // Filtered offers
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const token = passenger.token
    console.log(token);
    useEffect(() => {
      const fetchOffers = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/v1/offre/rechercher",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
            ); // Use your backend route
          setOffers(response.data.offres);
          setFilteredOffers(response.data.offres);
        } catch (error) {
          console.error("Error fetching offers:", error);
          setError("Erreur lors de la récupération des offres.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchOffers();
    }, []);

    const handleSearch = (filters) => {
      if (!filters) {
        setFilteredOffers(offers);
        return;
      }


      const filtered = offers.filter((offer) => {
        return (
          offer.gouvernorat_depart === filters.fromGov &&
          offer.lieu_depart === filters.fromCity &&
          offer.gouvernorat_arrivée === filters.toGov &&
          offer.lieu_arrivée === filters.toCity &&
          (!filters.genderFilter || offer.genre === filters.genderFilter)
        );
      });
  
      setFilteredOffers(filtered);
    };

      // Handle loading and error states
    if (loading) {
      return <div>Chargement des trajets...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }
//******************************************* */
// Fonction pour récupérer les offres au chargement de la page
/*useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getAllRides(); // Appel de l'API
        setOffers(data.offre); // Met à jour l'état avec les offres récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des offres :", error);
      }
    };

    fetchOffers();
  }, []);*/
//**************************************** */

  return (
    <div className=" container py-4 wid">
      <FindRide onSearch={handleSearch}  />
      <h5 className="mb-4">Trajets disponibles</h5>
      <div className="row ">
      {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div className="col-md-6" key={offer._id}>
              <CardRide offer={offer} passenger={passenger}/>
            </div>
          ))
        ) : (
          <p>Aucun trajet trouvé correspondant à vos critères.</p>
        )}
      </div>
    </div>
  );
}
