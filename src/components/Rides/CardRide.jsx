import React, { useState } from "react";
import { X } from 'lucide-react';
import "./CardRide.css";

export default function RideCard({ offer }) {
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false); // Nouvel état pour la confirmation
  const [reservedSeats, setReservedSeats] = useState(1); // Nouvelle variable pour les places réservées

  const handleBooking = (e) => {
    e.preventDefault();
    console.log(`Booking ${reservedSeats} seats for ride ${offer.driver}`);
  
    // Déclenche la confirmation
    setBookingConfirmed(true);

   
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="text-warning small d-flex">
        {Array(fullStars)
          .fill(0)
          .map((_, index) => (
            <i key={`full-${index}`} className="bi bi-star-fill me-1"></i>
          ))}
        {halfStar && <i className="bi bi-star-half me-1"></i>}
        {Array(emptyStars)
          .fill(0)
          .map((_, index) => (
            <i key={`empty-${index}`} className="bi bi-star me-1"></i>
          ))}
      </div>
    );
  };

  return (
    <>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex align-items-start">
            <div className="text-center me-4">
              <img
                src={offer.avatar}
                alt={offer.driver}
                className="rounded-circle border-success"
              />
              <div className="mt-2">
                <div className="fw-bold">{offer.rating.toFixed(1)}</div>
                {renderStars(offer.rating)}
              </div>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <h5 className="card-title mb-0">{offer.driver}</h5>
                <div className="text-success fs-5 fw-bold">{offer.price}DT</div>
              </div>
              <div className="mt-3">
                <p className="mb-1 text-muted">
                  <i className="bi bi-geo-alt-fill text-success me-2"></i>
                  <strong>
                    {offer.departureGov} ({offer.departureLoc}) → {offer.arrivalGov} ({offer.arrivalLoc})
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
                  {offer.seats} place{offer.seats > 1 ? "s" : ""} disponible{offer.seats > 1 ? "s" : ""}
                </span>
                <span className="badge bg-light text-dark me-2">
                  <i className="bi bi-suitcase-fill me-1 text-success"></i>
                  {offer.luggageType === "avec bagage" ? "Avec bagage" : "Sans bagage"}
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
          <div className="mt-4 text-end">
            <button className="btn btn-success px-4" onClick={() => setShowModal(true)}>Réservez</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-link"
            >
              <X size={24} />
            </button>
            <h2 className="text-center mb-4">Réserver votre trajet</h2>
            <div className="trip-details">
              <p className="subtitle">Trajet sélectionné :</p>
              <p>{offer.departureGov} ({offer.departureLoc}) → {offer.arrivalGov} ({offer.arrivalLoc})</p>
              <p className="text-muted">{offer.date} à {offer.time}</p>
            </div>
            {bookingConfirmed ? (
              <div className="alert alert-success text-center">
                <strong>La demande de réservation a été effectuée pour ce trajet !</strong> Veuillez attendre une confirmation envoyée par email.
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="form-group mb-3">
                  <label className="form-label">Nombre de places à réserver</label>
                  <input
                    type="number"
                    min="1"
                    max={offer.seats}
                    value={reservedSeats}
                    onChange={(e) => setReservedSeats(parseInt(e.target.value))}
                    className="form-control"
                    required
                  />
                  <small className="form-text">{offer.seats} places disponibles</small>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <p>Prix total :</p>
                  <p>{offer.price * reservedSeats}DT</p>
                </div>
                <button type="submit" className="btn btn-success w-100 mt-3">Confirmer la réservation</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
