// frontend/src/App.jsx (Updated Snippet)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { CartProvider } from './components/cart/CartContext';
import { WishlistProvider } from './components/wishlist/WishlistContext';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './components/pages/Home';
import Shop from './components/pages/Shop';
import Cart from './components/cart/Cart';
import Wishlist from './components/wishlist/Wishlist';
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import Profile from './components/pages/Profile';
// import SearchPage from './components/search/SearchPage';
import ArtworkDetail from './components/artwork/ArtworkDetail'; // Import the new component

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  {/* <Route path="/login" element={<Login />} /> */}
                  {/* <Route path="/register" element={<Register />} /> */}
                  {/* <Route path="/profile/:id" element={<Profile />} /> */}
                  {/* <Route path="/search" element={<SearchPage />} /> */}
                  <Route path="/artwork/:id" element={<ArtworkDetail />} /> {/* New Route */}
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;