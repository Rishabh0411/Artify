import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Package, Palette, Users, SlidersHorizontal, ArrowUp, ArrowDown } from 'lucide-react';
import apiService from '../../services/apiService';
import { useDebounce } from '../hooks/useDebounce'; // <-- Correctly import the hook

const SearchComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ artworks: [], artists: [] });
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'relevance');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults({ artworks: [], artists: [] });
      setLoading(false);
      return;
    }
    
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.searchArtworksAndArtists(debouncedQuery, sortBy, sortOrder);
        setResults({
          artworks: response.artworks || [],
          artists: response.artists || [],
        });
        setSearchParams({ q: debouncedQuery, sort_by: sortBy, sort_order: sortOrder });
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery, sortBy, sortOrder, setSearchParams]);

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const handleArtistClick = (artistUsername) => {
    navigate(`/profile/${artistUsername}`);
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBarContainer}>
        <Search size={20} color="#6b7280" style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search for artworks or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <SlidersHorizontal size={16} />
          <label htmlFor="sortBy" style={styles.filterLabel}>Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.selectInput}
          >
            <option value="relevance">Relevance</option>
            <option value="price">Price</option>
            <option value="views_count">Views</option>
            <option value="likes_count">Likes</option>
          </select>
        </div>
        <button onClick={toggleSortOrder} style={styles.sortOrderButton}>
          {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      {loading && <div style={styles.statusMessage}>Loading results...</div>}
      {error && <div style={styles.statusMessage}><X size={16} color="#ef4444" /> {error}</div>}
      {(!loading && !error && debouncedQuery && results.artworks.length === 0 && results.artists.length === 0) && (
        <div style={styles.statusMessage}>No results found for "{debouncedQuery}".</div>
      )}

      {results.artists.length > 0 && (
        <div style={styles.resultsSection}>
          <h2 style={styles.sectionTitle}>Artists ({results.artists.length})</h2>
          <div style={styles.artistsGrid}>
            {results.artists.map(artist => (
              <div 
                key={artist.id} 
                style={styles.artistCard} 
                onClick={() => handleArtistClick(artist.username)}
              >
                <div style={styles.artistImageContainer}>
                  {artist.profile_picture ? (
                    <img src={artist.profile_picture} alt={artist.first_name} style={styles.artistImage} />
                  ) : (
                    <User size={32} color="#9ca3af" />
                  )}
                </div>
                <div style={styles.artistInfo}>
                  <h4 style={styles.artistName}>{artist.first_name} {artist.last_name}</h4>
                  <p style={styles.artistLocation}>
                    <MapPin size={12} />
                    {artist.location || 'Unknown'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.artworks.length > 0 && (
        <div style={styles.resultsSection}>
          <h2 style={styles.sectionTitle}>Artworks ({results.artworks.length})</h2>
          <div style={styles.artworksGrid}>
            {results.artworks.map(artwork => (
              <div 
                key={artwork.id} 
                style={styles.artworkCard} 
                onClick={() => handleArtworkClick(artwork.id)}
              >
                <div style={styles.artworkImage}>
                  {artwork.main_image ? (
                    <img src={artwork.main_image} alt={artwork.title} style={styles.artworkImg} />
                  ) : (
                    <div style={styles.artworkPlaceholder}>
                      <Package size={32} color="#9ca3af" />
                    </div>
                  )}
                </div>
                <div style={styles.artworkInfo}>
                  <h4 style={styles.artworkTitle}>{artwork.title}</h4>
                  <p style={styles.artworkArtist}>by {artwork.artist.first_name}</p>
                  <p style={styles.artworkPrice}>Rs.{artwork.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8fefa',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  searchBarContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    maxWidth: '800px',
    margin: '0 auto 24px auto',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '14px 14px 14px 48px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '100px',
    backgroundColor: '#ffffff',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '20px',
    marginBottom: '24px',
    maxWidth: '800px',
    margin: '0 auto 24px auto',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterLabel: {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
  },
  selectInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    fontSize: '14px',
  },
  sortOrderButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  statusMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    marginTop: '20px',
  },
  resultsSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '16px',
  },
  artistsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  artistCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  artistImageContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: '0 auto 12px auto',
  },
  artistImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  artistInfo: {
    textAlign: 'center',
  },
  artistName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    margin: '0 0 4px 0',
  },
  artistLocation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  artworksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  artworkCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  artworkImage: {
    width: '100%',
    height: '180px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artworkImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  artworkPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
  },
  artworkInfo: {
    padding: '16px',
  },
  artworkTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '4px',
    margin: 0,
  },
  artworkArtist: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px',
    margin: 0,
  },
  artworkPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4574a1',
    margin: 0,
  },
};

export default SearchComponent;