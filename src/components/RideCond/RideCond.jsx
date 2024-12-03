import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function RideCond() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [offerToCancel, setOfferToCancel] = useState(null);

  const mockOffers = [
    {
      id: 1,
      driver: "John Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      phone: "55 123 456",
      departureGov: "Tunis",
      departureLoc: "FST",
      arrivalGov: "Ariana",
      arrivalLoc: "Borj Louzir",
      date: "2024-02-20",
      time: "08:00",
      price: "5",
      gender :"fille",
      seats: 1,
      luggageType: "avec bagage",
      rating: 4.8
    },
    {
      id: 2,
      driver: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      phone: "55 789 012",
      departureGov: "Tunis",
      departureLoc: "FST",
      arrivalGov: "Ben Arous",
      arrivalLoc: "Rades",
      date: "2024-02-20",
      time: "09:30",
      price: "4",
      gender :"garçon",
      seats: 2,
      luggageType: "light",
      rating: 4.5
    }
    ,
    {
      id: 3,
      driver: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      phone: "55 789 012",
      departureGov: "Tunis",
      departureLoc: "FST",
      arrivalGov: "Ben Arous",
      arrivalLoc: "Rades",
      date: "2024-02-20",
      time: "09:30",
      price: "4",
      gender :"garçon",
      seats: 2,
      luggageType: "avec bagage",
      rating: 4.5
    }
    ,
    {
      id: 4,
      driver: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      phone: "55 789 012",
      departureGov: "Tunis",
      departureLoc: "FST",
      arrivalGov: "Ben Arous",
      arrivalLoc: "Rades",
      date: "2024-02-20",
      time: "09:30",
      price: "4",
      gender :"garçon",
      seats: 2,
      luggageType: "sans bagage",
      rating: 3.8
    }
    ,
    {
      id: 5,
      driver: "Sarah Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      phone: "55 789 012",
      departureGov: "Tunis",
      departureLoc: "FST",
      arrivalGov: "Ben Arous",
      arrivalLoc: "Rades",
      date: "2024-02-20",
      time: "09:30",
      price: "4",
      gender :"fille&garçon",
      seats: 2,
      luggageType: "sans bagage",
      rating: 2
    }
  ];
  const handleModify = (offerId) => {
    navigate(`/dashboard/updateride/${offerId}`);
  };

  const handleCancelClick = (offerId) => {
    setOfferToCancel(offerId);
    setShowModal(true);
  };
  const handleModalClose = () => setShowModal(false);

  const handleConfirmCancel = () => {
    console.log(`Offer with ID ${offerToCancel} has been canceled.`);
    setShowModal(false);
    setOfferToCancel(null);
  };

  return (
    <div className="container py-4 wid">
      <h5 className="mb-4">Mes trajets</h5>
      <div className="row">
        {mockOffers.map((offer) => (
          <div className="col-md-6" key={offer.id}>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="text-center me-4">
                    <img
                      src={offer.avatar}
                      alt={offer.driver}
                      className="rounded-circle border border-success"
                      style={{ width: "64px", height: "64px" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title mb-0">{offer.driver}</h5>
                      <div className="text-success fs-5 fw-bold">
                        {offer.price}DT
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 text-muted">
                        <i className="bi bi-geo-alt-fill text-success me-2"></i>
                        <strong>
                          {offer.departureGov} ({offer.departureLoc}) →{" "}
                          {offer.arrivalGov} ({offer.arrivalLoc})
                        </strong>
                      </p>
                      <div className="d-flex text-muted">
                        <span className="me-4">
                          <i className="bi bi-calendar3 me-1"></i>
                          {offer.date}
                        </span>
                        <span className="me-4">
                          <i className="bi bi-clock me-1"></i>
                          {offer.time}
                        </span>
                        <span>
                          <i className="bi bi-telephone-fill me-1 text-success"></i>
                          +216 {offer.phone}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap mt-3">
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-person-fill me-1 text-success"></i>
                        {offer.seats} place{offer.seats > 1 ? "s" : ""}{" "}
                        disponible{offer.seats > 1 ? "s" : ""}
                      </span>
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-suitcase-fill me-1 text-success"></i>
                        {offer.luggageType === "avec bagage"
                          ? "Avec bagage"
                          : "Sans bagage"}
                      </span>
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-people-fill me-1 text-success"></i>
                        {offer.gender === "fille"
                          ? "Fille"
                          : offer.gender === "garçon"
                          ? "Garçon"
                          : "Fille & Garçon"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-end">
                  <button
                    className="btn btn-success px-4 me-2"
                    onClick={() => handleModify(offer.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger px-4"
                    onClick={() => handleCancelClick(offer.id)}
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
