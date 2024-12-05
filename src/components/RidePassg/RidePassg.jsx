import React, { useState } from "react";
import { Star, Phone, Luggage, MapPin, Users, X } from "lucide-react";
import { Modal, Button } from "react-bootstrap";

const mockTrips = [
  { id:"1",
    driver: "Sophie Martin",
    driverImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    date: "2024-03-20",
    time: "09:30",
    seats: 3,
    seatsr: 2,
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
    id:"21",
    driver: "Samia Aissa",
    driverImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    date: "2024-03-20",
    time: "09:30",
    seats: 3,
    seatsr: 2,
    luggage: "avec bagage",
    phone: "23456789",
    price: 25,
    fromGov: "Tunis",
    fromCity: "La Marsa",
    toGov: "Sousse",
    toCity: "Hammam Sousse",
    status: "completed",
    rating: 3,
  },
  {
    id:"3",
    driver: "Ahmed Ben Ali",
    driverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    date: "2024-03-15",
    time: "14:00",
    seats: 2,
    seatsr: 4,
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
    id:"14",
    driver: "Leila Trabelsi",
    driverImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    date: "2024-03-25",
    time: "16:45",
    seats: 3,
    seatsr: 3,
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
  //const [showModal, setShowModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false); // Nouvel état pour le modal de modification
  //const [modalContent, setModalContent] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState({});
  const [selectedTripIndex, setSelectedTripIndex] = useState(null);
  const [modifiedSeats, setModifiedSeats] = useState(1); // Nombre de places réservées
  const [availableSeats, setAvailableSeats] = useState(0); // Nombre de places disponibles

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



  const handleCancelClick = (index) => {
    
     
      setCancelConfirm((prev) => ({
        ...prev,
        [index]: true,
      }));
    
  };

  const handleModifyClick = (index) => {
  
      const trip = trips[index];
      setSelectedTripIndex(index);
      setModifiedSeats(trip.seatsr); // Pré-remplir avec le nombre de places réservées
      setAvailableSeats(trip.seats); // Le nombre de places disponibles est égal au nombre de places actuelles
      setShowModifyModal(true); // Affiche le modal de modification
    
  };

  const handleCancelConfirm = (index) => {
    console.log(trips[index].id)
    console.log(index)
    console.log("reservation supprimée")
    setCancelConfirm((prev) => ({ ...prev, [index]: false }));
  };

  const handleModifyModalClose = () => setShowModifyModal(false); // Ferme le modal de modification
  //const handleModalClose = () => setShowModal(false);
  const handleSaveModify = (e) => {
    e.preventDefault();

    // Validation du nombre de places modifiées
    if (modifiedSeats > availableSeats) {
      alert("Le nombre de places réservées ne peut pas dépasser le nombre de places disponibles.");
      return;
    }

    // Sauvegarder les modifications
    const updatedTrips = [...trips];
    updatedTrips[selectedTripIndex] = {
      ...updatedTrips[selectedTripIndex],
      seatsr: modifiedSeats,
    };
    setTrips(updatedTrips);
    console.log(updatedTrips[selectedTripIndex]);

    setShowModifyModal(false); // Fermer le modal après modification
  };
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
                    <span className="text-muted me-4">+216 {trip.phone}</span>
                    <Luggage className="text-success me-2" />
                    <span className="text-muted me-4">
                      {trip.luggage === "avec bagage" ? "Avec bagage" : "Sans bagage"}
                    </span>
                    <Users className="text-success me-2" />
                    <span className="text-muted">
                      {trip.seatsr} place{trip.seatsr > 1 ? "s" : ""}
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
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() =>
                            handleCancelClick(index)
                          }
                          className="btn btn-outline-danger"
                        >
                          Annuler la réservation
                        </button>
                        <button
                          onClick={() =>
                            handleModifyClick(index)
                          }
                          className="btn btn-outline-primary"
                        >
                          Modifier la réservation
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between">
                        <button
                          onClick={() => handleCancelConfirm(index)}
                          className="btn btn-danger"
                        >
                          Confirmer l'annulation
                        </button>
                        <button
                          onClick={() => setCancelConfirm((prev) => ({ ...prev, [index]: false }))}
                          className="btn btn-outline-secondary"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'alerte général */}
       {/* <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Avertissement</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          
        <button
        className="btn btn-danger "
        onClick={handleModalClose}
      >
        Ok
      </button>
        </Modal.Footer>
      </Modal> */}


       {/* Modal de modification */}

       <Modal show={showModifyModal} onHide={handleModifyModalClose}>
      

        <Modal.Header closeButton>
          <Modal.Title>Modifier la Réservation</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveModify}>

        <Modal.Body>
        <div className="form-group mb-3">

          <label className="form-label">Nombre de places à réserver</label>
          <input
            type="number"
            min="1"
            max={availableSeats}
            value={modifiedSeats}
            onChange={(e) => setModifiedSeats(parseInt(e.target.value))}
            className="form-control mb-2"
            required
          />
          <small className="text-muted">
            Nombre de places disponibles : {availableSeats}
          </small>
          </div>

        </Modal.Body>
        <Modal.Footer>
        <Button
      variant="danger"
      className="flex-grow-1 me-2"
      onClick={handleModifyModalClose}
    >
      Fermer
    </Button>
    <Button
    type="submit"
      variant="success"
      className="flex-grow-1 me-2"
      
    >
      Sauvgarder
    </Button>
        </Modal.Footer>
        </form>

      </Modal>
    </div>
  );
}

export default ReservationsList;
