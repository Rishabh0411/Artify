// frontend/src/components/shop/FilterSidebar.jsx
import React from 'react';

const FilterSidebar = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange }) => {
  const categories = [
    { id: 'all', name: 'All Categories', count: 156 },
    { id: 'painting', name: 'Paintings', count: 87 },
    { id: 'sculpture', name: 'Sculptures', count: 32 },
    { id: 'digital', name: 'Digital Art', count: 24 },
    { id: 'photography', name: 'Photography', count: 13 },
    { id: 'drawing', name: 'Drawings', count: 10 },
    { id: 'textile', name: 'Textile Art', count: 7 },
    { id: 'mixed', name: 'Mixed Media', count: 5 }
  ];

  const mediums = [
    { id: 'oil', name: 'Oil', count: 45 },
    { id: 'acrylic', name: 'Acrylic', count: 38 },
    { id: 'watercolor', name: 'Watercolor', count: 27 },
    { id: 'mixed', name: 'Mixed Media', count: 19 },
    { id: 'digital', name: 'Digital', count: 24 },
    { id: 'charcoal', name: 'Charcoal', count: 8 },
    { id: 'bronze', name: 'Bronze', count: 12 },
    { id: 'wood', name: 'Wood', count: 6 }
  ];

  const priceRanges = [
    { min: 0, max: 100, label: 'Under Rs.100' },
    { min: 100, max: 300, label: 'Rs.100 - Rs.300' },
    { min: 300, max: 500, label: 'Rs.300 - Rs.500' },
    { min: 500, max: 1000, label: 'Rs.500 - Rs.1000' },
    { min: 1000, max: Infinity, label: 'Rs.1000+' }
  ];

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  return (
    <div style={{
      width: '280px',
      flexShrink: 0,
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      height: 'fit-content', // Ensures it only takes necessary height
      position: 'sticky',
      top: 'calc(60px + 24px)', // Adjust based on header height + padding
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0c151d',
        marginBottom: '24px',
        margin: 0
      }}>
        Filters
      </h3>

      {/* Categories */}
      <div style={{ borderBottom: '1px solid #e6edf4', paddingBottom: '20px', marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0c151d',
          margin: '0 0 16px 0'
        }}>
          Categories
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: selectedCategory === category.id ? '#4574a1' : '#0c151d',
                fontWeight: selectedCategory === category.id ? '600' : 'normal',
                fontSize: '14px',
                transition: 'color 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <span>{category.name}</span>
              <span style={{ color: '#6b7280', fontWeight: 'normal', fontSize: '12px' }}>({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ borderBottom: '1px solid #e6edf4', paddingBottom: '20px', marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0c151d',
          margin: '0 0 16px 0'
        }}>
          Price Range
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {priceRanges.map((range, index) => (
            <label
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <input
                type="radio"
                name="priceRange"
                checked={priceRange[0] === range.min && priceRange[1] === range.max}
                onChange={() => handlePriceChange(range.min, range.max)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#4574a1'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: '#0c151d'
              }}>
                {range.label}
              </span>
            </label>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0] === 0 ? '' : priceRange[0]}
              onChange={(e) => handlePriceChange(e.target.value === '' ? 0 : Number(e.target.value), priceRange[1])}
              style={{
                width: 'calc(50% - 4px)',
                padding: '8px 10px',
                border: '1px solid #e6edf4',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1] === Infinity ? '' : priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], e.target.value === '' ? Infinity : Number(e.target.value))}
              style={{
                width: 'calc(50% - 4px)',
                padding: '8px 10px',
                border: '1px solid #e6edf4',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Medium */}
      <div style={{ borderBottom: '1px solid #e6edf4', paddingBottom: '20px', marginBottom: '20px' }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0c151d',
          margin: '0 0 16px 0'
        }}>
          Medium
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mediums.map(medium => (
            <label
              key={medium.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#4574a1'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: '#0c151d',
                flex: 1
              }}>
                {medium.name}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#6b7280', // Changed to #6b7280 for count consistency
                fontWeight: '500'
              }}>
                {medium.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0c151d',
          margin: '0 0 16px 0'
        }}>
          Availability
        </h4>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '4px 0'
        }}>
          <input
            type="checkbox"
            style={{
              width: '16px',
              height: '16px',
              accentColor: '#4574a1'
            }}
          />
          <span style={{
            fontSize: '14px',
            color: '#0c151d'
          }}>
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;