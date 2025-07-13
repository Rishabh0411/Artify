// frontend/src/components/shop/ProductCard.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Share2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { Link } from 'react-router-dom';

// Image Zoom Modal Component
const ImageZoomModal = ({ product, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleModalClick = (e) => {
    // Close modal when clicking on backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      onClick={handleModalClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
      >
        <X size={24} color="#333" />
      </button>

      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: zoom <= 0.5 ? 'not-allowed' : 'pointer',
            opacity: zoom <= 0.5 ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (zoom > 0.5) e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
        >
          <ZoomOut size={24} color="#333" />
        </button>

        <button
          onClick={resetZoom}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#333',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: zoom >= 3 ? 'not-allowed' : 'pointer',
            opacity: zoom >= 3 ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (zoom < 3) e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
        >
          <ZoomIn size={24} color="#333" />
        </button>
      </div>

      {/* Image */}
      <img
        src={product.image || 'https://via.placeholder.com/800/EEEEEE?text=No+Image'}
        alt={product.title}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Product Title Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          maxWidth: '300px',
        }}
      >
        {product.title}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const isLiked = isInWishlist(product.id);
  const isInCartAlready = isInCart(product.id);

  const handleLike = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWishlistItem(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    console.log('Added to cart:', product.title);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowImageModal(true);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Share logic here
    console.log('Share:', product.title);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e6edf4',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/artwork/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Card Content Wrapper */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 480px)': {
              flexDirection: 'row',
              alignItems: 'center',
            },
            padding: '16px',
            gap: '16px',
            flexGrow: 1,
          }}>
            {/* Product Image */}
            <div style={{
              flexShrink: 0,
              width: '100%',
              height: '180px',
              backgroundColor: '#e6edf4',
              backgroundImage: `url(${product.image || 'https://via.placeholder.com/200/EEEEEE?text=No+Image'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              '@media (min-width: 480px)': {
                width: '140px',
                height: '140px',
              },
            }}>
            </div>

            {/* Product Details */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={styles.title}>{product.title}</h3>
                <Link to={`/profile/${product.artist.replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }}>
                  <p style={styles.artistName}>{product.artist}</p>
                </Link>
              </div>
              <div style={styles.priceAndLikes}>
                <div style={styles.price}>Rs.{product.price ? product.price.toFixed(2) : 'N/A'}</div>
                <div style={styles.likes}>
                  <Heart size={14} />
                  {product.likes}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Hover Icons - MOVED OUTSIDE OF LINK */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '100%',
            height: '180px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: 1,
            transition: 'opacity 0.3s ease',
            borderRadius: '8px',
            zIndex: 10,
            '@media (min-width: 480px)': {
              width: '140px',
              height: '140px',
            },
          }}>
            <button
              onClick={handleQuickView}
              style={{ ...styles.iconButton, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.6)' }}
              title="Quick View"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={handleShare}
              style={{ ...styles.iconButton, color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.6)' }}
              title="Share"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={handleLike}
              style={{
                ...styles.iconButton,
                color: isLiked ? '#dc3545' : '#ffffff',
                backgroundColor: isLiked ? 'rgba(220,53,69,0.2)' : 'rgba(0,0,0,0.6)',
              }}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={20} fill={isLiked ? '#dc3545' : 'none'} stroke={isLiked ? '#dc3545' : '#ffffff'} />
            </button>
          </div>
        )}

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

      {/* Image Zoom Modal */}
      <ImageZoomModal 
        product={product} 
        isOpen={showImageModal} 
        onClose={() => setShowImageModal(false)} 
      />
    </>
  );
};

const styles = {
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '4px',
    lineHeight: '1.3',
  },
  artistName: {
    fontSize: '14px',
    color: '#4574a1',
    marginBottom: '8px',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  priceAndLikes: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0c151d',
  },
  likes: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
  },
  iconButton: {
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default ProductCard;