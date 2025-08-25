import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { mockData } from '../../data/mockSearchData';
import './ArtworkDetail.css';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlistItem, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      setLoading(true);
      setError(null);
      try {
        const foundArtwork = mockData.find(item => item.id === id && item.type === 'artwork');
        if (foundArtwork) {
          setArtwork({
            id: foundArtwork.id,
            title: foundArtwork.title,
            artistName: foundArtwork.artistName,
            artistId: foundArtwork.artistId,
            description: foundArtwork.description,
            price: foundArtwork.price,
            image: foundArtwork.image,
            category: foundArtwork.category,
            medium: foundArtwork.medium,
            dimensions: foundArtwork.dimensions,
            year: foundArtwork.year,
            likes: foundArtwork.likes,
            availability: foundArtwork.availability,
          });
        } else {
          setError("Artwork not found.");
        }
      } catch (err) {
        console.error('Failed to fetch artwork details:', err);
        setError("Failed to load artwork. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
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
      if (navigator.share) {
        navigator.share({
          title: artwork.title,
          text: `Check out this amazing artwork by ${artwork.artistName} on Artify!`,
          url: window.location.href,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        alert(`Share this link: ${window.location.href}`);
      }
    }
  };

  if (loading) {
    return <div className="artwork-message">Loading artwork details...</div>;
  }

  if (error) {
    return (
      <div className="artwork-error-container">
        <p className="artwork-error-message">{error}</p>
        <button onClick={() => navigate('/shop')} className="artwork-back-button">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="artwork-error-container">
        <p className="artwork-message">No artwork data available.</p>
        <button onClick={() => navigate('/shop')} className="artwork-back-button">
          Back to Shop
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(artwork.id);
  const isInCartAlready = isInCart(artwork.id);

  return (
    <div className="artwork-container">
      <div className="artwork-detail-card">
        {/* Left Section: Image */}
        <div className="artwork-image-container">
          <img
            src={artwork.image || 'https://via.placeholder.com/600/EEEEEE?text=No+Image'}
            alt={artwork.title}
            className="artwork-image"
          />
        </div>

        {/* Right Section: Details */}
        <div className="artwork-info-container">
          <h1 className="artwork-title">{artwork.title}</h1>
          <p className="artwork-artist">
            By <Link to={`/profile/${artwork.artistId}`} className="artwork-artist-link">{artwork.artistName}</Link>
          </p>
          <p className="artwork-price">Rs.{artwork.price ? artwork.price.toFixed(2) : 'N/A'}</p>

          <div className="artwork-actions">
            <button
              onClick={handleAddToCart}
              disabled={artwork.availability !== 'for sale'}
              className={`artwork-button ${artwork.availability !== 'for sale' ? 'not-for-sale' : ''} ${isInCartAlready ? 'added-to-cart' : ''}`}
            >
              <ShoppingCart size={18} />
              {artwork.availability === 'for sale' ? (isInCartAlready ? 'Added to Cart' : 'Add to Cart') : 'Not For Sale'}
            </button>
            <button
              onClick={handleLike}
              className={`artwork-icon-button ${isLiked ? 'liked' : ''}`}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={18} fill={isLiked ? '#dc3545' : 'none'} />
            </button>
            <button onClick={handleShare} className="artwork-icon-button" title="Share">
              <Share2 size={18} />
            </button>
          </div>

          <div className="artwork-details-section">
            <h3 className="artwork-section-title">Description</h3>
            <p className="artwork-description">{artwork.description}</p>
          </div>

          <div className="artwork-details-section">
            <h3 className="artwork-section-title">Details</h3>
            <p className="artwork-detail-item">Category: {artwork.category}</p>
            <p className="artwork-detail-item">Medium: {artwork.medium}</p>
            <p className="artwork-detail-item">Dimensions: {artwork.dimensions}</p>
            <p className="artwork-detail-item">Year: {artwork.year}</p>
            <p className="artwork-detail-item">Likes: {artwork.likes}</p>
            <p className="artwork-detail-item">Availability: {artwork.availability}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;