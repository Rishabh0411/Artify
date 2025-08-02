import React, { useState, useEffect, useMemo } from 'react';
import ShopHeader from '../shop/ShopHeader'; 
import ProductGrid from '../shop/ProductGrid'; 
import FilterSidebar from '../shop/FilterSidebar'; 
import { mockData } from '../../data/mockSearchData'; 

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, Infinity]); 
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const allShopProducts = useMemo(() => {
    return mockData
      .filter(item => item.type === 'artwork')
      .map(artwork => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artistName,
        price: artwork.price,
        image: artwork.image,
        category: artwork.category, 
        medium: artwork.medium,
        dimensions: artwork.dimensions, 
        year: artwork.year, 
        likes: artwork.likes, 
        inStock: artwork.availability === 'for sale',
      }));
  }, []);

  const filteredProducts = useMemo(() => {
    return allShopProducts.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [allShopProducts, selectedCategory, priceRange, searchQuery]);

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
          return b.year - a.year; 
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
        margin: '24px 0', 
        gap: '24px', 
        padding: '0 40px',
        alignItems: 'flex-start'
      }}>
        {/* Filter Sidebar */}
        {isSidebarOpen && ( 
          <div style={{
            flexShrink: 0, 
            width: '280px', 
            '@media (max-width: 1024px)': { 
              width: '220px',
            },
            '@media (max-width: 768px)': {
              display: 'none',
            },
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', 
            padding: '20px',
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