const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    // Initialize token and user from localStorage
    this.initializeFromStorage();
  }

  initializeFromStorage() {
    try {
      this.token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      this.user = userStr ? JSON.parse(userStr) : null;
      
      console.log('AuthService initialized:', {
        hasToken: !!this.token,
        hasUser: !!this.user,
        user: this.user
      });
      
      // Validate that both token and user exist together
      if ((this.token && !this.user) || (!this.token && this.user)) {
        console.warn('Inconsistent auth state detected, clearing...');
        this.clearStorage();
      }
    } catch (error) {
      console.error('Error initializing from storage:', error);
      this.clearStorage();
    }
  }

  clearStorage() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('Auth data set:', {
      token: !!token,
      user: user
    });
  }

  async register(userData) {
    console.log('Attempting registration with data:', userData);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log(`Registration response status: ${response.status}`);

      const responseText = await response.text();
      console.log('Registration response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse registration response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.log('Registration error response:', data);
        
        let errorMessage = 'Registration failed';
        
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors;
        } else if (data.password) {
          errorMessage = `Password: ${Array.isArray(data.password) ? data.password.join(', ') : data.password}`;
        } else if (data.password_confirm) {
          errorMessage = `Password confirmation: ${Array.isArray(data.password_confirm) ? data.password_confirm.join(', ') : data.password_confirm}`;
        } else if (data.email) {
          errorMessage = `Email: ${Array.isArray(data.email) ? data.email.join(', ') : data.email}`;
        } else if (data.username) {
          errorMessage = `Username: ${Array.isArray(data.username) ? data.username.join(', ') : data.username}`;
        }

        const error = new Error(errorMessage);
        error.details = data;
        throw error;
      }

      // Validate response structure
      if (!data.token || !data.user) {
        throw new Error('Invalid registration response: missing token or user data');
      }

      // Set auth data
      this.setAuthData(data.token, data.user);
      
      console.log('Registration successful');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      this.clearStorage();
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async login(email, password) {
    console.log('Attempting login with email:', email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log(`Login response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Login error response:', errorData);
        
        let errorMessage = 'Login failed';
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response structure
      if (!data.token || !data.user) {
        throw new Error('Invalid login response: missing token or user data');
      }

      // Set auth data
      this.setAuthData(data.token, data.user);
      
      console.log('Login successful');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      this.clearStorage();
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  async logout() {
    console.log('Logging out...');
    
    try {
      if (this.token) {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearStorage();
      console.log('Logout completed');
    }
  }

  async getProfile() {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Token ${this.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear storage
          this.clearStorage();
          throw new Error('Authentication expired. Please login again.');
        }
        throw new Error('Failed to fetch profile');
      }

      const userData = await response.json();
      
      // Update stored user data
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${this.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Profile update failed');
      }

      const userData = await response.json();
      
      // Update stored user data
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  isAuthenticated() {
    const hasToken = !!this.token;
    const hasUser = !!this.user;
    const result = hasToken && hasUser;
    
    console.log('Auth check in service:', { hasToken, hasUser, result });
    
    return result;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.user;
  }

  // Method to create authenticated fetch requests
  async authenticatedFetch(url, options = {}) {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Token ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      // Token is invalid, clear storage
      this.clearStorage();
      throw new Error('Authentication expired. Please login again.');
    }

    return response;
  }

  // New methods for fetching profile data
  async getCurrentUserProfile() {
    const response = await this.authenticatedFetch(`${API_BASE_URL}/profiles/me/`);
    if (!response.ok) {
        throw new Error('Failed to fetch current user profile');
    }
    return response.json();
  }

  async getUserProfile(username) {
    const response = await this.authenticatedFetch(`${API_BASE_URL}/profiles/${username}/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
  }
  
  async getUserOrders() {
    const response = await this.authenticatedFetch(`${API_BASE_URL}/orders/`);
    if (!response.ok) {
        throw new Error('Failed to fetch user orders');
    }
    return response.json();
  }
  
  async getMyArtworks() {
    const response = await this.authenticatedFetch(`${API_BASE_URL}/artworks/my/`);
    if (!response.ok) {
        throw new Error('Failed to fetch my artworks');
    }
    return response.json();
  }

  async getArtworksByArtist(artistId) {
    const response = await this.authenticatedFetch(`${API_BASE_URL}/artworks/?artist_id=${artistId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch artist artworks');
    }
    return response.json();
  }
}

export default new AuthService();