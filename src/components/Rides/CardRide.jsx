import React, { useState } from "react";
import { X } from 'lucide-react';
import "./CardRide.css";
import axios from "axios"

export default function RideCard({ offer , passenger }) {
  
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [reservedSeats, setReservedSeats] = useState(1);
  const token=passenger.token

  console.log(token)
  console.log(passenger.Id)
  console.log(offer._id)

  const handleBooking = async (e) => {
    e.preventDefault();
  
    const reservationData = {
      passenger: passenger.Id, // Assuming `passenger` contains the logged-in passenger details
      offre: offer._id,         // Offer ID
      numbreplacereservée: reservedSeats, // Number of seats to reserve
    };
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/reserver', reservationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
      console.log(response.data.message); // Optional: show success message
      setBookingConfirmed(true);
    } catch (error) {
      console.error('Error creating reservation:', error.response?.data?.message || error.message);
      alert('Failed to create reservation. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="text-warning small d-flex">
        {Array(fullStars).fill(0).map((_, index) => (
          <i key={`full-${index}`} className="bi bi-star-fill me-1"></i>
        ))}
        {halfStar && <i className="bi bi-star-half me-1"></i>}
        {Array(emptyStars).fill(0).map((_, index) => (
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
                src={offer.covoitureur.image} // Placeholder or profile picture
                alt={offer.covoitureur.name}
                className="rounded-circle border-success"
              />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <h5 className="card-title mb-0">{offer.covoitureur.name}</h5>
                <div className="text-success fs-5 fw-bold">
                  {offer.prixparplace}DT / place
                </div>
              </div>
              <div className="mt-3">
                <p className="mb-1 text-muted">
                  <i className="bi bi-geo-alt-fill text-success me-2"></i>
                  <strong>
                    {offer.gouvernorat_depart} ({offer.lieu_depart}) → {offer.gouvernorat_arrivée} ({offer.lieu_arrivée})
                  </strong>
                </p>
                <div className="d-flex text-muted">
                  <span className="me-4">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(offer.dateDepart).toLocaleDateString()}
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
                  {offer.nombreplacerestant} place(s) restante(s)
                </span>
                <span className="badge bg-light text-dark me-2">
                  <i className="bi bi-suitcase-fill me-1 text-success"></i>
                  {offer.bagage}
                </span>
                <span className="badge bg-light text-dark me-2">
                  <i className="bi bi-people-fill me-1 text-success"></i>
                  {offer.genre}
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
              <p>{offer.gouvernorat_depart} ({offer.lieu_depart}) → {offer.gouvernorat_arrivée} ({offer.lieu_arrivée})</p>
              <p className="text-muted">
                {new Date(offer.dateDepart).toLocaleDateString()} à {offer.heureDepart}
              </p>
            </div>
            {bookingConfirmed ? (
              <div className="alert alert-success text-center">
                Réservation confirmée pour ce trajet !<strong> Veuillez attendre une confirmation envoyée par email.</strong>
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="form-group mb-3">
                  <label className="form-label">Nombre de places à réserver</label>
                  <input
                    type="number"
                    min="1"
                    max={offer.nombreplacerestant}
                    value={reservedSeats}
                    onChange={(e) => setReservedSeats(parseInt(e.target.value))}
                    className="form-control"
                    required
                  />
                  <small className="form-text">{offer.nombreplacerestant} places disponibles</small>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <p>Prix total :</p>
                  <p>{offer.prixparplace * reservedSeats}DT</p>
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
