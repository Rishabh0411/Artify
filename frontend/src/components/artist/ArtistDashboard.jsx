import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Heart, TrendingUp, DollarSign, Package, Upload } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import apiService from '../../services/apiService';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalViews: 0,
    totalLikes: 0,
    totalEarnings: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    dimensions: '',
    year_created: new Date().getFullYear(),
    condition: 'excellent',
    price: '',
    availability: 'for_sale',
    uploaded_images: []
  });

  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (user && user.user_type === 'artist') {
      fetchArtworks();
      fetchCategories();
    }
  }, [user]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyArtworks();
      setArtworks(response.results || response);
      
      // Calculate stats
      const totalViews = response.results?.reduce((sum, artwork) => sum + (artwork.views_count || 0), 0) || 0;
      const totalLikes = response.results?.reduce((sum, artwork) => sum + (artwork.likes_count || 0), 0) || 0;
      const soldArtworks = response.results?.filter(artwork => artwork.availability === 'sold') || [];
      const totalEarnings = soldArtworks.reduce((sum, artwork) => sum + parseFloat(artwork.price || 0), 0);
      
      setStats({
        totalArtworks: response.results?.length || 0,
        totalViews,
        totalLikes,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.results || response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setFormData(prev => ({
      ...prev,
      uploaded_images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArtwork) {
        await apiService.updateArtwork(editingArtwork.id, formData);
      } else {
        await apiService.createArtwork(formData);
      }
      
      setShowCreateForm(false);
      setEditingArtwork(null);
      resetForm();
      fetchArtworks();
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('Error saving artwork. Please try again.');
    }
  };

  const handleEdit = (artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description,
      category: artwork.category?.id || '',
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      year_created: artwork.year_created,
      condition: artwork.condition,
      price: artwork.price,
      availability: artwork.availability,
      uploaded_images: []
    });
    setImageFiles([]);
    setShowCreateForm(true);
  };

  const handleDelete = async (artworkId) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await apiService.deleteArtwork(artworkId);
        fetchArtworks();
      } catch (error) {
        console.error('Error deleting artwork:', error);
        alert('Error deleting artwork. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      medium: '',
      dimensions: '',
      year_created: new Date().getFullYear(),
      condition: 'excellent',
      price: '',
      availability: 'for_sale',
      uploaded_images: []
    });
    setImageFiles([]);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingArtwork(null);
    resetForm();
  };

  if (!user || user.user_type !== 'artist') {
    return (
      <div style={styles.container}>
        <div style={styles.errorMessage}>
          Access denied. This page is only available for artists.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Artist Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user.first_name}!</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={styles.createButton}
        >
          <Plus size={20} />
          Add New Artwork
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Package size={24} color="#4574a1" />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalArtworks}</h3>
            <p style={styles.statLabel}>Total Artworks</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Eye size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalViews.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Views</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Heart size={24} color="#ef4444" />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalLikes}</h3>
            <p style={styles.statLabel}>Total Likes</p>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <DollarSign size={24} color="#f59e0b" />
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>Rs.{stats.totalEarnings.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
              </h2>
              <button onClick={cancelForm} style={styles.closeButton}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Medium *</label>
                  <input
                    type="text"
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    placeholder="e.g., Oil on canvas, Digital art"
                    style={styles.input}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 24 x 36 inches"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Year Created</label>
                  <input
                    type="number"
                    name="year_created"
                    value={formData.year_created}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="very_good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    style={styles.input}
                    required
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    <option value="for_sale">For Sale</option>
                    <option value="not_for_sale">Not for Sale</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={styles.textarea}
                  placeholder="Describe your artwork..."
                  required
                />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Images</label>
                <div style={styles.imageUpload}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    id="artwork-images"
                  />
                  <label htmlFor="artwork-images" style={styles.fileLabel}>
                    <Upload size={24} />
                    <span>Choose Images</span>
                  </label>
                </div>
                {imageFiles.length > 0 && (
                  <div style={styles.imagePreview}>
                    <p>{imageFiles.length} image(s) selected</p>
                  </div>
                )}
              </div>
              
              <div style={styles.formActions}>
                <button type="button" onClick={cancelForm} style={styles.cancelButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingArtwork ? 'Update Artwork' : 'Create Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Artworks Grid */}
      <div style={styles.artworksSection}>
        <h2 style={styles.sectionTitle}>My Artworks</h2>
        
        {loading ? (
          <div style={styles.loading}>Loading your artworks...</div>
        ) : artworks.length === 0 ? (
          <div style={styles.emptyState}>
            <Package size={48} color="#9ca3af" />
            <p style={styles.emptyText}>No artworks yet</p>
            <p style={styles.emptySubtext}>Create your first artwork to get started</p>
          </div>
        ) : (
          <div style={styles.artworksGrid}>
            {artworks.map(artwork => (
              <div key={artwork.id} style={styles.artworkCard}>
                <div style={styles.artworkImage}>
                  {artwork.main_image ? (
                    <img 
                      src={artwork.main_image} 
                      alt={artwork.title}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>
                      <Package size={32} color="#9ca3af" />
                    </div>
                  )}
                </div>
                
                <div style={styles.artworkInfo}>
                  <h3 style={styles.artworkTitle}>{artwork.title}</h3>
                  <p style={styles.artworkPrice}>Rs.{artwork.price}</p>
                  
                  <div style={styles.artworkStats}>
                    <span style={styles.stat}>
                      <Eye size={14} />
                      {artwork.views_count || 0}
                    </span>
                    <span style={styles.stat}>
                      <Heart size={14} />
                      {artwork.likes_count || 0}
                    </span>
                  </div>
                  
                  <div style={styles.statusBadge}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: 
                        artwork.availability === 'for_sale' ? '#10b981' :
                        artwork.availability === 'sold' ? '#ef4444' :
                        artwork.availability === 'on_hold' ? '#f59e0b' : '#6b7280'
                    }}>
                      {artwork.availability.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={styles.artworkActions}>
                    <button
                      onClick={() => handleEdit(artwork)}
                      style={styles.actionButton}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      style={styles.deleteButton}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8fefa',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: 0,
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  createButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
  },
  select: {
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  textarea: {
    padding: '10px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
  },
  imageUpload: {
    position: 'relative',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: '2px dashed #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
    color: '#6b7280',
  },
  imagePreview: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#6b7280',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  artworksSection: {
    marginTop: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '24px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#6b7280',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '16px 0 8px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  artworksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  artworkImage: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f3f4f6',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  artworkInfo: {
    padding: '16px',
  },
  artworkTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0c151d',
    margin: '0 0 8px 0',
    lineHeight: '1.3',
  },
  artworkPrice: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#4574a1',
    margin: '0 0 12px 0',
  },
  artworkStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
  },
  statusBadge: {
    marginBottom: '12px',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  },
  artworkActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '8px',
    cursor: 'pointer',
    color: '#ef4444',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '24px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '16px',
  },
};

export default ArtistDashboard;