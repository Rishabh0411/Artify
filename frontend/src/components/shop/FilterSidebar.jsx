// frontend/src/components/shop/FilterSidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react'; // Added Menu and X icons

const FilterSidebar = ({ selectedCategory, setSelectedCategory, priceRange, setPriceRange }) => {
  // State for managing hamburger menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for managing collapse/expand of each section
  const [isCategoriesCollapsed, setIsCategoriesCollapsed] = useState(false);
  const [isPriceCollapsed, setIsPriceCollapsed] = useState(false);
  const [isMediumCollapsed, setIsMediumCollapsed] = useState(false);
  const [isAvailabilityCollapsed, setIsAvailabilityCollapsed] = useState(false);

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
    { id: 'digital', name: 'Digital', count: 24 }
  ];

  const priceRanges = [
    { min: 0, max: 100, label: 'Under Rs.100' },
    { min: 100, max: 300, label: 'Rs.100 - Rs.300' },
    { min: 300, max: 500, label: 'Rs.300 - Rs.500' },
    { min: 500, max: Infinity, label: 'Rs.500 & Up' }
  ];

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const styles = {
    hamburgerContainer: {
      position: 'relative',
      display: 'inline-block',
    },
    hamburgerButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#4574a1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
    },
    hamburgerButtonHover: {
      backgroundColor: '#3a5d84',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      display: isMenuOpen ? 'block' : 'none',
    },
    filtersContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '320px',
      backgroundColor: 'white',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease',
      zIndex: 1000,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderBottom: '1px solid #e6edf4',
      backgroundColor: '#f8fafc',
    },
    filterTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#0c151d',
      margin: 0,
    },
    closeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'background-color 0.2s ease',
    },
    closeButtonHover: {
      backgroundColor: '#f3f4f6',
    },
    filterContent: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    filterSection: {
      borderBottom: '1px solid #e6edf4',
      paddingBottom: '15px',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      marginBottom: '10px',
      paddingBottom: '5px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#0c151d',
      margin: 0
    },
    priceInputs: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    priceInput: {
      width: 'calc(50% - 15px)',
      padding: '8px 10px',
      border: '1px solid #e6edf4',
      borderRadius: '6px',
      fontSize: '14px',
    },
    checkboxGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#0c151d',
      cursor: 'pointer',
    },
    checkboxInput: {
      marginRight: '8px',
    },
  };

  return (
    <div style={styles.hamburgerContainer}>
      {/* Hamburger Button */}
      <button
        style={styles.hamburgerButton}
        onClick={toggleMenu}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#3a5d84'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#4574a1'}
      >
        <Menu size={20} />
        Filters
      </button>

      {/* Overlay */}
      <div style={styles.overlay} onClick={toggleMenu} />

      {/* Slide-out Menu */}
      <div style={styles.filtersContainer}>
        {/* Header with close button */}
        <div style={styles.filterHeader}>
          <h3 style={styles.filterTitle}>Filters</h3>
          <button
            style={styles.closeButton}
            onClick={toggleMenu}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div style={styles.filterContent}>
          {/* Categories */}
          <div style={styles.filterSection}>
            <div style={styles.sectionHeader} onClick={() => setIsCategoriesCollapsed(!isCategoriesCollapsed)}>
              <h4 style={styles.sectionTitle}>Categories</h4>
              {isCategoriesCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
            {!isCategoriesCollapsed && (
              <div style={styles.checkboxGroup}>
                {categories.map(category => (
                  <label key={category.id} style={styles.checkboxLabel}>
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#4574a1'
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#0c151d', flex: 1 }}>
                      {category.name}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div style={styles.filterSection}>
            <div style={styles.sectionHeader} onClick={() => setIsPriceCollapsed(!isPriceCollapsed)}>
              <h4 style={styles.sectionTitle}>Price Range</h4>
              {isPriceCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
            {!isPriceCollapsed && (
              <div style={styles.checkboxGroup}>
                {priceRanges.map((range, index) => (
                  <label key={index} style={styles.checkboxLabel}>
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange[0] === range.min && priceRange[1] === range.max}
                      onChange={() => handlePriceRangeChange(range.min, range.max)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#4574a1'
                      }}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
                <div style={styles.priceInputs}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] === 0 ? '' : priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    style={styles.priceInput}
                  />
                  <span style={{ color: '#6b7280' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] === Infinity ? '' : priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || Infinity])}
                    style={styles.priceInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Mediums */}
          <div style={styles.filterSection}>
            <div style={styles.sectionHeader} onClick={() => setIsMediumCollapsed(!isMediumCollapsed)}>
              <h4 style={styles.sectionTitle}>Medium</h4>
              {isMediumCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
            {!isMediumCollapsed && (
              <div style={styles.checkboxGroup}>
                {mediums.map(medium => (
                  <label key={medium.id} style={styles.checkboxLabel}>
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
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {medium.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '16px' }}
                 onClick={() => setIsAvailabilityCollapsed(!isAvailabilityCollapsed)}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0c151d',
                margin: 0
              }}>
                Availability
              </h4>
              {isAvailabilityCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
            {!isAvailabilityCollapsed && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;