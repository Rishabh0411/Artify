import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authService.getToken();
        const currentUser = authService.getCurrentUser();
        
        console.log('Initializing auth state:', { token: !!token, user: currentUser });
        
        if (token && currentUser) {
          setAuthToken(token);
          setUser(currentUser);
          console.log('Auth state initialized successfully');
        } else {
          // Clear any inconsistent state
          authService.logout();
          setAuthToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear potentially corrupted state
        authService.logout();
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await authService.login(email, password);
      
      console.log('Login response:', response);
      
      // Update state immediately
      setAuthToken(response.token);
      setUser(response.user);
      
      console.log('Auth state updated after login:', {
        token: !!response.token,
        user: response.user
      });
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      return response;
    } catch (error) {
      console.error('Login Error:', error);
      // Clear any partial state on error
      setAuthToken(null);
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration...');
      const response = await authService.register(userData);
      
      console.log('Registration response:', response);
      
      // Update state immediately
      setAuthToken(response.token);
      setUser(response.user);
      
      console.log('Auth state updated after registration:', {
        token: !!response.token,
        user: response.user
      });
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      return response;
    } catch (error) {
      console.error('Registration Error:', error);
      // Clear any partial state on error
      setAuthToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear state regardless of API call success
      setAuthToken(null);
      setUser(null);
      console.log('Auth state cleared after logout');
      navigate('/login', { replace: true });
    }
  };

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      if (authToken) {
        const userData = await authService.getProfile();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails, user might need to login again
      if (error.status === 401) {
        logout();
      }
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const hasToken = !!authToken;
    const hasUser = !!user;
    const result = hasToken && hasUser;
    
    console.log('Auth check:', { hasToken, hasUser, isAuthenticated: result });
    
    return result;
  };

  const value = {
    user,
    authToken,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated,
    loading,
  };

  console.log('AuthContext state:', { user: !!user, token: !!authToken, loading });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};