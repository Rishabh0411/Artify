import React from 'react';
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      backgroundColor: '#ffffff',
      padding: '60px 20px',
      borderTop: '1px solid #e6edf4',
      marginTop: 'auto' 
    }}>
      <div style={{ 
        display: 'flex', 
        maxWidth: '960px', 
        flex: 1, 
        flexDirection: 'column',
        alignItems: 'center', 
        gap: '40px' 
      }}>
        {/* Navigation Links */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '30px 60px'
        }}>
          <a style={{ 
            color: '#4574a1', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#0c151d' }
          }} href="#">About</a>
          <a style={{ 
            color: '#4574a1', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#0c151d' }
          }} href="#">Contact</a>
          <a style={{ 
            color: '#4574a1', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#0c151d' }
          }} href="#">FAQ</a>
          <a style={{ 
            color: '#4574a1', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#0c151d' }
          }} href="#">Terms of Service</a>
          <a style={{ 
            color: '#4574a1', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'color 0.2s ease',
            '&:hover': { color: '#0c151d' }
          }} href="#">Privacy Policy</a>
        </div>
        
        {/* Social Media Icons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '24px' 
        }}>
          <a href="#" style={{ color: '#4574a1', transition: 'color 0.2s ease', '&:hover': { color: '#0c151d' } }}>
            <Twitter size={24} />
          </a>
          <a href="#" style={{ color: '#4574a1', transition: 'color 0.2s ease', '&:hover': { color: '#0c151d' } }}>
            <Instagram size={24} />
          </a>
          <a href="#" style={{ color: '#4574a1', transition: 'color 0.2s ease', '&:hover': { color: '#0c151d' } }}>
            <Facebook size={24} />
          </a>
        </div>
        
        {/* Copyright */}
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          fontWeight: 'normal', 
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} ArtVista. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;