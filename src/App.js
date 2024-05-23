// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RoomDetails from './pages/RoomDetails';
import ManageRooms from './pages/ManageRooms';
import './styles.css'; // Import global styles

const App = () => {
  return (
    <AuthProvider>
      <RoomProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/manage-rooms" element={<ManageRooms />} />
          </Routes>
        </Router>
      </RoomProvider>
    </AuthProvider>
  );
};

export default App;
