// Add these methods to your existing apiService.js file

const apiService = {
  // ... your existing methods ...

  // Profile-related methods
  getCurrentUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  getUserProfile: async (username) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/${username}/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  updateUserProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  getArtworksByArtist: async (artistId) => {
    const response = await fetch(`${API_BASE_URL}/api/artworks/?artist=${artistId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch artist artworks');
    }

    return response.json();
  },

  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  // Cart-related methods
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/api/cart/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }

    return response.json();
  },

  // Order-related methods
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return response.json();
  },

  processPayment: async (orderId, paymentData) => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to process payment');
    }

    return response.json();
  },

  // Temporary fallback methods (remove when backend is ready)
  
  // Mock method for profile - replace with real API when ready
  getCurrentUserProfileMock: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      id: user.user_id || 1,
      username: user.username || 'user',
      first_name: user.first_name || 'John',
      last_name: user.last_name || 'Doe',
      email: user.email || 'john@example.com',
      user_type: user.user_type || 'buyer',
      bio: 'Art enthusiast and collector.',
      location: 'New York, USA',
      phone: '+1-555-0123',
      date_joined: '2024-01-15T10:30:00Z',
      profile_picture: null,
      website: '',
      instagram: '',
      twitter: ''
    };
  },

  // Mock method for user orders
  getUserOrdersMock: async () => {
    return {
      results: [
        {
          id: 1,
          order_number: 'ORD-2024-001',
          status: 'delivered',
          total_amount: '5000.00',
          created_at: '2024-01-20T14:30:00Z'
        },
        {
          id: 2,
          order_number: 'ORD-2024-002',
          status: 'shipped',
          total_amount: '3500.00',
          created_at: '2024-01-25T09:15:00Z'
        }
      ]
    };
  },

  // Use mock methods until backend is ready
  getCurrentUserProfile: function() {
    return this.getCurrentUserProfileMock();
  },

  getUserOrders: function() {
    return this.getUserOrdersMock();
  }
};

export default apiService;