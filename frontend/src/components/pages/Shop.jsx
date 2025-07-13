// frontend/src/components/pages/Shop.jsx
import React, { useState, useEffect, useMemo } from 'react';
import ShopHeader from '../shop/ShopHeader'; // Adjusted path
import ProductGrid from '../shop/ProductGrid'; // Adjusted path
import FilterSidebar from '../shop/FilterSidebar'; // Adjusted path
import { mockData } from '../../data/mockSearchData'; // Import your mock data

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, Infinity]); // Initial range: 0 to Infinity
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar visibility

  // Filter mockData to get only artworks and map to ProductCard format
  const allShopProducts = useMemo(() => {
    return mockData
      .filter(item => item.type === 'artwork')
      .map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artistName, // Map artistName to artist
        price: artwork.price,
        image: artwork.image,
        category: artwork.category, // Use new category field
        medium: artwork.medium,
        dimensions: artwork.dimensions, // Use new dimensions field
        year: artwork.year, // Use new year field
        likes: artwork.likes, // Use new likes field
        inStock: artwork.availability === 'for sale', // Map availability to inStock
      }));
  }, []); // Only re-run if mockData changes (which it won't unless updated)

  // Filter products based on selected criteria
  const filteredProducts = useMemo(() => {
    return allShopProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [allShopProducts, selectedCategory, priceRange, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.likes - a.likes;
        case 'newest':
        default:
          return b.year - a.year; // Assuming 'year' property exists for sorting by newest
      }
    });
  }, [filteredProducts, sortBy]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div style={{ backgroundColor: '#f8fefa', minHeight: '100vh' }}>
      {/* ShopHeader */}
      <ShopHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalProducts={filteredProducts.length}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div style={{ 
        display: 'flex', 
        // Removed maxWidth and margin: 'auto' to allow full width
        margin: '24px 0', // Top/bottom margin, no auto horizontal margin
        gap: '24px', 
        padding: '0 40px', // Add padding to the sides to prevent content from touching edges
        alignItems: 'flex-start' // Align items to the top
      }}>
        {/* Filter Sidebar */}
        {isSidebarOpen && ( 
          <div style={{
            flexShrink: 0, 
            width: '280px', // Fixed width for sidebar
            '@media (max-width: 1024px)': { 
              width: '220px',
            },
            '@media (max-width: 768px)': {
              display: 'none', // Hide on smaller screens
            },
            backgroundColor: '#ffffff', // White background for the sidebar itself
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', // Subtle shadow for elevation
            padding: '20px', // Internal padding for sidebar content
          }}>
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>
        )}
        
        {/* Product Grid Container */}
        <div style={{ 
          flexGrow: 1, 
        }}> 
          <ProductGrid products={sortedProducts} />
        </div>
      </div>
    </div>
  );
};

export default Shop;