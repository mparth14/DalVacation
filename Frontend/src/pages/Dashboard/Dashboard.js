import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRooms } from '../../contexts/RoomContext';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/Searchbar/Searchbar';
import SortPicker from '../../components/SortPicker/SortPicker';
import RoomCard from '../../components/RoomCard/RoomCard';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const { rooms } = useRooms();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortType, setSortType] = useState('Recommended');
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        // Initially set filteredRooms to rooms
        setFilteredRooms(rooms);
    }, [rooms]);

    const handleSearch = () => {
        if (!Array.isArray(rooms)) return; // Guard against undefined or null rooms
        const filtered = rooms.filter(room => {
            const roomStartDate = new Date(room.startDate);
            const roomEndDate = new Date(room.endDate);
            const startMatch = startDate ? roomStartDate >= new Date(startDate) : true;
            const endMatch = endDate ? roomEndDate <= new Date(endDate) : true;
            return startMatch && endMatch;
        });
        setFilteredRooms(filtered);
    };

    const handleSortChange = (sortOption) => {
        setSortType(sortOption);
        let sortedRooms = [...filteredRooms];

        if (sortOption === 'Lowest price first') {
            sortedRooms.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'Highest price first') {
            sortedRooms.sort((a, b) => b.price - a.price);
        }

        setFilteredRooms(sortedRooms);
    };

    const role = user?.role ? user.role : null;

    console.log(filteredRooms);
    console.log("rooms", rooms);
    return (
        <div className="container-dashboard">
            {
                role === 'agent' ? (
                    <Link to="/manage-rooms">
                        <button>Manage Rooms</button>
                    </Link>
                ) : filteredRooms.length === 0 ? (
                    <LoadingBar />
                ) : (
                    <div>
                        <SearchBar
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            onSearch={handleSearch}
                        />
                        <div className='event-wrapper'>
                            <div className='event-sort'>
                                <SortPicker selectedOption={sortType} onSortChange={handleSortChange} />
                            </div>
                            <div className='event-container'>
                                {Array.isArray(filteredRooms) && filteredRooms.map(room => (
                                    <RoomCard key={room.id} room={room} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default Dashboard;
