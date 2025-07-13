// frontend/src/components/shop/ProductCard.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const isLiked = isInWishlist(product.id);
  const isInCartAlready = isInCart(product.id);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleWishlistItem(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    console.log('Added to cart:', product.title);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view:', product.title);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Share logic here
    console.log('Share:', product.title);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e6edf4',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/artwork/${product.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {/* Product Image */}
        <div style={{
          width: '100%',
          height: '200px', // Fixed height for consistency
          overflow: 'hidden',
          borderBottom: '1px solid #e6edf4',
          position: 'relative'
        }}>
          <img
            src={product.image || 'https://via.placeholder.com/300x200/EEEEEE?text=No+Image'}
            alt={product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          {/* Hover Overlay Buttons */}
          {isHovered && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 5
            }}>
              <button
                onClick={handleLike}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  color: isLiked ? '#dc3545' : '#6b7280'
                }}
                title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={18} fill={isLiked ? '#dc3545' : 'none'} />
              </button>
              <button
                onClick={handleQuickView}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  color: '#6b7280'
                }}
                title="Quick View"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={handleShare}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  color: '#6b7280'
                }}
                title="Share"
              >
                <Share2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#0c151d',
            marginBottom: '4px',
            lineHeight: '1.4',
            margin: 0
          }}>{product.title}</h3>
          <p style={{
            fontSize: '14px',
            color: '#4574a1',
            marginBottom: '8px',
            lineHeight: '1.4',
            margin: 0
          }}>{product.artist}</p>

          {/* Price and Likes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            marginTop: 'auto' // Pushes price/likes to bottom
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#0c151d'
            }}>
              Rs.{product.price}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <Heart size={14} />
              {product.likes}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div style={{ padding: '0 16px 16px 16px' }}>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={{
            width: '100%',
            border: 'none',
            backgroundColor: product.inStock ? (isInCartAlready ? '#28a745' : '#4574a1') : '#e6edf4',
            color: product.inStock ? '#ffffff' : '#9ca3af',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <ShoppingCart size={16} />
          {!product.inStock ? 'Out of Stock' : (isInCartAlready ? 'Added to Cart' : 'Add to Cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;