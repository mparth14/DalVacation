import React from 'react';
import PropTypes from 'prop-types';
import "./BookingCard.css"; 

const BookingCard = ({ booking }) => {
  return (
    <div className="booking-card">
      <h3>Booking ID: {booking.booking_id}</h3>
      <p>Room ID: {booking.room_id}</p>
      <p>Check-in Date: {booking.check_in_date}</p>
      <p>Check-out Date: {booking.check_out_date}</p>
      <p>Status: {booking.status}</p>
    </div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    booking_id: PropTypes.string.isRequired,
    room_id: PropTypes.string.isRequired,
    check_in_date: PropTypes.string.isRequired,
    check_out_date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default BookingCard;
