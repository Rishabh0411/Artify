// frontend/src/components/layout/Footer.jsx
import { Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ display: 'flex', justifyContent: 'center', backgroundColor: "transparent", padding: '60px 20px' }}>
      <div style={{ display: 'flex', maxWidth: '960px', flex: 1, flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'center' }}>
          {/* Navigation Links */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '60px'
          }}>
            <a style={{ 
              color: '#4a90e2', 
              fontSize: '16px', 
              fontWeight: 'normal', 
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} href="#">About</a>
            <a style={{ 
              color: '#4a90e2', 
              fontSize: '16px', 
              fontWeight: 'normal', 
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} href="#">Contact</a>
            <a style={{ 
              color: '#4a90e2', 
              fontSize: '16px', 
              fontWeight: 'normal', 
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} href="#">FAQ</a>
            <a style={{ 
              color: '#4a90e2', 
              fontSize: '16px', 
              fontWeight: 'normal', 
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} href="#">Terms of Service</a>
            <a style={{ 
              color: '#4a90e2', 
              fontSize: '16px', 
              fontWeight: 'normal', 
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }} href="#">Privacy Policy</a>
          </div>
          
          {/* Social Media Icons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px' 
          }}>
            <a href="#" style={{ color: '#4a90e2' }}>
              <Twitter size={24} />
            </a>
            <a href="#" style={{ color: '#4a90e2' }}>
              <Instagram size={24} />
            </a>
            <a href="#" style={{ color: '#4a90e2' }}>
              <Facebook size={24} />
            </a>
          </div>
          
          {/* Copyright */}
          <p style={{ 
            color: '#4a90e2', 
            fontSize: '16px', 
            fontWeight: 'normal', 
            margin: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            &copy; 2023 Art??. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;