import React, { useState } from 'react';
import { useRooms } from '../../contexts/RoomContext';
import RoomCard from '../../components/RoomCard/RoomCard';

const ManageRooms = () => {
    const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
    const [newRoom, setNewRoom] = useState({ name: '', description: '', tariff: '' });

    const handleAddRoom = () => {
        addRoom({ ...newRoom, id: rooms.length + 1 });
        setNewRoom({ name: '', description: '', tariff: '' });
    };

    return (
        <div className="container">
            <h1>Manage Rooms</h1>
            <div>
                <h2>Add Room</h2>
                <div className="form-group">
                    <input
                        type="text"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        placeholder="Room Name"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        placeholder="Room Description"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        value={newRoom.tariff}
                        onChange={(e) => setNewRoom({ ...newRoom, tariff: e.target.value })}
                        placeholder="Tariff"
                    />
                </div>
                <button onClick={handleAddRoom}>Add Room</button>
            </div>
            <div>
                <h2>Existing Rooms</h2>
                <div className="room-list">
                    {rooms.map(room => (
                        <div key={room.id}>
                            <RoomCard room={room} />
                            <button onClick={() => updateRoom({ ...room, name: room.name + ' Updated' })}>Update</button>
                            <button onClick={() => deleteRoom(room.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageRooms;
