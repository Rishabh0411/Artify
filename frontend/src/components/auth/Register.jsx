import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import './AuthForms.css'; // <-- Import the new CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        is_artist: false,
    });
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // This is the crucial fix: create a new object with only the required fields
        const registrationData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        register(registrationData);
    };

    return (
        <div className="auth-form-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Choose a password"
                        required
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="is_artist"
                            checked={formData.is_artist}
                            onChange={handleChange}
                        />
                        I am an artist
                    </label>
                </div>
                <button type="submit" className="submit-btn">Register</button>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;