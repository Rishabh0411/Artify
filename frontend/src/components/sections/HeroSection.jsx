import React from 'react';
import hi from "../../assets/hi.jpg";

const HeroSection = () => {
  return (
    <div style={{ width: '100%' }}>
      <div 
        style={{
          backgroundImage: `url(${hi})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          minHeight: '480px',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Optional dark overlay for better text readability */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
        />
        
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '40px',
            fontWeight: '900',
            lineHeight: '1.2',
            letterSpacing: '-0.033em',
            margin: 0
          }}>
            Discover Art
          </h1>
          <h2 style={{
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'normal',
            lineHeight: '1.5',
            margin: 0
          }}>
            Explore artworks from emerging and established artists.
          </h2>
        </div>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '24px',
            position: 'relative',
            zIndex: 10
          }}
        >
          <button
            style={{
              border: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0c151d',
              width: '120px',
              height: '40px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          >
            Browse Artwork
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;