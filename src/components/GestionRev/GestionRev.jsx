import React, { useState, useEffect } from "react";
import { Star, Phone, Luggage, MapPin, Users, X } from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function ReservationsList({ passenger }) {
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState({});
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [modifiedSeats, setModifiedSeats] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(0);

  const token = passenger.token;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/reserver/consultercov",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrips(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [token]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Effectuée":
        return "badge bg-secondary text-dark";
      case "Confirmée":
        return "badge bg-success text-light";
      case "En attente":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-light text-dark";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Confirmée":
        return "Confirmée";
      case "Annulée":
        return "Annulée";
      case "En attente":
        return "En attente";
      case "Rejetée":
        return "Rejetée";
      case "Effectuée":
        return "Effectuée";
      default:
        return "Inconnu";
    }
  };

  const handleRate = (index, value) => {

    const updatedTrip = { ...trips[index], rating: value };

    setTrips((prevTrips) =>
      prevTrips.map((trip, i) =>
        i === index ? updatedTrip : trip
      )
    );
    console.log(`Trajet ${index} noté ${updatedTrip.rating} étoiles.`);
    console.log(updatedTrip);

  };



  const handleCancelClick = async(index) => {
    
      try {
        console.log(token)
        const tripToReject = trips[index];
    
        const response = await fetch(`http://localhost:3000/api/v1/reserver/refuse/${tripToReject._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
    
        // Update the status to "Annulée" in the frontend state
        setTrips((prevTrips) => {
        const updatedTrips = [...prevTrips];
        updatedTrips[index] = { ...updatedTrips[index], status: 'Rejetée' };
        return updatedTrips;
        });

        // Optionally, close the cancel confirmation UI
        setCancelConfirm((prev) => ({ ...prev, [index]: false }));
        } catch (error) {
        console.error("Error deleting reservation:", error);
        alert("Erreur lors de l'annulation de la réservation.");
      }
    
  };


  const handleAcceptClick = async(index) => {
    
    try {
      console.log(token)
      const tripToConfirm = trips[index];
  
      const response = await fetch(`http://localhost:3000/api/v1/reserver/confirme/${tripToConfirm._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      // Update the status to "Confirmée" in the frontend state
        setTrips((prevTrips) => {
            const updatedTrips = [...prevTrips];
            updatedTrips[index] = { ...updatedTrips[index], status: 'Confirmée' };
            return updatedTrips;
        });


    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Erreur lors de l'annulation de la réservation.");
    }
  
};


  const handleModifyClick = (index) => {
    
      const trip = trips[index];
      setSelectedTripIndex(index);
      setModifiedSeats(trip.offer.nombreplacerestant);
      setAvailableSeats(trip.offer.nombreplacedisponible);
      setShowModifyModal(true);
    
  };

  const handleCancelConfirm = (index) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, i) =>
        i === index ? { ...trip, status: "Annulée" } : trip
      )
    );
    setCancelConfirm((prev) => ({ ...prev, [index]: false }));
  };

  const handleModifyModalClose = () => setShowModifyModal(false);
  const handleModalClose = () => setShowModal(false);

  const handleSaveModify = async (e) => {
    e.preventDefault();
  
    if (modifiedSeats > availableSeats) {
      alert(
        "Le nombre de places réservées ne peut pas dépasser le nombre de places disponibles."
      );
      return;
    }
  
    try {
      const tripToModify = trips[selectedTripIndex];
  
      // API call to update the reservation in the database
      await axios.patch(
        `http://localhost:3000/api/v1/reserver/update/${tripToModify._id}`,
        {
          numbreplacereservée: modifiedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update the frontend state
      setTrips((prevTrips) =>
        prevTrips.map((trip, index) =>
          index === selectedTripIndex
            ? {
                ...trip,
                numbreplacereservée: modifiedSeats,
              }
            : trip
        )
      );
      setShowModifyModal(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Erreur lors de la modification de la réservation.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Les Réservations</h2>
      <div className="row">
        {trips.map((trip, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                      alt={trip.passenger.name}
                      className="rounded-circle border border-success me-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div>
                      <h5 className="card-title mb-1">{trip.passenger.name}</h5>
                      <small className="text-muted">
                        {new Date(trip.offer.dateDepart).toLocaleDateString('en-GB')} • {trip.offer.heureDepart}
                      </small>
                    </div>
                  </div>
                  <span className={getStatusClass(trip.status)}>
                    {getStatusText(trip.status)}
                  </span>
                </div>
                <div className="row mb-3">
                  <div className="col-6">
                    <div className="d-flex">
                      <MapPin className="text-success me-2" />
                      <div>
                        <p className="mb-0 fw-bold">Départ</p>
                        <small className="text-muted">
                          {trip.offer.gouvernorat_depart}, {trip.offer.lieu_depart}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex">
                      <MapPin className="text-success me-2" />
                      <div>
                        <p className="mb-0 fw-bold">Arrivée</p>
                        <small className="text-muted">
                          {trip.offer.gouvernorat_arrivée}, {trip.offer.lieu_arrivée}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div className="d-flex align-items-center">
                    <Phone className="text-success me-2" />
                    <span className="text-muted me-4">+216 {trip.offer.phoneNumber}</span>
                    <Luggage className="text-success me-2" />
                    <span className="text-muted">
                      {trip.offer.bagage === "avec bagage" ? "Avec bagage" : "Sans bagage"}
                    </span>
                    <Users className="text-success me-2" />
                    <span className="text-muted">
                      {trip.numbreplacereservée} place{trip.numbreplacereservée > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="fw-bold text-success">
                    {trip.offer.prixparplace*trip.numbreplacereservée} DT
                  </div>
                </div>
                <div className="mt-3 d-flex justify-content-between">
                {trip.status === "En attente" && (
                    <>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleAcceptClick(index)}
                      >
                        Accepter
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelClick(index)}
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for General Messages */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modify Reservation Modal */}
      <Modal show={showModifyModal} onHide={handleModifyModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la Réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveModify}>
            <div className="mb-3">
              <label htmlFor="modifiedSeats" className="form-label">
                Nombre de places réservées :
              </label>
              <input
                type="number"
                id="modifiedSeats"
                className="form-control"
                value={modifiedSeats}
                onChange={(e) => setModifiedSeats(Number(e.target.value))}
                min={1}
                max={availableSeats}
              />
            </div>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ReservationsList;
