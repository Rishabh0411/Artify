import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, X, Calendar, DollarSign, Box } from 'lucide-react';
import apiService from '../../services/apiService';
import { useAuth } from '../auth/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.user_type !== 'buyer') {
        setError('You must be a buyer to view this page.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiService.getUserOrders();
        setOrders(data.results || data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load order history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#10b981';
      case 'shipped':
        return '#f59e0b';
      case 'processing':
        return '#4574a1';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading order history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Your Orders</h1>
      
      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <Box size={48} color="#9ca3af" />
          <p style={styles.emptyText}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard} onClick={() => handleOrderClick(order.id)}>
              <div style={styles.orderHeader}>
                <h2 style={styles.orderNumber}>Order #{order.order_number}</h2>
                <span style={{ ...styles.statusTag, backgroundColor: getStatusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div style={styles.orderSummary}>
                <div style={styles.summaryItem}>
                  <Calendar size={16} color="#6b7280" />
                  <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div style={styles.summaryItem}>
                  <DollarSign size={16} color="#6b7280" />
                  <span>Total: Rs.{order.total_amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8fefa',
    minHeight: '100vh',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#ef4444',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '24px',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  },
  emptyText: {
    fontSize: '18px',
    marginTop: '16px',
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  orderNumber: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0c151d',
    margin: 0,
  },
  statusTag: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  },
  orderSummary: {
    display: 'flex',
    gap: '20px',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6b7280',
  },
};

export default OrderHistory;