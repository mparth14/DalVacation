// src/components/RoomCard.js
import React from 'react';

const RoomCard = ({ room }) => {
    return (
        <div className="room-card">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <p>Tariff: ${room.tariff}</p>
        </div>
    );
};

export default RoomCard;
