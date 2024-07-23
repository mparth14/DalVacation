import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./RoomCard.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const RoomCard = ({ room }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/room/${room.room_id}`);
    };

    return (
        <div className="room-pick-card" onClick={handleClick}>
            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} >

                {room.images && room.images.length > 0 ? (
                    room.images.map((image, index) => (
                        <img key={index} className='room-image' src={image} />
                    ))
                ) : (
                    <img className='room-image' src="https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg" alt="Placeholder Image" />
                )}

            </Carousel>

            <span className="room-desc"> {room.no_of_beds} Beds , {room.no_of_baths} Baths </span>
            <div className="room-details">
                <div className="room-title">{room.room_name} - {room.room_type}</div>
                <div className="room-datetime">
                    <span className="room-date">${room.price}</span>
                    <span className="room-desc">Max:{room.max_guests}</span>
                </div>
            </div>
            <div className="room-info">
                <div className="room-desc">{room.about}</div>
            </div>
        </div >
    );
};

export default RoomCard;
