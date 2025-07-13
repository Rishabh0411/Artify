// frontend/src/App.jsx (Example structure)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Shop from './components/pages/Shop';
import Cart from './components/cart/Cart';
import Wishlist from './components/wishlist/Wishlist';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import Profile from './components/user/Profile';
import ProductDetailPage from './components/shop/ProductDetailPage'; // Import the new component
import { CartProvider } from './components/cart/CartContext';
import { WishlistProvider } from './components/wishlist/WishlistContext';
import { AuthProvider } from './components/auth/AuthContext';


function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              {/* <Route path="/login" element={<Login />} /> */}
              {/* <Route path="/register" element={<Register />} /> */}
              {/* <Route path="/profile/:id" element={<Profile />} /> */}
              <Route path="/artwork/:id" element={<ProductDetailPage />} /> {/* New route */}
            </Routes>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;