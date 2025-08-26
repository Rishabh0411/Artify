import hiiii from "../../assets/hiiii.jpg";
import { useNavigate } from 'react-router-dom';

const FeaturedArtworks = () => {
  const navigate = useNavigate();

  const ArtworkCard = ({ title, artist, bgColor, image, size = "normal", id, artistId }) => {
    const handleCardClick = (e) => {
      // Check if the click is on the artist name
      if (e.target.closest('.artist-name')) {
        return; // Don't navigate to artwork if clicking on artist
      }
      navigate(`/artwork/${id}`);
    };

    const handleArtistClick = (e) => {
      e.stopPropagation(); // Prevent card click
      navigate(`/profile/${artistId}`);
    };

    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          minWidth: size === "large" ? '200px' : '160px',
          paddingBottom: '12px',
          cursor: 'pointer'
        }}
        onClick={handleCardClick}
      >
        <div style={{
          width: '100%',
          backgroundColor: bgColor,
          backgroundImage: image ? `url(${image})` : 'none',
          aspectRatio: '1',
          borderRadius: '8px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          transition: 'transform 0.2s ease'
        }}></div>
        <div>
          <p style={{
            color: '#0c151d',
            fontSize: '16px',
            fontWeight: '500',
            lineHeight: '1.4',
            margin: '0 0 4px 0'
          }}>{title}</p>
          <button
            className="artist-name"
            onClick={handleArtistClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#4574a1',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '1.4',
              margin: '0',
              cursor: 'pointer',
              padding: '0',
              textAlign: 'left',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            {artist}
          </button>
        </div>
      </div>
    );
  };

  const artworks = [
    { id: 'artwork-1', title: "Crimson Tide", artist: "Lena Petrova", image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop', artistId: 'artist-1' },
    { id: 'artwork-2', title: "Cyber Dreams", artist: "Aiden Chen", image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop', artistId: 'artist-2' },
    { id: 'artwork-3', title: "Whispering Stone", artist: "Maya Singh", image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300&h=300&fit=crop', artistId: 'artist-3' },
    { id: 'artwork-4', title: "Urban Echoes", artist: "Marcus Jones", image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop', artistId: 'artist-marcus' },
    { id: 'artwork-5', title: "Silent Observer", artist: "Sophia Lee", image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300&h=300&fit=crop', artistId: 'artist-4' },
    { id: 'artwork-6', title: "The Great Beyond", artist: "Elias Vance", image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', artistId: 'artist-elias' },
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
        maxWidth: '1200px',
        margin: '20px auto 12px auto',
        paddingLeft: '24px'
      }}>
        Featured Artworks
      </h2>
      
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none', 
      }}>
        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
          
          .artwork-card:hover .artwork-image {
            transform: scale(1.05);
          }
          
          .artwork-card:hover {
            transform: translateY(-2px);
          }
        `}</style>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '16px 24px', 
          gap: '32px',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {artworks.map((artwork, index) => (
            <div key={artwork.id || index} className="artwork-card">
              <ArtworkCard 
                id={artwork.id}
                title={artwork.title} 
                artist={artwork.artist} 
                image={artwork.image} 
                size="normal" 
                artistId={artwork.artistId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtworks;