import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingCard from '../BookingCard/BookingCard';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import "./MyBookings.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBookings = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const email = user.email;
          const response = await axios.post('https://jx5fjjnlkpcjmotv56dwhfegnm0aluwp.lambda-url.us-east-1.on.aws/', {
            email: email
          });
  
          setBookings(response.data);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch bookings');
          setLoading(false);
        }
      };
  
      fetchBookings();
    }, []);
  
    if (loading) {
      return <LoadingBar />;
    }
  
    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
        </div>
      );
    }
  
    return (
      <div className="container-bookings">
        <h1>My Bookings</h1>
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <BookingCard key={booking.booking_id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    );
  };
  
export default MyBookings;
