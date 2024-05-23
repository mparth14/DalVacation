// src/contexts/RoomContext.js
import React, { createContext, useState, useContext } from 'react';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);

    const addRoom = (room) => {
        setRooms([...rooms, room]);
    };

    const updateRoom = (updatedRoom) => {
        setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
    };

    const deleteRoom = (roomId) => {
        setRooms(rooms.filter(room => room.id !== roomId));
    };

    return (
        <RoomContext.Provider value={{ rooms, addRoom, updateRoom, deleteRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRooms = () => useContext(RoomContext);
