import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function RideCond({passenger}) {
  const [offres, setOffers] = useState([]); // State to store the offers
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [offerToCancel, setOfferToCancel] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        
        const token = passenger.token; 
        const response = await axios.get('http://localhost:3000/api/v1/offre/consulter', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOffers(response.data.offres); // Set the offers in state
        setLoading(false); // Stop loading indicator
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching offers');
        setLoading(false); // Stop loading indicator
      }
    };

    fetchOffers(); // Fetch offers on component mount
  }, []);

  if (loading) return <p>Loading...</p>; // Show a loading message
  if (error) return <p>Error: {error}</p>; // Show an error message

  // const mockOffers = [
  //   {
  //     id: 1,
  //     driver: "John Smith",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  //     phone: "55 123 456",
  //     departureGov: "Tunis",
  //     departureLoc: "FST",
  //     arrivalGov: "Ariana",
  //     arrivalLoc: "Borj Louzir",
  //     date: "2024-02-20",
  //     time: "08:00",
  //     price: "5",
  //     gender :"fille",
  //     seats: 1,
  //     luggageType: "avec bagage",
  //     rating: 4.8
  //   },
  //   {
  //     id: 2,
  //     driver: "Sarah Wilson",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  //     phone: "55 789 012",
  //     departureGov: "Tunis",
  //     departureLoc: "FST",
  //     arrivalGov: "Ben Arous",
  //     arrivalLoc: "Rades",
  //     date: "2024-02-20",
  //     time: "09:30",
  //     price: "4",
  //     gender :"garçon",
  //     seats: 2,
  //     luggageType: "light",
  //     rating: 4.5
  //   }
  //   ,
  //   {
  //     id: 3,
  //     driver: "Sarah Wilson",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  //     phone: "55 789 012",
  //     departureGov: "Tunis",
  //     departureLoc: "FST",
  //     arrivalGov: "Ben Arous",
  //     arrivalLoc: "Rades",
  //     date: "2024-02-20",
  //     time: "09:30",
  //     price: "4",
  //     gender :"garçon",
  //     seats: 2,
  //     luggageType: "avec bagage",
  //     rating: 4.5
  //   }
  //   ,
  //   {
  //     id: 4,
  //     driver: "Sarah Wilson",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  //     phone: "55 789 012",
  //     departureGov: "Tunis",
  //     departureLoc: "FST",
  //     arrivalGov: "Ben Arous",
  //     arrivalLoc: "Rades",
  //     date: "2024-02-20",
  //     time: "09:30",
  //     price: "4",
  //     gender :"garçon",
  //     seats: 2,
  //     luggageType: "sans bagage",
  //     rating: 3.8
  //   }
  //   ,
  //   {
  //     id: 5,
  //     driver: "Sarah Wilson",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  //     phone: "55 789 012",
  //     departureGov: "Tunis",
  //     departureLoc: "FST",
  //     arrivalGov: "Ben Arous",
  //     arrivalLoc: "Rades",
  //     date: "2024-02-20",
  //     time: "09:30",
  //     price: "4",
  //     gender :"fille&garçon",
  //     seats: 2,
  //     luggageType: "sans bagage",
  //     rating: 2
  //   }
  // ];

  const handleModify = (offerId) => {
    navigate(`/dashboard/updateride/${offerId}`);
  };

  const handleCancelClick = (offerId) => {
    setOfferToCancel(offerId);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
    setOfferToCancel(null); // Reset the offer to delete
};

  const handleConfirmCancel =async () => {
    try {
      const token = passenger.token; 
      const response = await axios.delete(
        `http://localhost:3000/api/v1/offre/delete/${offerToCancel}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
      alert(response.data.message); // Notify the user
      // Update the offers list by filtering out the deleted offer
      setOffers(offres.filter((offer) => offer._id !== offerToCancel));
      handleModalClose(); // Close the modal
  } catch (error) {
      console.error("Error deleting the offer:", error);
      alert("Failed to delete the offer.");
      handleModalClose();
  }
  };

  return (
    <div className="container py-4 wid">
      <h5 className="mb-4">Mes trajets</h5>
      <div className="row">
        {offres.map((offer) => (
          <div className="col-md-6" key={offer._id}>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="text-center me-4">
                    <img
                      src={passenger.image}
                      alt={passenger.name}
                      className="rounded-circle border border-success"
                      style={{ width: "64px", height: "64px" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title mb-0">{passenger.name}</h5>
                      <div className="text-success fs-5 fw-bold">
                        {offer.prixparplace}DT
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 text-muted">
                        <i className="bi bi-geo-alt-fill text-success me-2"></i>
                        <strong>
                          {offer.gouvernorat_depart} ({offer.lieu_depart}) →{" "}
                          {offer.gouvernorat_arrivée} ({offer.lieu_arrivée})
                        </strong>
                      </p>
                      <div className="d-flex text-muted">
                        <span className="me-4">
                          <i className="bi bi-calendar3 me-1"></i>
                          {new Date(offer.dateDepart).toLocaleDateString('en-GB')}
                        </span>
                        <span className="me-4">
                          <i className="bi bi-clock me-1"></i>
                          {offer.heureDepart}
                        </span>
                        <span>
                          <i className="bi bi-telephone-fill me-1 text-success"></i>
                          +216 {offer.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap mt-3">
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-person-fill me-1 text-success"></i>
                        {offer.nombreplacedisponible} place{offer.nombreplacedisponible > 1 ? "s" : ""}{" "}
                        disponible{offer.nombreplacedisponible > 1 ? "s" : ""}
                      </span>
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-person-fill me-1 text-success"></i>
                        {offer.nombreplacerestant} place{offer.nombreplacerestant > 1 ? "s" : ""}{" "}
                        restante{offer.nombreplacerestant > 1 ? "s" : ""}
                      </span>
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-suitcase-fill me-1 text-success"></i>
                        {offer.bagage === "avec bagage"
                          ? "Avec bagage"
                          : "Sans bagage"}
                      </span>
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-people-fill me-1 text-success"></i>
                        {offer.genre === "Femme"
                          ? "Femme"
                          : offer.gender === "Homme"
                          ? "Homme"
                          : "Homme et Femme"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-end">
                  <button
                    className="btn btn-success px-4 me-2"
                    onClick={() => handleModify(offer._id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={() => handleCancelClick(offer._id)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      




      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Avertissement</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir annuler ce trajet ? </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
        <div className="d-flex c gap-2">
      <button
        className="btn btn-danger "
        onClick={handleModalClose}
      >
        Fermer
      </button>
      <button
        className="btn btn-success  "
        onClick={handleConfirmCancel}
      >
        Confirmer
      </button>
    </div>
</Modal.Footer>
      </Modal>
    </div>
  );
}
