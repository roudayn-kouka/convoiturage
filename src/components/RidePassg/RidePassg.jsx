import React, { useState } from "react";
import { Star, Phone, Luggage, MapPin, Users } from "lucide-react";
import { Modal, Button } from "react-bootstrap"; // Importation de react-bootstrap

const mockTrips = [
  {
    driver: "Sophie Martin",
    driverImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    date: "2024-03-20",
    time: "09:30",
    seats: 3,
    luggage: "avec bagage",
    phone: "23456789",
    price: 25,
    fromGov: "Tunis",
    fromCity: "La Marsa",
    toGov: "Sousse",
    toCity: "Hammam Sousse",
    status: "confirmed",
    rating: null,
  },{
    driver: "Sophie Martin",
    driverImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    date: "2024-03-20",
    time: "09:30",
    seats: 3,
    luggage: "avec bagage",
    phone: "23456789",
    price: 25,
    fromGov: "Tunis",
    fromCity: "La Marsa",
    toGov: "Sousse",
    toCity: "Hammam Sousse",
    status: "confirmed",
    rating: null,
  },
  {
    driver: "Ahmed Ben Ali",
    driverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    date: "2024-03-15",
    time: "14:00",
    seats: 2,
    luggage: "sans bagage",
    phone: "98765432",
    price: 30,
    fromGov: "Sfax",
    fromCity: "Sfax Ville",
    toGov: "Gabès",
    toCity: "Gabès Ville",
    status: "completed",
    rating: 4,
  },
  {
    driver: "Ahmed Ben Ali",
    driverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    date: "2024-03-15",
    time: "14:00",
    seats: 2,
    luggage: "sans bagage",
    phone: "98765432",
    price: 30,
    fromGov: "Sfax",
    fromCity: "Sfax Ville",
    toGov: "Gabès",
    toCity: "Gabès Ville",
    status: "completed",
    rating: null,
  },
  {
    driver: "Leila Trabelsi",
    driverImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    date: "2024-03-25",
    time: "16:45",
    seats: 1,
    luggage: "avec bagage",
    phone: "55443322",
    price: 20,
    fromGov: "Nabeul",
    fromCity: "Hammamet",
    toGov: "Monastir",
    toCity: "Monastir Ville",
    status: "pending",
    rating: null,
  },{
    driver: "Leila Trabelsi",
    driverImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    date: "2024-03-25",
    time: "16:45",
    seats: 1,
    luggage: "avec bagage",
    phone: "55443322",
    price: 20,
    fromGov: "Nabeul",
    fromCity: "Hammamet",
    toGov: "Monastir",
    toCity: "Monastir Ville",
    status: "pending",
    rating: null,
  },
];

function ReservationsList() {
  const [trips, setTrips] = useState(mockTrips);
  const [showModal, setShowModal] = useState(false); // Pour afficher la popup
  const [cancelConfirm, setCancelConfirm] = useState({}); // Garde une trace des annulations
  const [selectedTripIndex, setSelectedTripIndex] = useState(null); // Pour garder la trace du trajet sélectionné

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "badge bg-secondary text-dark";
      case "confirmed":
        return "badge bg-success text-light";
      case "pending":
        return "badge bg-warning text-dark";
      default:
        return "badge bg-light text-dark";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Trajet effectué";
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      default:
        return "Inconnu";
    }
  };

  const handleRate = (index, value) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, i) =>
        i === index ? { ...trip, rating: value } : trip
      )
    );
    console.log(`Trajet ${index} noté ${value} étoiles.`);
  };

  const handleConfirmedCancelClick = (index) => {
    setSelectedTripIndex(index); // Enregistrer l'index du trajet
    setShowModal(true); // Affiche immédiatement la popup
  };

  const handlePendingCancelClick = (index) => {
    setCancelConfirm((prev) => ({
      ...prev,
      [index]: true, // Lorsque l'utilisateur clique, on passe en mode "confirmer"
    }));
    setSelectedTripIndex(index); // Enregistrer l'index du trajet en attente
  };

  const handleCancel = (index) => {
    console.log(`Réservation annulée pour le trajet ${index}`);
    // Vous pouvez ajouter ici le code pour annuler la réservation dans l'état.
    setTrips((prevTrips) =>
      prevTrips.map((trip, i) =>
        i === index ? { ...trip, status: "canceled" } : trip
      )
    );
    setCancelConfirm((prev) => ({ ...prev, [index]: false })); // Réinitialiser l'état de confirmation
  };

  const handleModalClose = () => setShowModal(false); // Fermer la popup

  return (
    <div className="container py-4">
      <h2 className="mb-4">Mes Réservations</h2>
      <div className="row">
        {trips.map((trip, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={trip.driverImage}
                      alt={trip.driver}
                      className="rounded-circle border border-success me-3"
                      style={{ width: "50px", height: "50px" }}
                    />
                    <div>
                      <h5 className="card-title mb-1">{trip.driver}</h5>
                      <small className="text-muted">
                        {trip.date} • {trip.time}
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
                          {trip.fromGov}, {trip.fromCity}
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
                          {trip.toGov}, {trip.toCity}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div className="d-flex align-items-center">
                    <Phone className="text-success me-2" />
                    <span className="text-muted me-4">{trip.phone}</span>
                    <Luggage className="text-success me-2" />
                    <span className="text-muted me-4">
                      {trip.luggage === "avec bagage" ? "Avec bagage" : "Sans bagage"}
                    </span>
                    <Users className="text-success me-2" />
                    <span className="text-muted">
                      {trip.seats} place{trip.seats > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="fw-bold text-success">{trip.price} DT</div>
                </div>
                {trip.status === "completed" && (
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex align-items-center">
                      <span className="fw-bold me-2">Note :</span>
                      <div className="d-flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(index, star)}
                            className="btn p-0"
                            disabled={!!trip.rating}
                          >
                            <Star
                              className={`text-${star <= trip.rating ? "warning" : "secondary"}`}
                            />
                          </button>
                        ))}
                      </div>
                      {!trip.rating && (
                        <small className="text-muted ms-2">Cliquez pour noter</small>
                      )}
                    </div>
                  </div>
                )}

                {(trip.status === "confirmed" || trip.status === "pending") && (
                  <div className="mt-3 pt-3 border-top">
                    {!cancelConfirm[index] ? (
                      <div className="text-center text-danger">
                        <button
                          onClick={() =>
                            trip.status === "confirmed"
                              ? handleConfirmedCancelClick(index)
                              : handlePendingCancelClick(index)
                          }
                          className="btn btn-outline-danger w-100"
                        >
                          Annuler la réservation
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-center text-muted">
                          Êtes-vous sûr de vouloir annuler cette réservation ?
                        </p>
                        <div className="d-flex">
                          <button
                            onClick={() => handleCancel(index)}
                            className="btn btn-danger flex-fill me-2"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() =>
                              setCancelConfirm((prev) => ({
                                ...prev,
                                [index]: false,
                              }))
                            }
                            className="btn btn-light flex-fill"
                          >
                            Retour
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour la confirmation de l'annulation */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Erreur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trips[selectedTripIndex]?.status === "confirmed" ? (
            <p  className="text-danger">Cette réservation ne peut pas être annulée après confirmation.</p>
          ) : (
            <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReservationsList;
