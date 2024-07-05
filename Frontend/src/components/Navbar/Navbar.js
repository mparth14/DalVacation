import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav>
            <div>
                <Link to="/">Home</Link>
                {user && user.role === 'agent' && <Link to="/manage-rooms">Manage Rooms</Link>}
            </div>
            <div>
                {user ? (
                    <>
                        <span>{user.email}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
