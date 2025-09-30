import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          margin: '1rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h2 style={{ color: '#c33', marginBottom: '1rem' }}>
            Oops! Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            We're sorry for the inconvenience. Our team has been notified.
          </p>
          <details style={{ 
            textAlign: 'left', 
            backgroundColor: '#f9f9f9', 
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error Details (for developers)
            </summary>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontSize: '0.8rem',
              color: '#333',
              marginTop: '0.5rem'
            }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.reload();
            }}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
