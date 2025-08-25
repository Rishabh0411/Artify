import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import { CartProvider } from './components/cart/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './components/pages/Home';
import Shop from './components/pages/Shop';
import AuthPage from './components/auth/AuthPage';
import ArtworkDetail from './components/artwork/ArtworkDetail';
import ArtistDashboard from './components/artist/ArtistDashboard';
import Checkout from './components/cart/Checkout';
import Cart from './components/cart/Cart';
import Wishlist from './components/wishlist/Wishlist';
import Profile from './components/profile/Profile';
import Search from './components/search/Search';
import OrderHistory from './components/orders/OrderHistory';
import OrderDetail from './components/orders/OrderDetail';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/artwork/:id" element={<ArtworkDetail />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/register" element={<AuthPage />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/wishlist" 
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders/:id" 
                    element={
                      <ProtectedRoute>
                        <OrderDetail />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Artist Routes */}
                  <Route 
                    path="/artist/dashboard" 
                    element={
                      <ProtectedRoute requiredUserType="artist">
                        <ArtistDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;