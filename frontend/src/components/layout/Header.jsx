// frontend/src/components/layout/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import PP from "../../assets/PP.jpeg"; // Adjusted path

const Header = () => {
  const location = useLocation();
  const { getWishlistCount } = useWishlist();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const wishlistCount = getWishlistCount();
  const cartCount = getCartCount();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    // Optionally redirect to home or login page after logout
    // navigate('/'); 
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 40px',
      borderBottom: '1px solid #e6edf4',
      backgroundColor: '#f8fefa',
      minHeight: '60px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ 
            color: '#0c151d', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            Art??
          </h2>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: isActive('/') ? '#4574a1' : '#6b7280', 
              fontWeight: isActive('/') ? '600' : '500',
              transition: 'color 0.2s ease'
            }}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            style={{ 
              textDecoration: 'none', 
              color: isActive('/shop') ? '#4574a1' : '#6b7280', 
              fontWeight: isActive('/shop') ? '600' : '500',
              transition: 'color 0.2s ease'
            }}
          >
            Shop
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/feed" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/feed') ? '#4574a1' : '#6b7280', 
                  fontWeight: isActive('/feed') ? '600' : '500',
                  transition: 'color 0.2s ease'
                }}
              >
                Feed
              </Link>
              {user?.isArtist && (
                 <Link 
                  to="/create" 
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive('/create') ? '#4574a1' : '#6b7280', 
                    fontWeight: isActive('/create') ? '600' : '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Create
                </Link>
              )}
              <Link 
                to="/community" 
                style={{ 
                  textDecoration: 'none', 
                  color: isActive('/community') ? '#4574a1' : '#6b7280', 
                  fontWeight: isActive('/community') ? '600' : '500',
                  transition: 'color 0.2s ease'
                }}
              >
                Community
              </Link>
            </>
          )}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/search" style={{ textDecoration: 'none', color: 'inherit' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease'
          }}
          title="Search"
          >
            <Search size={20} />
          </button>
        </Link>
        
        <Link to="/wishlist" style={{ textDecoration: 'none', position: 'relative' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease'
          }}
          title="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: '600',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>
        </Link>
        
        <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease'
          }}
          title="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#007bff',
                color: '#ffffff',
                borderRadius: '50%',
                fontSize: '10px',
                fontWeight: '600',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user?.id || 'me'}`} style={{ textDecoration: 'none' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundImage: `url(${PP})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
                cursor: 'pointer'
              }}>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              style={{
                border: 'none',
                backgroundColor: '#e6edf4',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc3545',
                width: '40px',
                height: '40px',
                transition: 'all 0.2s ease'
              }}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              border: 'none',
              backgroundColor: '#4574a1',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;