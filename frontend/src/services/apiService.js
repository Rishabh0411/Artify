import authService from './authService';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  async request(url, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (authService.isAuthenticated()) {
      config.headers.Authorization = `Token ${authService.getToken()}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Artworks
  async getArtworks(params = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/artworks/?${searchParams}`);
  }

  async getArtwork(id) {
    return this.request(`/artworks/${id}/`);
  }

  async createArtwork(artworkData) {
    const formData = new FormData();
    Object.keys(artworkData).forEach(key => {
      if (key === 'uploaded_images' && Array.isArray(artworkData[key])) {
        artworkData[key].forEach((image, index) => {
          formData.append('uploaded_images', image);
        });
      } else if (artworkData[key] !== null && artworkData[key] !== undefined) {
        formData.append(key, artworkData[key]);
      }
    });

    return this.request('/artworks/create/', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set boundary for FormData
      body: formData,
    });
  }

  async updateArtwork(id, artworkData) {
    const formData = new FormData();
    Object.keys(artworkData).forEach(key => {
      if (key === 'uploaded_images' && Array.isArray(artworkData[key])) {
        artworkData[key].forEach((image) => {
          formData.append('uploaded_images', image);
        });
      } else if (artworkData[key] !== null && artworkData[key] !== undefined) {
        formData.append(key, artworkData[key]);
      }
    });

    return this.request(`/artworks/${id}/update/`, {
      method: 'PATCH',
      headers: {},
      body: formData,
    });
  }

  async deleteArtwork(id) {
    return this.request(`/artworks/${id}/delete/`, { method: 'DELETE' });
  }

  async likeArtwork(id) {
    return this.request(`/artworks/${id}/like/`, { method: 'POST' });
  }

  async getFeaturedArtworks() {
    return this.request('/artworks/featured/');
  }

  async getMyArtworks() {
    return this.request('/artworks/my-artworks/');
  }

  // Cart
  async getCart() {
    return this.request('/orders/cart/');
  }

  async addToCart(artworkId) {
    return this.request('/orders/cart/add/', {
      method: 'POST',
      body: JSON.stringify({ artwork_id: artworkId }),
    });
  }

  async removeFromCart(artworkId) {
    return this.request(`/orders/cart/remove/${artworkId}/`, { method: 'DELETE' });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/orders/wishlist/');
  }

  async addToWishlist(artworkId) {
    return this.request('/orders/wishlist/add/', {
      method: 'POST',
      body: JSON.stringify({ artwork_id: artworkId }),
    });
  }

  async removeFromWishlist(artworkId) {
    return this.request(`/orders/wishlist/remove/${artworkId}/`, { method: 'DELETE' });
  }

  // Orders
  async getOrders() {
    return this.request('/orders/orders/');
  }

  async getOrder(id) {
    return this.request(`/orders/orders/${id}/`);
  }

  async createOrder(orderData) {
    return this.request('/orders/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async processPayment(orderId, paymentData) {
    return this.request(`/orders/orders/${orderId}/payment/`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Categories
  async getCategories() {
    return this.request('/auth/categories/');
  }

  // Tags
  async getTags() {
    return this.request('/auth/tags/');
  }

  // Users
  async getUser(id) {
    return this.request(`/auth/users/${id}/`);
  }
}

export default new ApiService();