import axios from 'axios';
import api from '../api/config';

class AuthService {
  async register(username, email, password) {
    try {
      const response = await api.register({ username, email, password });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await api.login({ email, password });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async logout() {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }
}

export default new AuthService();
