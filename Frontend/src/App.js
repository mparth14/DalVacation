import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoomProvider } from './contexts/RoomContext';
import './styles.css'; 
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; 
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
import FeedbackForm from './pages/Feedback/FeedbackForm';
import FeedbackDisplay from './pages/Feedback/FeedbackDisplay';
import Chat from './components/PubSub/Chat';
import RequestList from './components/PubSub/RequestList';
import DashboardPage from './pages/DashboardPage/DashboardPage';

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
  
  const hideNavbarRoutes = ['/login', '/signup', '/concern-request-list'];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname) && !location.pathname.startsWith('/chat/');

  const ProtectedRouteForAgents = ({ element: Component, ...rest }) => {
    const role = localStorage.getItem('role');
  
    if (role && role =='property-agents') {
      return <Component {...rest} />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  const ProtectedRouteForUsers = ({ element: Component, ...rest }) => {
    const isLoggedIn = !!localStorage.getItem('role');
  
    if (isLoggedIn) {
      return <Component {...rest} />;
    } else {
      // Redirect to login if not logged in
      return <Navigate to="/login" />;
      //return <Component {...rest} />;
    }
  };

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/room/:id" element={<RoomDetails />} />
        <Route path="/manage-rooms" element={<ProtectedRouteForAgents element={ManageRooms} />} />
        <Route path="/feedback" element={<ProtectedRouteForUsers element={FeedbackForm} />}  />
        {/* <Route path="/feedback-display" element={<FeedbackDisplay/>} /> */}
        <Route path="/concern-request-list" element={<ProtectedRouteForUsers element={RequestList} />}  />
        <Route path="/chat/:requestId" element={<ProtectedRouteForUsers element={Chat} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard-page" element={<ProtectedRouteForAgents element={DashboardPage} />} />
      </Routes >
      <ToastContainer />
      {showNavbar && <Chatbot />}
    </>
  );
};

export default App;
