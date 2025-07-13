// frontend/src/components/shop/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: '#ffffff', // Keep white background for "no results" message
        borderRadius: '12px',
        minHeight: '400px',
        textAlign: 'center',
        color: '#6b7280',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)' // Keep shadow for "no results" box
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#0c151d' }}>
          No Artworks Found
        </h3>
        <p style={{ fontSize: '16px', maxWidth: '400px' }}>
          It looks like there are no artworks matching your current selection. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '24px', // Gap between product cards
      // --- REMOVED THESE STYLES ---
      // padding: '20px',
      // backgroundColor: '#ffffff',
      // borderRadius: '12px',
      // boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      // ---
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;