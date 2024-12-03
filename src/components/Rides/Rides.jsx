import React, { useState, useEffect  } from "react";
import FindRide from "./FindRide";
import CardRide from "./CardRide";
import { getAllRides } from "../../Api/rideOffersApi"; // Importation de l'API

const mockOffers = [
  {
    id: 1,
    driver: "John Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    phone: "+216 55 123 456",
    departureGov: "Tunis",
    departureLoc: "FST",
    arrivalGov: "Ariana",
    arrivalLoc: "Soukra",
    date: "2024-02-20",
    time: "08:00",
    price: "5",
    seats: 1,
    luggageType: "avec bagage",
    rating: 4.8
  },
  {
    id: 2,
    driver: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    phone: "+216 55 789 012",
    departureGov: "Tunis",
    departureLoc: "FST",
    arrivalGov: "Ben Arous",
    arrivalLoc: "Rades",
    date: "2024-02-20",
    time: "09:30",
    price: "4",
    seats: 2,
    luggageType: "sans bagage",
    rating: 4.5
  }
  ,
  {
    id: 2,
    driver: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    phone: "+216 55 789 012",
    departureGov: "Tunis",
    departureLoc: "FST",
    arrivalGov: "Ben Arous",
    arrivalLoc: "Rades",
    date: "2024-02-20",
    time: "09:30",
    price: "4",
    seats: 2,
    luggageType: "sans bagage",
    rating: 4.5
  }
  ,
  {
    id: 2,
    driver: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    phone: "+216 55 789 012",
    departureGov: "Tunis",
    departureLoc: "FST",
    arrivalGov: "Ben Arous",
    arrivalLoc: "Rades",
    date: "2024-02-20",
    time: "09:30",
    price: "4",
    seats: 2,
    luggageType: "avec bagage",
    rating: 4.5
  }
  ,
  {
    id: 2,
    driver: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    phone: "+216 55 789 012",
    departureGov: "Tunis",
    departureLoc: "FST",
    arrivalGov: "Ben Arous",
    arrivalLoc: "Rades",
    date: "2024-02-20",
    time: "09:30",
    price: "4",
    seats: 2,
    luggageType: "Avec bagage",
    rating: 4.5
  }
];


export default function RideOffers() {
    //const [offers, setOffers] = useState([]);
    const [offers, setOffers] = useState(mockOffers); // Offres actuelles

    const [filters, setFilters] = useState(null); // Valeurs des filtres

    const handleSearch = (filters) => {
      setFilters(filters);
      console.log(filters )


      const filteredOffers = mockOffers.filter((offer) => {
       return (
        offer.departureGov === filters.fromGov &&
        offer.departureLoc === filters.fromCity &&
        offer.arrivalGov === filters.toGov &&
        offer.arrivalLoc === filters.toCity
       );
      });

       setOffers(filteredOffers);
    };

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
      {offers.length > 0 ? (
          offers.map((offer) => (
            <div className="col-md-6" key={offer.id}>
              <CardRide offer={offer} />
            </div>
          ))
        ) : (
          <p>Aucun trajet trouvé correspondant à vos critères.</p>
        )}
      </div>
    </div>
  );
}
