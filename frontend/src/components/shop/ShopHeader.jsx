// frontend/src/components/shop/ShopHeader.jsx
import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

const ShopHeader = ({ searchQuery, setSearchQuery, sortBy, setSortBy, totalProducts }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e6edf4',
      padding: '24px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#0c151d',
            margin: '0 0 8px 0'
          }}>
            Shop Artworks
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#4574a1',
            margin: 0
          }}>
            Discover unique pieces from talented artists around the world
          </p>
        </div>

        {/* Search and Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e6edf4',
            borderRadius: '8px',
            height: '48px',
            flexGrow: 1,
            maxWidth: '400px'
          }}>
            <Search size={20} style={{ color: '#6b7280', marginLeft: '12px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                flexGrow: 1,
                padding: '0 12px',
                fontSize: '16px',
                color: '#0c151d'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Total Products Count */}
            <span style={{ fontSize: '15px', color: '#6b7280', whiteSpace: 'nowrap' }}>
              Showing {totalProducts} results
            </span>

            {/* Sort By Dropdown */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #e6edf4',
              borderRadius: '8px',
              padding: '6px 12px',
              backgroundColor: '#ffffff'
            }}>
              <Filter size={18} style={{ color: '#6b7280' }} />
              <label htmlFor="sortBy" style={{ fontSize: '14px', color: '#0c151d', fontWeight: '500', margin: 0 }}>Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: 'none',
                  fontSize: '14px',
                  color: '#0c151d',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Toggle */}
            {/* You can add state to toggle grid/list view here */}
            <div style={{
              display: 'flex',
              border: '1px solid #e6edf4',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <button style={{
                border: 'none',
                backgroundColor: '#4574a1',
                color: '#ffffff',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button style={{
                border: 'none',
                backgroundColor: '#ffffff',
                color: '#4574a1',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="List View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;