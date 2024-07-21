import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('user')) || null);

    useEffect(() => {
        // Persist user data in local storage
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        if (user && user.email) {
            try {
                await axios.post('https://clpiyaf3k3yk4qv4a4wjsw2tte0cxwtj.lambda-url.us-east-1.on.aws/', {
                    email: user.email
                });
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
