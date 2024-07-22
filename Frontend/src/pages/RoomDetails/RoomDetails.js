import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../../contexts/RoomContext';
import { useAuth } from '../../contexts/AuthContext';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import axios from "axios";
import "./RoomDetails.css";
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FeedbackDisplay from '../Feedback/FeedbackDisplay';
import FeedbackForm from '../Feedback/FeedbackForm';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { rooms } = useRooms();
    const { user } = useAuth();
    const room = rooms.find(room => room.room_id === id);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [phone, setPhone] = useState('');
    const [guests, setGuests] = useState('');
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const handleBooking = async (event) => {
        event.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }

        if (!phone || !guests || !startDate || !endDate) {
            toast.error('Enter valid booking data.');
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            toast.error('Check-out date must be after check-in date');
            return;
        }

        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            toast.error('Invalid phone number');
            return;
        }

        if (parseInt(guests) > room.max_guests) {
            toast.error(`Number of guests cannot exceed ${room.max_guests}`);
            return;
        }

        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        const bookingData = {
            room_id: id,
            email: user.email,
            phone,
            guests,
            check_in_date: formatDate(startDate),
            check_out_date: formatDate(endDate),
        };

        try {
            const response = await axios.post('https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms/room/book', bookingData);
            toast.success('Booking Requested!');
        } catch (error) {
            toast.error('Error booking room');
        }
    };

    const handleFeedbackClick = (event) => {
        event.preventDefault();

        if (!user) {
            navigate('/login');
            return;
        }
        setFeedbackOpen(true);
    };

    const handleFeedbackClose = () => {
        setFeedbackOpen(false);
    };

    if (!room) return <p>Room not found</p>;

    const facilities = Array.isArray(room.facilities) ? room.facilities : room.facilities.split(',').map(facility => facility.trim());

    return (
        <div className='room-details-container'>
            <h1>{room.room_name}</h1>

            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
                {room.images && room.images.length > 0 ? (
                    room.images.map((image, index) => (
                        <img key={index} className='room-carousel-image' src={image} />
                    ))
                ) : (
                    <img className='room-carousel-image' src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" alt="Placeholder Image" />
                )}
            </Carousel>

            <div className='room-detail-items'>
                <div>
                    <div className='room-detail-left'>
                        <div>
                            <h3>{room.room_type} Room:</h3>
                            <p>{room.no_of_beds} Beds, {room.no_of_baths} Baths, {room.max_guests} Guests</p>
                        </div>
                        <h1>${room.price}</h1>
                    </div>
                    <p>{room.about}</p>
                    <div>
                        <ul>
                            {facilities.map((facility, index) => (
                                <li key={index}>{facility}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='room-book-box'>
                    <div className='room-book-dates'>
                        <div className='room-book-inputdate'>
                            <label>Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="yyyy-mm-dd"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div className='room-book-inputdate'>
                            <label>End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="yyyy-mm-dd"
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                    </div>
                    <input
                        placeholder="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        placeholder="0"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                    <button onClick={(event) => handleBooking(event)}>BOOK</button>
                </div>
            </div>
            {/* Feedback Display Section */}
            <FeedbackDisplay roomId={room.room_id} />
            <Button variant="contained" color="primary" onClick={handleFeedbackClick} style={{ marginTop: '20px' }}>
                Leave Feedback
            </Button>

            <Dialog open={feedbackOpen} onClose={handleFeedbackClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Leave Feedback
                    <IconButton aria-label="close" onClick={handleFeedbackClose} style={{ position: 'absolute', right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FeedbackForm roomId={room.room_id} isRecreation={room.isRecreation} handleClose={handleFeedbackClose} user={user} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFeedbackClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RoomDetails;
