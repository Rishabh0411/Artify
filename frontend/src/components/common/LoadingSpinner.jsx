import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#007bff', 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  };

  const spinnerSize = sizes[size];

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .loading-spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid ${color};
            border-radius: 50%;
            width: ${spinnerSize};
            height: ${spinnerSize};
            animation: spin 1s linear infinite;
          }
        `}
      </style>
      <div style={containerStyles}>
        <div className="loading-spinner" />
        {message && (
          <p style={{
            marginTop: '1rem',
            color: '#666',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default LoadingSpinner;

// Hook for loading states
export const useLoading = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const withLoading = React.useCallback(async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, withLoading, setError };
};
