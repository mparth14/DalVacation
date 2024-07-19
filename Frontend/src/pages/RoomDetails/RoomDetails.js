import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRooms } from '../../contexts/RoomContext';
import { useAuth } from '../../contexts/AuthContext';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import axios from "axios";
import "./RoomDetails.css";
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms } = useRooms();
    const { user } = useAuth();
    const room = rooms.find(room => room.room_id === id);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [guests, setGuests] = useState('');

    const handleBooking = async (event) => {
        event.preventDefault();

        // Convert dates to the desired format
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
            email: user ? user.email : 'sruthii.mec@gmail.com',
            phone,
            guests,
            check_in_date: formatDate(startDate),
            check_out_date: formatDate(endDate),

        };

        console.log("booking-data", bookingData);

        try {
            const response = await axios.post('https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms/room/book', bookingData);
            console.log('Booking successful:', response.data);
            toast.success('Booking successful!');
        } catch (error) {
            console.error('Error booking room:', error);
            toast.error('Error booking room');
            // Handle error (e.g., show error message)
        }
    };

    if (!room) return <p>Room not found</p>;

    return (
        <div className='room-details-container'>
            <h1>{room.room_name}</h1>

            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} >

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
                            <p> {room.no_of_beds} Beds, {room.no_of_baths} Baths, {room.max_guests} Guests </p>
                        </div>
                        <h1>${room.price}</h1>
                    </div>
                    <p>{room.about}</p>
                    <div>
                        <ul>
                            {room.facilities.map((facility, index) => (
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
                        placeholder="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
            </div >
        </div >

    );
};

export default RoomDetails;
