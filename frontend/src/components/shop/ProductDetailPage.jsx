import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockData } from '../../data/mockSearchData';
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlistItem, isInWishlist } = useWishlist();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const foundProduct = mockData.find(item => item.id === id && item.type === 'artwork');

    if (foundProduct) {
      setProduct({
        ...foundProduct,
        inStock: foundProduct.availability === 'for sale',
      });
    } else {
      setError('Product not found.');
    }
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      console.log('Added to cart:', product.title);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlistItem(product);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading product details...</div>;
  }

  if (error) {
    return <div style={styles.container}><p style={styles.errorMessage}>{error}</p><Link to="/shop" style={styles.backLink}>Go back to shop</Link></div>;
  }

  if (!product) {
    return <div style={styles.container}><p style={styles.errorMessage}>Product data is missing.</p><Link to="/shop" style={styles.backLink}>Go back to shop</Link></div>;
  }

  const isLiked = isInWishlist(product.id);
  const isInCartAlready = isInCart(product.id);

  return (
    <div style={styles.container}>
      <style jsx>{`
        .product-detail-card {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .image-container {
          flex: 1;
          min-height: 300px;
        }
        
        .details-container {
          flex: 1;
          padding-left: 0;
        }
        
        @media (min-width: 768px) {
          .product-detail-card {
            flex-direction: row;
            align-items: flex-start;
          }
          
          .image-container {
            flex: 0 0 400px;
            min-height: unset;
            max-height: 500px;
          }
          
          .details-container {
            flex: 1;
            padding-left: 30px;
          }
        }
        
        @media (min-width: 1024px) {
          .image-container {
            flex: 0 0 450px;
          }
        }
      `}</style>
      
      <Link to="/shop" style={styles.backButton}>
        <ArrowLeft size={20} /> Back to Shop
      </Link>
      
      <div style={styles.productDetailCard} className="product-detail-card">
        {/* Product Image */}
        <div style={styles.imageContainer} className="image-container">
          <img
            src={product.image || 'https://via.placeholder.com/400/EEEEEE?text=No+Image'}
            alt={product.title}
            style={styles.productImage}
          />
        </div>

        {/* Product Details */}
        <div style={styles.detailsContainer} className="details-container">
          <h1 style={styles.title}>{product.title}</h1>
          <Link to={`/profile/${product.artistName.replace(/\s+/g, '-')}`} style={styles.artistLink}>
            <p style={styles.artistName}>By {product.artistName}</p>
          </Link>
          <p style={styles.description}>{product.description}</p>

          <div style={styles.priceSection}>
            <span style={styles.price}>Rs.{product.price ? product.price.toFixed(2) : 'N/A'}</span>
            {product.availability && (
              <span style={{
                ...styles.availability,
                backgroundColor: product.availability === 'for sale' ? '#28a745' :
                                 product.availability === 'sold out' ? '#dc3545' :
                                 '#ffc107',
              }}>
                {product.availability.charAt(0).toUpperCase() + product.availability.slice(1)}
              </span>
            )}
          </div>

          <div style={styles.infoGrid}>
            <div>
              <p style={styles.infoLabel}>Category</p>
              <p style={styles.infoValue}>{product.category}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Medium</p>
              <p style={styles.infoValue}>{product.medium}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Dimensions</p>
              <p style={styles.infoValue}>{product.dimensions}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Year</p>
              <p style={styles.infoValue}>{product.year}</p>
            </div>
            <div>
              <p style={styles.infoLabel}>Likes</p>
              <p style={styles.infoValue}>{product.likes}</p>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{
                ...styles.actionButton,
                backgroundColor: product.inStock ? (isInCartAlready ? '#28a745' : '#4574a1') : '#e6edf4',
                color: product.inStock ? '#ffffff' : '#9ca3af',
                cursor: product.inStock ? 'pointer' : 'not-allowed',
              }}
            >
              <ShoppingCart size={20} />
              {product.inStock ? (isInCartAlready ? 'Added to Cart' : 'Add to Cart') : 'Out of Stock'}
            </button>
            <button
              onClick={handleToggleWishlist}
              style={{
                ...styles.actionButton,
                backgroundColor: 'transparent',
                border: `1px solid ${isLiked ? '#dc3545' : '#e6edf4'}`,
                color: isLiked ? '#dc3545' : '#4574a1',
                padding: '12px',
                width: 'auto',
                flexGrow: 0,
              }}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={20} fill={isLiked ? '#dc3545' : 'none'} stroke={isLiked ? '#dc3545' : '#4574a1'} />
            </button>
            <button
              onClick={() => {console.log('Share product:', product.title); }}
              style={{
                ...styles.actionButton,
                backgroundColor: 'transparent',
                border: '1px solid #e6edf4',
                color: '#4574a1',
                padding: '12px',
                width: 'auto',
                flexGrow: 0,
              }}
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f8fefa',
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    textDecoration: 'none',
    color: '#4574a1',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'color 0.2s ease',
  },
  productDetailCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '30px',
    maxWidth: '1000px',
    width: '100%',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    borderRadius: '8px',
    maxHeight: '500px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '8px',
    lineHeight: '1.2',
  },
  artistLink: {
    textDecoration: 'none',
  },
  artistName: {
    fontSize: '18px',
    color: '#4574a1',
    marginBottom: '15px',
    cursor: 'pointer',
  },
  description: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  priceSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  price: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0c151d',
  },
  availability: {
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '20px',
    color: '#ffffff',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
    borderTop: '1px solid #e6edf4',
    paddingTop: '20px',
  },
  infoLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '15px',
    color: '#0c151d',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '14px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    flexGrow: 1,
  },
  errorMessage: {
    color: '#dc3545',
    fontSize: '18px',
    textAlign: 'center',
  },
  backLink: {
    display: 'block',
    marginTop: '20px',
    textAlign: 'center',
    color: '#4574a1',
    textDecoration: 'underline',
  }
};

export default ProductDetailPage;