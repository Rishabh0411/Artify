// frontend/src/components/wishlist/Wishlist.jsx
import React from 'react';
import { useWishlist } from './WishlistContext';
import { useCart } from '../cart/CartContext';
import { Heart, ShoppingCart, X, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    console.log('Added to cart:', product.title);
    removeFromWishlist(product.id); // Remove from wishlist after adding to cart
  };

  const handleShare = (product) => {
    // Share logic here
    console.log('Share:', product.title);
  };

  const WishlistCard = ({ product }) => {
    const isInCartAlready = isInCart(product.id);
    
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
              src={product.image || 'https://via.placeholder.com/120x120/EEEEEE?text=No+Image'}
              alt={product.title}
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
              }}>{product.title}</h3>
              <p style={{
                fontSize: '14px',
                color: '#4574a1',
                marginBottom: '8px',
                margin: 0
              }}>{product.artist}</p>
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#0c151d',
              marginTop: '10px'
            }}>
              Rs.{product.price.toFixed(2)}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
            minWidth: '100px' // Ensure enough width for buttons
          }}>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock || isInCartAlready}
              style={{
                width: '100%',
                border: 'none',
                backgroundColor: !product.inStock || isInCartAlready ? '#e6edf4' : '#4574a1',
                color: !product.inStock || isInCartAlready ? '#9ca3af' : '#ffffff',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: !product.inStock || isInCartAlready ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <ShoppingCart size={16} />
              {!product.inStock ? 'Out of Stock' : (isInCartAlready ? 'Added to Cart' : 'Add to Cart')}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleShare(product)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e6edf4',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4574a1'
                }}
                title="Share"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => removeFromWishlist(product.id)}
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
                title="Remove from Wishlist"
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#0c151d',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Your Wishlist ({wishlistItems.length})
        </h1>

        {wishlistItems.length === 0 ? (
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
              <Heart size={40} color="#4574a1" />
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#0c151d',
              margin: '0 0 12px 0'
            }}>
              Your wishlist is empty
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#4574a1',
              margin: '0 0 24px 0',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Start exploring and save your favorite artworks to your wishlist by clicking the heart icon.
            </p>
            <Link
              to="/shop"
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
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {wishlistItems.map(product => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;