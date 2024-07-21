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

    const addRoom = async (room) => {
        try {
            const response = await axios.post('https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms', room);
            if (response.status === 200) {
                setRooms([...rooms, room]);
            }
        } catch (error) {
            console.error('Error adding room:', error);
        }    
    };

    const updateRoom = async (updatedRoom) => {
        try {
            const response = await axios.put('https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms/room', updatedRoom);
            if (response.status === 200) {
                setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room));
            }
        } catch (error) {
            console.error('Error updating room:', error);
        }
    };

    const deleteRoom = async (roomId) => {
        try {
            const response = await axios.delete(`https://yun7hvv6d4.execute-api.us-east-1.amazonaws.com/RoomDetails/rooms/room`, {
                data: { room_id: roomId }
            });
            if (response.status === 200) {
                setRooms(rooms.filter(room => room.room_id !== roomId));
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    return (
        <RoomContext.Provider value={{ rooms, addRoom, updateRoom, deleteRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRooms = () => useContext(RoomContext);
