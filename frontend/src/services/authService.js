const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
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
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        headers: {
          'Authorization': `Token ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
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

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();