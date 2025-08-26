import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, user, authToken } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Debug logging
  console.log('ProtectedRoute check:', {
    requireAuth,
    isAuthenticated: isAuthenticated(),
    hasUser: !!user,
    hasToken: !!authToken,
    currentPath: location.pathname
  });

  if (requireAuth) {
    // If authentication is required but user is not authenticated
    if (!isAuthenticated()) {
      console.log('Redirecting to login from:', location.pathname);
      // Save the attempted location for redirect after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else {
    // If this is a public route (like login/register) but user is authenticated
    if (isAuthenticated()) {
      console.log('User already authenticated, redirecting to home');
      // Redirect to home if trying to access login/register while authenticated
      const from = location.state?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }
  }

  return children;
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4574a1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  }
};

// Add CSS for spinner animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-component="protected-route"]')) {
  styleSheet.setAttribute('data-component', 'protected-route');
  document.head.appendChild(styleSheet);
}

export default ProtectedRoute;