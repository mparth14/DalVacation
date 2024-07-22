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
    const [sortType, setSortType] = useState('Recent Date first');
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        // Initially set filteredRooms to rooms
        setFilteredRooms(rooms);
    }, [rooms]);

    const handleSearch = () => {
        if (!Array.isArray(rooms)) return; // Guard against undefined or null rooms

        const filtered = rooms.filter(room => {
            if (!room.booked_dates || !Array.isArray(room.booked_dates)) return true; // Guard against undefined or null booked_dates

            const startDateObj = startDate ? new Date(startDate) : null;
            const endDateObj = endDate ? new Date(endDate) : null;

            if (!startDateObj || !endDateObj) return true; // If no startDate or endDate is provided, include the room

            const searchRange = getDatesInRange(startDateObj, endDateObj);
            const bookedDates = room.booked_dates.map(date => {
                const parsedDate = new Date(date);
                if (isNaN(parsedDate.getTime())) {
                    console.error('Invalid date:', date);
                    return null;
                }
                return parsedDate;
            }).filter(date => date !== null); // Remove invalid dates

            const isAvailable = searchRange.every(date => {
                return !bookedDates.some(bookedDate => bookedDate.getTime() === date.getTime());
            });

            return isAvailable;
        });

        setFilteredRooms(filtered);
    };

    const getDatesInRange = (start, end) => {
        const date = new Date(start);
        const dates = [];
        while (date <= end) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return dates;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const handleSortChange = (sortOption) => {
        setSortType(sortOption);
        let sortedRooms = [...filteredRooms]; // Create a copy of filteredRooms

        if (sortOption === 'Recent Date first') {
            sortedRooms.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        } else if (sortOption === 'Oldest Date first') {
            sortedRooms.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        } else if (sortOption === 'Lowest price first') {
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
