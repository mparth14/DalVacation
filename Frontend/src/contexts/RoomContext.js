import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from "axios";

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Fetch rooms when component mounts
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms');
            if (!response) {
                throw new Error('Failed to fetch rooms');
            }

            setRooms(JSON.parse(response.data.body));
            console.log("response", response);


        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

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
