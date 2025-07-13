// frontend/src/components/shop/ShopHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Grid, List, ChevronDown, X } from 'lucide-react';

const ShopHeader = ({ 
  sortBy, 
  setSortBy, 
  totalProducts, 
  toggleSidebar, 
  isSidebarOpen,
  viewMode = 'grid',
  setViewMode,
  searchQuery = '',
  setSearchQuery,
  onSearch,
  isLoading = false,
  filters = {},
  onClearFilters
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Update local search when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchQuery !== searchQuery && onSearch) {
        onSearch(localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, searchQuery, onSearch]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchQuery);
    }
  };

  // Handle search clear
  const handleSearchClear = () => {
    setLocalSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
    searchInputRef.current?.focus();
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    if (setViewMode) {
      setViewMode(mode);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get active filters count
  const getActiveFiltersCount = () => {
    if (!filters) return 0;
    return Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === sortBy)?.label || 'Sort By';
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e6edf4',
      padding: '16px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '16px'
      }}>
        
        {/* Left Section: Search Bar */}
        <div style={{ flex: '1', maxWidth: '400px' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              border: `2px solid ${isSearchFocused ? '#4574a1' : '#e6edf4'}`,
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              transition: 'border-color 0.2s ease'
            }}>
              <Search 
                size={18} 
                style={{ 
                  marginLeft: '12px', 
                  color: isSearchFocused ? '#4574a1' : '#6b7280' 
                }} 
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search artworks..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: 'transparent'
                }}
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={handleSearchClear}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    marginRight: '8px',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section: Results Count and Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexShrink: 0
        }}>
          
          {/* Results Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {isLoading ? 'Loading...' : `${totalProducts} artworks`}
            </span>
            {activeFiltersCount > 0 && (
              <span style={{
                backgroundColor: '#4574a1',
                color: '#ffffff',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && onClearFilters && (
            <button
              onClick={onClearFilters}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#4574a1',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear all
            </button>
          )}

          {/* Filter Toggle Button */}
          <button
            onClick={toggleSidebar}
            style={{
              border: '1px solid #e6edf4',
              backgroundColor: isSidebarOpen ? '#4574a1' : '#ffffff',
              color: isSidebarOpen ? '#ffffff' : '#4574a1',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            title={isSidebarOpen ? "Hide Filters" : "Show Filters"}
          >
            <Filter size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: '10px',
                fontWeight: 'bold',
                minWidth: '16px',
                textAlign: 'center'
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }} ref={sortDropdownRef}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e6edf4',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                minWidth: '140px',
                justifyContent: 'space-between'
              }}
            >
              <span>{getCurrentSortLabel()}</span>
              <ChevronDown 
                size={16} 
                style={{ 
                  transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>
            
            {showSortDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #e6edf4',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minWidth: '180px',
                zIndex: 20,
                marginTop: '4px'
              }}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: sortBy === option.value ? '#f8fafc' : '#ffffff',
                      color: sortBy === option.value ? '#4574a1' : '#374151',
                      fontSize: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: sortBy === option.value ? '600' : '400',
                      borderBottom: '1px solid #f1f5f9'
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.backgroundColor = '#f8fafc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          {setViewMode && (
            <div style={{
              display: 'flex',
              border: '1px solid #e6edf4',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => handleViewModeChange('grid')}
                style={{
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? '#4574a1' : '#ffffff',
                  color: viewMode === 'grid' ? '#ffffff' : '#4574a1',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => handleViewModeChange('list')}
                style={{
                  border: 'none',
                  backgroundColor: viewMode === 'list' ? '#4574a1' : '#ffffff',
                  color: viewMode === 'list' ? '#ffffff' : '#4574a1',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;