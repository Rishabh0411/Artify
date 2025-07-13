// frontend/src/components/cart/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(item => item.id === product.id);
      if (existingItemIndex >= 0) {
        // If item exists, update quantity
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      }
      // If item doesn't exist, add new item
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove item from cart completely
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Clear all cart items
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart count (total unique items)
  const getCartCount = () => {
    return cartItems.length;
  };

  // Get total quantity of all items
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart subtotal (before taxes/shipping)
  const getCartSubtotal = () => {
    return getCartTotal(); // For now, subtotal is same as total
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    isInCart,
    getItemQuantity,
    clearCart,
    getCartCount,
    getTotalQuantity,
    getCartSubtotal,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};