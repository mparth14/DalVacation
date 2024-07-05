import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import your custom theme
import { ThemeProvider } from '@mui/material/styles';
import Chatbot from './components/Chatbot/Chatbot';

const App = () => {
  return (

    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RoomProvider>
          <Router>
            <Main />
          </Router>
        </RoomProvider>
      </AuthProvider>
      <CssBaseline />
    </ThemeProvider>

  );
};

const Main = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/manage-rooms" element={<ManageRooms />} />
      </Routes>

      <Chatbot />

    </>
  );
};

export default App;
