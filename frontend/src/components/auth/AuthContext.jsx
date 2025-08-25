import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [authToken, setAuthToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // The authService handles token and user persistence
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setAuthToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setAuthToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    authToken,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};