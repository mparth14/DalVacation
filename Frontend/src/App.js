import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import './styles.css'; // Import global styles
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Import your custom theme
import { ThemeProvider } from '@mui/material/styles';
import Chatbot from './components/Chatbot/Chatbot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import RoomDetails from './pages/RoomDetails/RoomDetails';
import ManageRooms from './pages/ManageRooms/ManageRooms';

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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/manage-rooms" element={<ManageRooms />} />
      </Routes>
      <ToastContainer />
      <Chatbot />
    </>
  );
};

export default App;
