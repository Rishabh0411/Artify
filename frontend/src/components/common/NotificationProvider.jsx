import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration = 8000) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 10000,
      pointerEvents: 'none'
    }}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, onClose }) => {
  const getStyles = (type) => {
    const baseStyles = {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '1rem',
      marginBottom: '0.5rem',
      minWidth: '300px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      pointerEvents: 'auto',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: 'slideInRight 0.3s ease-out'
    };

    const typeStyles = {
      success: {
        borderLeftColor: '#28a745',
        borderLeftWidth: '4px',
        backgroundColor: '#f8fff8'
      },
      error: {
        borderLeftColor: '#dc3545',
        borderLeftWidth: '4px',
        backgroundColor: '#fff8f8'
      },
      warning: {
        borderLeftColor: '#ffc107',
        borderLeftWidth: '4px',
        backgroundColor: '#fffef8'
      },
      info: {
        borderLeftColor: '#007bff',
        borderLeftWidth: '4px',
        backgroundColor: '#f8f9ff'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          .notification-item:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
          }
        `}
      </style>
      <div
        className="notification-item"
        style={getStyles(notification.type)}
        onClick={onClose}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ 
            marginRight: '0.75rem', 
            fontSize: '1.2rem',
            flexShrink: 0 
          }}>
            {getIcon(notification.type)}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '0.95rem', 
              color: '#333',
              lineHeight: '1.4'
            }}>
              {notification.message}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#666',
              marginTop: '0.25rem'
            }}>
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              marginLeft: '0.5rem'
            }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationProvider;
