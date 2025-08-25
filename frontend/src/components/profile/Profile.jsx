import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Heart, 
  Eye, 
  TrendingUp,
  Camera,
  Palette,
  Award,
  Users,
  Globe,
  Instagram,
  Twitter
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import apiService from '../../services/apiService';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    instagram: '',
    twitter: ''
  });

  const isOwnProfile = !username || (currentUser && currentUser.username === username);

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      let profile;
      
      if (isOwnProfile) {
        // Fetch current user's profile
        profile = await apiService.getCurrentUserProfile();
        
        // Also fetch user's orders if it's their own profile
        if (currentUser?.user_type === 'buyer') {
          const ordersData = await apiService.getUserOrders();
          setOrders(ordersData.results || ordersData);
        }
        
        // Fetch user's artworks if they're an artist
        if (currentUser?.user_type === 'artist') {
          const artworksData = await apiService.getMyArtworks();
          setArtworks(artworksData.results || artworksData);
        }
      } else {
        // Fetch specific user's public profile
        profile = await apiService.getUserProfile(username);
        
        // Fetch their public artworks if they're an artist
        if (profile.user_type === 'artist') {
          const artworksData = await apiService.getArtworksByArtist(profile.id);
          setArtworks(artworksData.results || artworksData);
        }
      }
      
      setProfileData(profile);
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
        twitter: profile.twitter || ''
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing
      setEditForm({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || '',
        instagram: profileData.instagram || '',
        twitter: profileData.twitter || ''
      });
    }
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedProfile = await apiService.updateUserProfile(editForm);
      setProfileData(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const calculateStats = () => {
    if (profileData?.user_type === 'artist' && artworks.length > 0) {
      const totalViews = artworks.reduce((sum, artwork) => sum + (artwork.views_count || 0), 0);
      const totalLikes = artworks.reduce((sum, artwork) => sum + (artwork.likes_count || 0), 0);
      const soldArtworks = artworks.filter(artwork => artwork.availability === 'sold').length;
      
      return {
        totalArtworks: artworks.length,
        totalViews,
        totalLikes,
        soldArtworks
      };
    }
    
    return {
      totalArtworks: 0,
      totalViews: 0,
      totalLikes: 0,
      soldArtworks: 0
    };
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Profile not found</div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div style={styles.container}>
      {/* Profile Header */}
      <div style={styles.profileHeader}>
        <div style={styles.profileImageContainer}>
          <div style={styles.profileImage}>
            {profileData.profile_picture ? (
              <img 
                src={profileData.profile_picture} 
                alt={`${profileData.first_name} ${profileData.last_name}`}
                style={styles.profileImg}
              />
            ) : (
              <User size={48} color="#6b7280" />
            )}
          </div>
          {isOwnProfile && (
            <button style={styles.changePhotoBtn} title="Change Photo">
              <Camera size={16} />
            </button>
          )}
        </div>

        <div style={styles.profileInfo}>
          <div style={styles.profileBasic}>
            <h1 style={styles.profileName}>
              {editing ? (
                <div style={styles.nameEditContainer}>
                  <input
                    type="text"
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    style={styles.nameInput}
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    style={styles.nameInput}
                  />
                </div>
              ) : (
                `${profileData.first_name} ${profileData.last_name}`
              )}
            </h1>
            
            <div style={styles.profileMeta}>
              <span style={styles.userType}>
                {profileData.user_type === 'artist' ? (
                  <>
                    <Palette size={16} />
                    Artist
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    Art Collector
                  </>
                )}
              </span>
              
              {profileData.location && (
                <span style={styles.location}>
                  <MapPin size={14} />
                  {editing ? (
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      placeholder="Location"
                      style={styles.inlineInput}
                    />
                  ) : (
                    profileData.location
                  )}
                </span>
              )}
              
              <span style={styles.joinDate}>
                <Calendar size={14} />
                Joined {new Date(profileData.date_joined).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <div style={styles.profileActions}>
              {editing ? (
                <>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    style={styles.saveButton}
                  >
                    <Save size={16} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={handleEditToggle}
                    style={styles.cancelButton}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleEditToggle}
                  style={styles.editButton}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio Section */}
      {(profileData.bio || editing) && (
        <div style={styles.bioSection}>
          <h3 style={styles.sectionTitle}>About</h3>
          {editing ? (
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              style={styles.bioTextarea}
              rows="4"
            />
          ) : (
            <p style={styles.bioText}>
              {profileData.bio || 'No bio available.'}
            </p>
          )}
        </div>
      )}

      {/* Contact Information */}
      <div style={styles.contactSection}>
        <h3 style={styles.sectionTitle}>Contact & Social</h3>
        <div style={styles.contactGrid}>
          {(isOwnProfile || profileData.email) && (
            <div style={styles.contactItem}>
              <Mail size={16} />
              <span>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    style={styles.contactInput}
                  />
                ) : (
                  profileData.email
                )}
              </span>
            </div>
          )}
          
          {(isOwnProfile || profileData.phone) && (
            <div style={styles.contactItem}>
              <Phone size={16} />
              <span>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    style={styles.contactInput}
                  />
                ) : (
                  profileData.phone || 'No phone number'
                )}
              </span>
            </div>
          )}
          
          {/* Website Link */}
          {(profileData.website || editing) && (
            <div style={styles.contactItem}>
              <Globe size={16} />
              {editing ? (
                <input
                  type="url"
                  name="website"
                  value={editForm.website}
                  onChange={handleInputChange}
                  placeholder="Website URL"
                  style={styles.contactInput}
                />
              ) : (
                profileData.website && (
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    Website
                  </a>
                )
              )}
            </div>
          )}
          
          {/* Instagram Link */}
          {(profileData.instagram || editing) && (
            <div style={styles.contactItem}>
              <Instagram size={16} />
              {editing ? (
                <input
                  type="text"
                  name="instagram"
                  value={editForm.instagram}
                  onChange={handleInputChange}
                  placeholder="Instagram username"
                  style={styles.contactInput}
                />
              ) : (
                profileData.instagram && (
                  <a href={`https://instagram.com/${profileData.instagram}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    @{profileData.instagram}
                  </a>
                )
              )}
            </div>
          )}
          
          {/* Twitter Link */}
          {(profileData.twitter || editing) && (
            <div style={styles.contactItem}>
              <Twitter size={16} />
              {editing ? (
                <input
                  type="text"
                  name="twitter"
                  value={editForm.twitter}
                  onChange={handleInputChange}
                  placeholder="Twitter username"
                  style={styles.contactInput}
                />
              ) : (
                profileData.twitter && (
                  <a href={`https://twitter.com/${profileData.twitter}`} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                    @{profileData.twitter}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section for Artists */}
      {profileData.user_type === 'artist' && (
        <div style={styles.statsSection}>
          <h3 style={styles.sectionTitle}>Statistics</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <Package size={24} color="#4574a1" />
              <div style={styles.statInfo}>
                <h4 style={styles.statNumber}>{stats.totalArtworks}</h4>
                <p style={styles.statLabel}>Artworks</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <Eye size={24} color="#10b981" />
              <div style={styles.statInfo}>
                <h4 style={styles.statNumber}>{stats.totalViews.toLocaleString()}</h4>
                <p style={styles.statLabel}>Total Views</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <Heart size={24} color="#ef4444" />
              <div style={styles.statInfo}>
                <h4 style={styles.statNumber}>{stats.totalLikes}</h4>
                <p style={styles.statLabel}>Total Likes</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <Award size={24} color="#f59e0b" />
              <div style={styles.statInfo}>
                <h4 style={styles.statNumber}>{stats.soldArtworks}</h4>
                <p style={styles.statLabel}>Sold</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              ...styles.tab,
              ...(activeTab === 'overview' ? styles.activeTab : {})
            }}
          >
            Overview
          </button>
          
          {profileData.user_type === 'artist' && (
            <button
              onClick={() => setActiveTab('artworks')}
              style={{
                ...styles.tab,
                ...(activeTab === 'artworks' ? styles.activeTab : {})
              }}
            >
              Artworks ({artworks.length})
            </button>
          )}
          
          {isOwnProfile && profileData.user_type === 'buyer' && (
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                ...styles.tab,
                ...(activeTab === 'orders' ? styles.activeTab : {})
              }}
            >
              Orders ({orders.length})
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'overview' && (
          <div style={styles.overviewContent}>
            <div style={styles.overviewCard}>
              <h4 style={styles.overviewTitle}>Profile Summary</h4>
              <p style={styles.overviewText}>
                {profileData.user_type === 'artist' 
                  ? `${profileData.first_name} is a talented artist with ${stats.totalArtworks} artworks in their portfolio, garnering ${stats.totalViews.toLocaleString()} views and ${stats.totalLikes} likes from the community.`
                  : `${profileData.first_name} is an art enthusiast and collector, actively exploring and supporting the art community.`
                }
              </p>
            </div>
          </div>
        )}

        {activeTab === 'artworks' && profileData.user_type === 'artist' && (
          <div style={styles.artworksGrid}>
            {artworks.length === 0 ? (
              <div style={styles.emptyState}>
                <Package size={48} color="#9ca3af" />
                <p style={styles.emptyText}>
                  {isOwnProfile ? "You haven't created any artworks yet" : "No artworks available"}
                </p>
              </div>
            ) : (
              artworks.map(artwork => (
                <div 
                  key={artwork.id} 
                  style={styles.artworkCard}
                  onClick={() => handleArtworkClick(artwork.id)}
                >
                  <div style={styles.artworkImage}>
                    {artwork.main_image ? (
                      <img 
                        src={artwork.main_image} 
                        alt={artwork.title}
                        style={styles.artworkImg}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <Package size={32} color="#9ca3af" />
                      </div>
                    )}
                  </div>
                  
                  <div style={styles.artworkInfo}>
                    <h4 style={styles.artworkTitle}>{artwork.title}</h4>
                    <p style={styles.artworkPrice}>Rs.{artwork.price}</p>
                    
                    <div style={styles.artworkStats}>
                      <span style={styles.artworkStat}>
                        <Eye size={12} />
                        {artwork.views_count || 0}
                      </span>
                      <span style={styles.artworkStat}>
                        <Heart size={12} />
                        {artwork.likes_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'orders' && isOwnProfile && (
          <div style={styles.ordersContainer}>
            {orders.length === 0 ? (
              <div style={styles.emptyState}>
                <Package size={48} color="#9ca3af" />
                <p style={styles.emptyText}>No orders yet</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <h4 style={styles.orderNumber}>Order #{order.order_number}</h4>
                    <span style={{
                      ...styles.orderStatus,
                      backgroundColor: 
                        order.status === 'delivered' ? '#10b981' :
                        order.status === 'shipped' ? '#f59e0b' :
                        order.status === 'processing' ? '#4574a1' : '#6b7280'
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={styles.orderDate}>
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p style={styles.orderTotal}>Total: Rs.{order.total_amount}</p>
                </div>
              ))
            )}
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#dc3545',
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    flexWrap: 'wrap',
  },
  profileImageContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  profileImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  profileInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  profileBasic: {
    flex: 1,
    minWidth: '300px',
  },
  profileName: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '8px',
    margin: 0,
  },
  nameEditContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  nameInput: {
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '24px',
    fontWeight: 'bold',
    flex: 1,
    minWidth: '150px',
  },
  profileMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  userType: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#4574a1',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6b7280',
    fontSize: '14px',
  },
  joinDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#6b7280',
    fontSize: '14px',
  },
  inlineInput: {
    padding: '2px 6px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '14px',
    marginLeft: '4px',
  },
  profileActions: {
    display: 'flex',
    gap: '12px',
    flexShrink: 0,
  },
  editButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s ease',
  },
  saveButton: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s ease',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s ease',
  },
  bioSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  contactSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0c151d',
    marginBottom: '16px',
  },
  bioTextarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  bioText: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.6',
    margin: 0,
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    color: '#374151',
  },
  contactInput: {
    padding: '4px 8px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '16px',
    flex: 1,
  },
  socialLink: {
    color: '#4574a1',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  statInfo: {
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
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#6b7280',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#4574a1',
    borderBottomColor: '#4574a1',
    backgroundColor: '#f8fafc',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  overviewContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  overviewCard: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  overviewTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '12px',
  },
  overviewText: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.6',
    margin: 0,
  },
  artworksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#6b7280',
  },
  emptyText: {
    fontSize: '16px',
    marginTop: '16px',
    margin: 0,
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
  placeholderImage: {
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkInfo: {
    padding: '16px',
  },
  artworkTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    marginBottom: '8px',
    margin: 0,
  },
  artworkPrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4574a1',
    marginBottom: '12px',
    margin: 0,
  },
  artworkStats: {
    display: 'flex',
    gap: '16px',
  },
  artworkStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
  },
  ordersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderCard: {
    padding: '20px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  orderNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0c151d',
    margin: 0,
  },
  orderStatus: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#ffffff',
  },
  orderDate: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
    margin: 0,
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#4574a1',
    margin: 0,
  },
};

export default Profile;