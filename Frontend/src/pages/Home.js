// src/pages/Home.js
import React from 'react';
import { useRooms } from '../contexts/RoomContext';
import RoomCard from '../components/RoomCard';

const Home = () => {
    const { rooms } = useRooms();

    return (
        <div className="container">
            <div className="room-list">
                {rooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default Home;
