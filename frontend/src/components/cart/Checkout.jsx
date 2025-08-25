import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCart } from '../cart/CartContext';
import apiService from '../../services/apiService';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [orderData, setOrderData] = useState({
    shipping_first_name: user?.first_name || '',
    shipping_last_name: user?.last_name || '',
    shipping_email: user?.email || '',
    shipping_phone: user?.phone || '',
    shipping_address_line_1: user?.address_line_1 || '',
    shipping_address_line_2: user?.address_line_2 || '',
    shipping_city: user?.city || '',
    shipping_state: user?.state || '',
    shipping_postal_code: user?.postal_code || '',
    shipping_country: user?.country || 'India',
    billing_first_name: '',
    billing_last_name: '',
    billing_email: '',
    billing_phone: '',
    billing_address_line_1: '',
    billing_address_line_2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: 'India',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingIsSameAsShipping, setBillingIsSameAsShipping] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchCartData();
  }, [user]);

  const fetchCartData = async () => {
    try {
      const response = await apiService.getCart();
      setCartData(response);
      
      if (!response.items || response.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      navigate('/cart');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingToggle = (e) => {
    const isChecked = e.target.checked;
    setBillingIsSameAsShipping(isChecked);
    
    if (isChecked) {
      setOrderData(prev => ({
        ...prev,
        billing_first_name: prev.shipping_first_name,
        billing_last_name: prev.shipping_last_name,
        billing_email: prev.shipping_email,
        billing_phone: prev.shipping_phone,
        billing_address_line_1: prev.shipping_address_line_1,
        billing_address_line_2: prev.shipping_address_line_2,
        billing_city: prev.shipping_city,
        billing_state: prev.shipping_state,
        billing_postal_code: prev.shipping_postal_code,
        billing_country: prev.shipping_country,
      }));
    }
  };

  const calculateTotals = () => {
    if (!cartData) return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    
    const subtotal = cartData.total_amount || 0;
    const tax = subtotal * 0.18; // 18% tax
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over Rs.500
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const finalOrderData = { ...orderData };
      
      if (billingIsSameAsShipping) {
        finalOrderData.billing_first_name = finalOrderData.shipping_first_name;
        finalOrderData.billing_last_name = finalOrderData.shipping_last_name;
        finalOrderData.billing_email = finalOrderData.shipping_email;
        finalOrderData.billing_phone = finalOrderData.shipping_phone;
        finalOrderData.billing_address_line_1 = finalOrderData.shipping_address_line_1;
        finalOrderData.billing_address_line_2 = finalOrderData.shipping_address_line_2;
        finalOrderData.billing_city = finalOrderData.shipping_city;
        finalOrderData.billing_state = finalOrderData.shipping_state;
        finalOrderData.billing_postal_code = finalOrderData.shipping_postal_code;
        finalOrderData.billing_country = finalOrderData.shipping_country;
      }

      const order = await apiService.createOrder(finalOrderData);
      setCreatedOrder(order);
      
      // Process payment
      await apiService.processPayment(order.id, { payment_method: paymentMethod });
      
      // Clear cart
      clearCart();
      setOrderSuccess(true);
      
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, shipping, total } = calculateTotals();

  if (!cartData) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (orderSuccess && createdOrder) {
    return (
      <div style={styles.container}>
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>
            <Check size={48} color="#10b981" />
          </div>
          <h1 style={styles.successTitle}>Order Placed Successfully!</h1>
          <p style={styles.successMessage}>
            Thank you for your purchase! Your order #{createdOrder.order_number} has been confirmed.
          </p>
          <div style={styles.successActions}>
            <button 
              onClick={() => navigate(`/orders/${createdOrder.id}`)}
              style={styles.primaryButton}
            >
              View Order Details
            </button>
            <button 
              onClick={() => navigate('/shop')}
              style={styles.secondaryButton}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/cart')} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Cart
        </button>
        <h1 style={styles.title}>Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div style={styles.progressContainer}>
        {[1, 2, 3].map(step => (
          <div key={step} style={styles.progressStep}>
            <div style={{
              ...styles.stepCircle,
              backgroundColor: currentStep >= step ? '#4574a1' : '#e5e7eb',
              color: currentStep >= step ? '#ffffff' : '#6b7280'
            }}>
              {step}
            </div>
            <span style={{
              ...styles.stepLabel,
              color: currentStep >= step ? '#4574a1' : '#6b7280'
            }}>
              {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
            </span>
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>
                <Truck size={24} />
                Shipping Information
              </h2>
              
              <form style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>First Name *</label>
                    <input
                      type="text"
                      name="shipping_first_name"
                      value={orderData.shipping_first_name}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      name="shipping_last_name"
                      value={orderData.shipping_last_name}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      name="shipping_email"
                      value={orderData.shipping_email}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      type="tel"
                      name="shipping_phone"
                      value={orderData.shipping_phone}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Address Line 1 *</label>
                  <input
                    type="text"
                    name="shipping_address_line_1"
                    value={orderData.shipping_address_line_1}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Address Line 2</label>
                  <input
                    type="text"
                    name="shipping_address_line_2"
                    value={orderData.shipping_address_line_2}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={orderData.shipping_city}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>State *</label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={orderData.shipping_state}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Postal Code *</label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={orderData.shipping_postal_code}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Country *</label>
                    <input
                      type="text"
                      name="shipping_country"
                      value={orderData.shipping_country}
                      onChange={handleInputChange}
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>
                <CreditCard size={24} />
                Payment Information
              </h2>
              
              {/* Payment Method Selection */}
              <div style={styles.paymentMethods}>
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  <CreditCard size={20} />
                  Credit/Debit Card
                </label>
                
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  UPI Payment
                </label>
                
                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={styles.radio}
                  />
                  Bank Transfer
                </label>
              </div>

              {/* Billing Address */}
              <div style={styles.billingSection}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={billingIsSameAsShipping}
                    onChange={handleBillingToggle}
                    style={styles.checkbox}
                  />
                  Billing address is the same as shipping address
                </label>
                
                {!billingIsSameAsShipping && (
                  <form style={styles.form}>
                    <h3 style={styles.sectionTitle}>Billing Address</h3>
                    
                    <div style={styles.formRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>First Name *</label>
                        <input
                          type="text"
                          name="billing_first_name"
                          value={orderData.billing_first_name}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Last Name *</label>
                        <input
                          type="text"
                          name="billing_last_name"
                          value={orderData.billing_last_name}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Address Line 1 *</label>
                      <input
                        type="text"
                        name="billing_address_line_1"
                        value={orderData.billing_address_line_1}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>
                    
                    <div style={styles.formRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>City *</label>
                        <input
                          type="text"
                          name="billing_city"
                          value={orderData.billing_city}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Postal Code *</label>
                        <input
                          type="text"
                          name="billing_postal_code"
                          value={orderData.billing_postal_code}
                          onChange={handleInputChange}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>
                <Shield size={24} />
                Review Your Order
              </h2>
              
              {/* Order Items */}
              <div style={styles.orderItems}>
                <h3 style={styles.sectionTitle}>Items ({cartData.total_items})</h3>
                {cartData.items.map(item => (
                  <div key={item.id} style={styles.orderItem}>
                    <img 
                      src={item.artwork.main_image || '/placeholder-artwork.jpg'} 
                      alt={item.artwork.title}
                      style={styles.itemImage}
                    />
                    <div style={styles.itemInfo}>
                      <h4 style={styles.itemTitle}>{item.artwork.title}</h4>
                      <p style={styles.itemArtist}>by {item.artwork.artist.full_name}</p>
                      <p style={styles.itemDetails}>
                        {item.artwork.medium} • {item.artwork.dimensions}
                      </p>
                    </div>
                    <div style={styles.itemPrice}>
                      Rs.{item.artwork.price}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shipping Address Summary */}
              <div style={styles.addressSummary}>
                <h3 style={styles.sectionTitle}>Shipping Address</h3>
                <p>{orderData.shipping_first_name} {orderData.shipping_last_name}</p>
                <p>{orderData.shipping_address_line_1}</p>
                {orderData.shipping_address_line_2 && <p>{orderData.shipping_address_line_2}</p>}
                <p>{orderData.shipping_city}, {orderData.shipping_state} {orderData.shipping_postal_code}</p>
                <p>{orderData.shipping_country}</p>
              </div>
              
              {/* Payment Method Summary */}
              <div style={styles.paymentSummary}>
                <h3 style={styles.sectionTitle}>Payment Method</h3>
                <p style={styles.paymentMethodText}>
                  {paymentMethod === 'card' ? 'Credit/Debit Card' :
                   paymentMethod === 'upi' ? 'UPI Payment' : 'Bank Transfer'}
                </p>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div style={styles.navigationButtons}>
            {currentStep > 1 && (
              <button onClick={prevStep} style={styles.backBtn}>
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button onClick={nextStep} style={styles.nextBtn}>
                Next
              </button>
            ) : (
              <button 
                onClick={handleSubmitOrder} 
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Processing...' : `Place Order (Rs.${total.toFixed(2)})`}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.orderSummary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            
            <div style={styles.summaryLine}>
              <span>Subtotal ({cartData.total_items} items)</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            
            <div style={styles.summaryLine}>
              <span>Tax (18%)</span>
              <span>Rs.{tax.toFixed(2)}</span>
            </div>
            
            <div style={styles.summaryLine}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs.${shipping.toFixed(2)}`}</span>
            </div>
            
            {shipping === 0 && (
              <div style={styles.freeShippingNote}>
                🎉 You got free shipping!
              </div>
            )}
            
            <div style={styles.summaryTotal}>
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
            
            {/* Security Badge */}
            <div style={styles.securityBadge}>
              <Shield size={16} />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8fefa',
    minHeight: '100vh',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#6b7280',
  },
  successContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '60px 40px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#dcfce7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  successTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '16px',
  },
  successMessage: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
    lineHeight: '1.6',
  },
  successActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#4574a1',
    border: '2px solid #4574a1',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    maxWidth: '1200px',
    margin: '0 auto 32px',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4574a1',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '600',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: 0,
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '40px',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  stepCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  stepLabel: {
    fontSize: '14px',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
  content: {
    display: 'flex',
    gap: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 2,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  stepContent: {
    marginBottom: '32px',
  },
  stepTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    fontSize: '16px',
    fontWeight: '500',
  },
  radio: {
    width: '18px',
    height: '18px',
    accentColor: '#4574a1',
  },
  billingSection: {
    marginTop: '24px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4574a1',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '16px',
  },
  orderItems: {
    marginBottom: '24px',
  },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    margin: '0 0 4px 0',
  },
  itemArtist: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 4px 0',
  },
  itemDetails: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  itemPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4574a1',
  },
  addressSummary: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  paymentSummary: {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  paymentMethodText: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#4574a1',
  },
  navigationButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  nextBtn: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  submitBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  sidebar: {
    flex: 1,
    minWidth: '300px',
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    position: 'sticky',
    top: '20px',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '20px',
  },
  summaryLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '16px',
    color: '#374151',
  },
  freeShippingNote: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
    margin: '12px 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderTop: '2px solid #e5e7eb',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginTop: '12px',
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#f0f9ff',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500',
  },
};

export default Checkout;