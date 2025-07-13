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
      // Category Filter
      const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Price Range Filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Search Query Filter (Checks title and artist name)
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

  return (
    <div style={{ backgroundColor: '#f8fefa', minHeight: '100vh' }}>
      <ShopHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalProducts={filteredProducts.length}
      />
      
      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', gap: '24px', padding: '24px' }}>
        {/* Filter Sidebar (only visible on larger screens) */}
        <div style={{
          display: 'block', // Default to block
          '@media (max-width: 768px)': { // Hide on small screens
            display: 'none'
          }
        }}>
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
        
        {/* Product Grid */}
        <ProductGrid products={sortedProducts} />
      </div>
    </div>
  );
};

export default Shop;