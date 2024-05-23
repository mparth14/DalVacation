// src/pages/Dashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container">
            <h1>Dashboard</h1>
            {user.role === 'agent' ? (
                <Link to="/manage-rooms">
                    <button>Manage Rooms</button>
                </Link>
            ) : (
                <p>Welcome, {user.email}</p>
            )}
        </div>
    );
};

export default Dashboard;
