import React from 'react';
import { useRooms } from '../../contexts/RoomContext';
import RoomCard from '../../components/RoomCard/RoomCard';

const Home = () => {
    const { rooms } = useRooms();

    // Check if rooms is not an array or is empty
    if (!Array.isArray(rooms) || rooms.length === 0) {
        return <div className="container">Loading...</div>;
    }

    return (
        <div className="container">
            <h1>Available Rooms</h1>
            <div className="room-list">
                {rooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
};

export default Home;
