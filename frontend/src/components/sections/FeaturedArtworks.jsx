// frontend/src/components/sections/FeaturedArtworks.jsx
import hiiii from "../../assets/hiiii.jpg"; // Adjusted path
import { Link } from 'react-router-dom';

const FeaturedArtworks = () => {
  const ArtworkCard = ({ title, artist, bgColor, image, size = "normal", id, artistId }) => (
    <Link to={`/artwork/${id}`} style={{ textDecoration: 'none' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        minWidth: size === "large" ? '200px' : '160px',
        paddingBottom: '12px'
      }}>
        <div style={{
          width: '100%',
          backgroundColor: bgColor,
          backgroundImage: image ? `url(${image})` : 'none',
          aspectRatio: '1',
          borderRadius: '8px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}></div>
        <div>
          <p style={{
            color: '#0c151d',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '1.4',
            margin: '0 0 4px 0'
          }}>{title}</p>
          <Link to={`/profile/${artistId}`} style={{ textDecoration: 'none' }}> 
            <p style={{
              color: '#4574a1',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '1.4',
              margin: '0',
              cursor: 'pointer', 
              // Using inline style for hover pseudo-class (less common but works)
              // For more complex hover effects, consider a CSS file or styled-components
              transition: 'text-decoration 0.2s ease',
              ':hover': {
                textDecoration: 'underline'
              }
            }}>{artist}</p>
          </Link>
        </div>
      </div>
    </Link>
  );

  const artworks = [
    { id: 'artwork-1', title: "Crimson Tide", artist: "Lena Petrova", image: hiiii, artistId: 'artist-1' },
    { id: 'artwork-2', title: "Cyber Dreams", artist: "Aiden Chen", image: hiiii, artistId: 'artist-2' },
    { id: 'artwork-3', title: "Whispering Stone", artist: "Maya Singh", image: hiiii, artistId: 'artist-3' },
    { id: 'artwork-4', title: "Urban Echoes", artist: "Marcus Jones", image: hiiii, artistId: 'artist-marcus' },
    { id: 'artwork-5', title: "Silent Observer", artist: "Sophia Lee", image: hiiii, artistId: 'artist-4' },
    { id: 'artwork-6', title: "The Great Beyond", artist: "Elias Vance", image: hiiii, artistId: 'artist-elias' },
    { id: 'artwork-7', title: "Geometric Harmony", artist: "Chloe Davies", image: hiiii, artistId: 'artist-chloe' },
  ];

  return (
    <div>
      <h2 style={{
        color: '#0c151d',
        fontSize: '22px',
        fontWeight: 'bold',
        lineHeight: '1.2',
        letterSpacing: '-0.015em',
        padding: '20px 16px 12px 16px',
        margin: '0',
        maxWidth: '1200px',
        margin: '20px auto 12px auto',
        paddingLeft: '24px' // Consistent padding
      }}>
        Featured Artworks
      </h2>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none',  /* IE and Edge */
      }}>
        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          padding: '16px 24px', // Consistent padding
          gap: '24px',
          minWidth: 'fit-content' // Ensure content doesn't wrap
        }}>
          {artworks.map((artwork, index) => (
            <ArtworkCard 
              key={artwork.id || index} 
              id={artwork.id}
              title={artwork.title} 
              artist={artwork.artist} 
              image={artwork.image} 
              size="normal" // Or "large" for some
              artistId={artwork.artistId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtworks;