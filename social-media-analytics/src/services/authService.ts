import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      // Only access localStorage if we're in a browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const checkAuth = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const response = await axios.get(`${API_URL}/auth/check`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.authenticated;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}; 