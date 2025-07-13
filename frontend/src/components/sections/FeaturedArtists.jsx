// frontend/src/components/sections/FeaturedArtists.jsx
import hilu from "../../assets/hilu.jpg"; // Adjusted path
import { Link } from 'react-router-dom'; 

const FeaturedArtists = () => {
  const artists = [
    { name: "Rishabh", specialty: "Coder", image: hilu, id: 'artist-rishabh' },
    { name: "Lena Petrova", specialty: "Abstract Painting", image: null, id: 'artist-1' },
    { name: "Aiden Chen", specialty: "Digital Art", image: null, id: 'artist-2' },
    { name: "Maya Singh", specialty: "Sculpture", image: null, id: 'artist-3' },
    { name: "Sophia Lee", specialty: "Photography", image: null, id: 'artist-4' },
    { name: "John Doe", specialty: "Illustrator", image: null, id: 'artist-john' },
    { name: "Jane Smith", specialty: "Ceramics", image: null, id: 'artist-jane' },
  ];

  const ArtistCard = ({ name, specialty, bgcolor = '#e6edf4', image, id }) => (
    <Link to={`/profile/${id}`} style={{ textDecoration: 'none' }}> 
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '128px',
        flexShrink: 0,
        cursor: 'pointer' 
      }}>
        {image ? (
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            marginBottom: '12px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />
        ) : (
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            marginBottom: '12px',
            backgroundColor: bgcolor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '48px',
            fontWeight: 'bold'
          }}>
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p style={{
            color: '#0c151d',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '4px',
            margin: 0
          }}>{name}</p>
          <p style={{
            color: '#4574a1',
            fontSize: '14px',
            fontWeight: '400',
            margin: 0
          }}>{specialty}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      <h2 style={{
        color: '#0c151d',
        fontSize: '22px',
        fontWeight: 'bold',
        padding: '20px 16px 12px 16px',
        margin: 0,
        maxWidth: '1200px',
        margin: '20px auto 12px auto',
        paddingLeft: '24px' // Consistent padding
      }}>
        Featured Artists
      </h2>
      <div style={{ padding: '0 16px 16px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '32px',
          overflowX: 'auto',
          padding: '16px 8px', // Add some horizontal padding for scrollbar
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none',  /* IE and Edge */
        }}>
          {/* Hide scrollbar for webkit browsers */}
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {artists.map((artist, index) => (
            <ArtistCard 
              key={artist.id || index} 
              name={artist.name} 
              specialty={artist.specialty} 
              image={artist.image}
              id={artist.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtists;