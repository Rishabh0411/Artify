// frontend/src/components/cart/Cart.jsx
import React from 'react';
import { useCart } from './CartContext';
import { ShoppingCart, X, Plus, Minus, Heart, Share2, CreditCard } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartSubtotal, getCartTotal, getTotalQuantity } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleMoveToWishlist = (product) => {
    toggleWishlistItem(product);
    removeFromCart(product.id);
  };

  const handleShare = (product) => {
    // Share logic here
    console.log('Share:', product.title);
  };

  const handleCheckout = () => {
    // Checkout logic here
    console.log('Proceeding to checkout...');
    alert('Proceeding to checkout (simulated). Cart will be cleared.');
    clearCart();
  };

  const CartItem = ({ item }) => {
    const isLiked = isInWishlist(item.id);
    
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e6edf4',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          flexWrap: 'wrap' // Allow wrapping on smaller screens
        }}>
          {/* Product Image */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative'
          }}>
            <img
              src={item.image || 'https://via.placeholder.com/120x120/EEEEEE?text=No+Image'}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Product Details */}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0c151d',
                marginBottom: '4px',
                margin: 0
              }}>{item.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#4574a1',
                marginBottom: '8px',
                margin: 0
              }}>{item.artist}</p>
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0c151d',
              marginTop: '10px'
            }}>
              Rs.{item.price.toFixed(2)}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
            minWidth: '120px' // Ensure enough width for buttons
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #e6edf4',
                  backgroundColor: '#f8fefa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0c151d'
                }}
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#0c151d', minWidth: '24px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #e6edf4',
                  backgroundColor: '#f8fefa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0c151d'
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleMoveToWishlist(item)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isLiked ? '#dc3545' : '#e6edf4',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isLiked ? '#ffffff' : '#4574a1'
                }}
                title={isLiked ? "Remove from Wishlist" : "Move to Wishlist"}
              >
                <Heart size={18} fill={isLiked ? '#ffffff' : 'none'} />
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#dc3545',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
                title="Remove from Cart"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f8fefa', minHeight: 'calc(100vh - 60px)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#0c151d',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Your Shopping Cart ({getTotalQuantity()})
        </h1>

        {cartItems.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
              margin: '0 auto'
            }}>
              <ShoppingCart size={40} color="#4574a1" />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0c151d',
              margin: '0 0 12px 0'
            }}>
              Your cart is empty
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4574a1',
              margin: '0 0 24px 0',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Looks like you haven't added anything to your cart yet. Start exploring and find your next favorite artwork!
            </p>
            <a
              href="/shop"
              style={{
                display: 'inline-block',
                backgroundColor: '#4574a1',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              Browse Artworks
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Cart Items List */}
            <div style={{ flex: '2', minWidth: '300px', maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div style={{
              flex: '1',
              minWidth: '280px',
              maxWidth: '35%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e6edf4',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: 'fit-content' // Make it fit content
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0c151d',
                marginBottom: '24px',
                margin: 0
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  <span>Subtotal ({getTotalQuantity()} items)</span>
                  <span>Rs.{getCartSubtotal().toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  <span>Taxes (estimated)</span>
                  <span>Rs.0.00</span>
                </div>
                <div style={{
                  borderTop: '1px solid #e6edf4',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#0c151d'
                }}>
                  <span>Total</span>
                  <span>Rs.{getCartTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  border: 'none',
                  backgroundColor: '#4574a1',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>

              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
                margin: 0
              }}>
                Secure checkout powered by Stripe (simulated)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;