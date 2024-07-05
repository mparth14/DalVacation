import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ email, role });
    };

    return (
        <div className="container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>
                <div className="form-group">
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
