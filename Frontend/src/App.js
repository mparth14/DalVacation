import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import RoomDetails from './pages/RoomDetails/RoomDetails';
import ManageRooms from './pages/ManageRooms/ManageRooms';
import Chatbot from './components/Chatbot/Chatbot'; // Import Chatbot component
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <Chatbot />
          <ToastContainer />
        </Router>
      </RoomProvider>
    </AuthProvider>
  );
};

export default App;
