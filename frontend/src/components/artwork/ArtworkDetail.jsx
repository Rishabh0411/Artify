// frontend/src/components/artwork/ArtworkDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { mockData } from '../../data/mockSearchData'; // Assuming mock data for artworks

const ArtworkDetail = () => {
  const { id } = useParams(); // Get artwork ID from URL
  const navigate = useNavigate();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Simulate fetching artwork data based on ID
    // In a real app, you'd make an API call here: fetch(`/api/artworks/${id}`)
    const foundArtwork = mockData.find(item => item.id === id && item.type === 'artwork');

    if (foundArtwork) {
      setArtwork({
        id: foundArtwork.id,
        title: foundArtwork.title,
        artistName: foundArtwork.artistName,
        description: foundArtwork.description,
        price: foundArtwork.price,
        image: foundArtwork.image,
        category: foundArtwork.category,
        medium: foundArtwork.medium,
        dimensions: foundArtwork.dimensions,
        year: foundArtwork.year,
        likes: foundArtwork.likes,
        availability: foundArtwork.availability,
        isArtist: foundArtwork.type === 'artist' // This is redundant for artwork detail but keeping it consistent with mock data structure
      });
    } else {
      setError("Artwork not found.");
    }
    setLoading(false);
  }, [id]);

  const handleLike = () => {
    if (artwork) {
      toggleWishlistItem(artwork);
    }
  };

  const handleAddToCart = () => {
    if (artwork && artwork.availability === 'for sale') {
      addToCart(artwork);
      alert(`${artwork.title} added to cart!`);
    } else if (artwork) {
      alert(`${artwork.title} is not available for purchase.`);
    }
  };

  const handleShare = () => {
    if (artwork) {
      // Basic share functionality (can be expanded)
      if (navigator.share) {
        navigator.share({
          title: artwork.title,
          text: `Check out this amazing artwork by ${artwork.artistName} on ArtVista!`,
          url: window.location.href,
        }).then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        alert(`Share this link: ${window.location.href}`);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Loading artwork details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={() => navigate('/shop')} style={styles.backButton}>
          Back to Shop
        </button>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>No artwork data available.</p>
        <button onClick={() => navigate('/shop')} style={styles.backButton}>
          Back to Shop
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(artwork.id);
  const isInCartAlready = isInCart(artwork.id);

  return (
    <div style={styles.container}>
      <div style={styles.detailCard}>
        {/* Left Section: Image */}
        <div style={styles.imageContainer}>
          <img
            src={artwork.image || 'https://via.placeholder.com/600/EEEEEE?text=No+Image'}
            alt={artwork.title}
            style={styles.artworkImage}
          />
        </div>

        {/* Right Section: Details */}
        <div style={styles.infoContainer}>
          <h1 style={styles.title}>{artwork.title}</h1>
          <p style={styles.artist}>
            By <span onClick={() => navigate(`/profile/${artwork.artistName}`)} style={styles.artistLink}>{artwork.artistName}</span>
          </p>
          <p style={styles.price}>Rs.{artwork.price ? artwork.price.toFixed(2) : 'N/A'}</p>

          <div style={styles.actions}>
            <button
              onClick={handleAddToCart}
              disabled={artwork.availability !== 'for sale'}
              style={{
                ...styles.button,
                backgroundColor: artwork.availability === 'for sale' ? (isInCartAlready ? '#28a745' : '#4574a1') : '#e6edf4',
                color: artwork.availability === 'for sale' ? '#ffffff' : '#9ca3af',
                cursor: artwork.availability === 'for sale' ? 'pointer' : 'not-allowed',
              }}
            >
              <ShoppingCart size={18} />
              {artwork.availability === 'for sale' ? (isInCartAlready ? 'Added to Cart' : 'Add to Cart') : 'Not For Sale'}
            </button>
            <button
              onClick={handleLike}
              style={{
                ...styles.iconButton,
                color: isLiked ? '#dc3545' : '#6b7280',
                border: isLiked ? '1px solid #dc3545' : '1px solid #e6edf4',
              }}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} fill={isLiked ? '#dc3545' : 'none'} />
            </button>
            <button onClick={handleShare} style={styles.iconButton} title="Share">
              <Share2 size={18} />
            </button>
          </div>

          <div style={styles.detailsSection}>
            <h3 style={styles.sectionTitle}>Description</h3>
            <p style={styles.description}>{artwork.description}</p>
          </div>

          <div style={styles.detailsSection}>
            <h3 style={styles.sectionTitle}>Details</h3>
            <p style={styles.detailItem}>Category: {artwork.category}</p>
            <p style={styles.detailItem}>Medium: {artwork.medium}</p>
            <p style={styles.detailItem}>Dimensions: {artwork.dimensions}</p>
            <p style={styles.detailItem}>Year: {artwork.year}</p>
            <p style={styles.detailItem}>Likes: {artwork.likes}</p>
            <p style={styles.detailItem}>Availability: {artwork.availability}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8fefa',
    minHeight: 'calc(100vh - 120px)', // Adjust based on header/footer
  },
  detailCard: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    maxWidth: '1000px',
    width: '100%',
    overflow: 'hidden',
    flexDirection: 'row', // Default for larger screens
    '@media (max-width: 768px)': {
      flexDirection: 'column', // Stack on smaller screens
    },
  },
  imageContainer: {
    flex: 1,
    minWidth: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6edf4',
    padding: '20px',
    '@media (max-width: 768px)': {
      minWidth: 'unset',
      width: '100%',
      maxHeight: '400px',
    },
  },
  artworkImage: {
    maxWidth: '100%',
    maxHeight: '500px',
    borderRadius: '8px',
    objectFit: 'contain', // Ensure the entire image is visible
  },
  infoContainer: {
    flex: 1.2,
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: 0,
    lineHeight: '1.2',
  },
  artist: {
    fontSize: '18px',
    color: '#6b7280',
    margin: '0',
  },
  artistLink: {
    color: '#4574a1',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  price: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: '10px 0 20px 0',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  button: {
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease',
  },
  iconButton: {
    backgroundColor: '#ffffff',
    border: '1px solid #e6edf4',
    borderRadius: '8px',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#4574a1',
      color: '#4574a1',
    },
  },
  detailsSection: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e6edf4',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '10px',
  },
  detailItem: {
    fontSize: '15px',
    color: '#4574a1',
    marginBottom: '8px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  message: {
    fontSize: '18px',
    color: '#6b7280',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: '18px',
    color: '#dc3545',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    marginTop: '20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
  },
};

export default ArtworkDetail;