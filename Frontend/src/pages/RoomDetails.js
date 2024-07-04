// src/pages/RoomDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRooms } from '../contexts/RoomContext';

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms } = useRooms();
    const room = rooms.find(room => room.id === parseInt(id));

    if (!room) return <p>Room not found</p>;

    return (
        <div>
            <h1>{room.name}</h1>
            <p>{room.description}</p>
            <p>Tariff: {room.tariff}</p>
        </div>
    );
};

export default RoomDetails;
