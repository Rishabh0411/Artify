import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Calendar, Box, ChevronLeft, Image } from 'lucide-react';
import apiService from '../../services/apiService';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await apiService.getOrderDetail(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading order details...</div>
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

  if (!order) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Order not found.</div>
      </div>
    );
  }

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

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <ChevronLeft size={20} />
        Back to Orders
      </button>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Order #{order.order_number}</h1>
        <span style={{ ...styles.statusTag, backgroundColor: getStatusColor(order.status) }}>
          {order.status.toUpperCase()}
        </span>
      </div>
      
      <p style={styles.date}>Placed on {new Date(order.created_at).toLocaleDateString()}</p>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}><Package size={20} /> Order Summary</h2>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <strong>Subtotal:</strong> Rs.{order.sub_total}
          </div>
          <div style={styles.summaryItem}>
            <strong>Shipping:</strong> Rs.{order.shipping_cost}
          </div>
          <div style={styles.summaryItem}>
            <strong>Total:</strong> Rs.{order.total_amount}
          </div>
        </div>
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}><MapPin size={20} /> Shipping Information</h2>
        <div style={styles.infoCard}>
          <p><strong>Name:</strong> {order.shipping_address.full_name}</p>
          <p><strong>Address:</strong> {order.shipping_address.street_address}, {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.postal_code}</p>
          <p><strong>Country:</strong> {order.shipping_address.country}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}><Box size={20} /> Items</h2>
        <div style={styles.itemGrid}>
          {order.items.map(item => (
            <div key={item.id} style={styles.itemCard}>
              <div style={styles.itemImageContainer}>
                {item.artwork?.main_image ? (
                  <img src={item.artwork.main_image} alt={item.artwork.title} style={styles.itemImage} />
                ) : (
                  <div style={styles.placeholderImage}><Image size={32} /></div>
                )}
              </div>
              <div style={styles.itemDetails}>
                <h4 style={styles.itemTitle}>{item.artwork.title}</h4>
                <p style={styles.itemArtist}>by {item.artwork.artist.first_name} {item.artwork.artist.last_name}</p>
                <p style={styles.itemPrice}>Rs.{item.price_at_purchase}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8fefa',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
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
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4574a1',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: '500',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
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
  date: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
    margin: 0,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  summaryItem: {
    fontSize: '16px',
    color: '#374151',
  },
  infoCard: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.6',
  },
  itemGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #e5e7eb',
  },
  itemImageContainer: {
    width: '80px',
    height: '80px',
    flexShrink: 0,
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    color: '#9ca3af',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    margin: 0,
  },
  itemArtist: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4574a1',
    margin: 0,
  },
};

export default OrderDetail;