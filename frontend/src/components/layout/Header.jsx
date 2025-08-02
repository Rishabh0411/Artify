import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useWishlist } from '../wishlist/WishlistContext';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import PP from '../../assets/PP.jpeg'; 

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

  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 40px',
      borderBottom: '1px solid #e6edf4',
      backgroundColor: '#f8fefa',
      minHeight: '60px',
      zIndex: 20, 
      position: 'sticky',
      top: 0
    }}>
      {/* Left section: Logo and Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#0c151d', 
            margin: 0,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Artify
          </h2>
        </Link>
        <nav>
          <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <Link 
                to="/shop" 
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: isActive('/shop') ? '#4574a1' : '#6b7280',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#4574a1' }
                }}
              >
                Shop
              </Link>
            </li>
            {/* Add more navigation links as needed */}
            {/* <li>
              <Link 
                to="/artists" 
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: isActive('/artists') ? '#4574a1' : '#6b7280',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#4574a1' }
                }}
              >
                Artists
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Right section: Search, Wishlist, Cart, Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Search Icon */}
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive('/search') ? '#4574a1' : '#6b7280',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease'
          }}
          title="Search"
          >
            <Search size={20} />
          </button>
        </Link>

        {/* Wishlist Icon */}
        <Link to="/wishlist" style={{ textDecoration: 'none', position: 'relative' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive('/wishlist') ? '#dc3545' : '#6b7280',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s ease'
          }}
          title="Wishlist"
          >
            <Heart size={20} fill={isActive('/wishlist') ? '#dc3545' : 'none'} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </button>
        </Link>

        {/* Cart Icon */}
        <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
          <button style={{
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive('/cart') ? '#4574a1' : '#6b7280',
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
                backgroundColor: '#4574a1',
                color: '#ffffff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* Auth/Profile Section */}
        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundImage: `url(${PP})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: isActive(`/profile/${user.id}`) ? '2px solid #4574a1' : '2px solid transparent',
                  transition: 'border-color 0.2s ease'
                }}
                title={user.username || "My Profile"}
              >
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