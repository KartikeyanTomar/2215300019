import axios from 'axios';
import { User, Post, Comment, ApiResponse } from '../types';

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';

// Authentication token
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU3OTc1LCJpYXQiOjE3NDQ5NTc2NzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI3OWM5ZjQ5LTM0N2QtNDI1OC04N2E0LWY4MmQ0MThmZDkyNSIsInN1YiI6ImthcnRpa2V5YW4udG9tYXJfY3MuY3NmMjJAZ2xhLmFjLmluIn0sImVtYWlsIjoia2FydGlrZXlhbi50b21hcl9jcy5jc2YyMkBnbGEuYWMuaW4iLCJuYW1lIjoia2FydGlrZXlhbiBzaW5naCB0b21hciIsInJvbGxObyI6IjIyMTUzMDAwMTkiLCJhY2Nlc3NDb2RlIjoiQ05uZUdUIiwiY2xpZW50SUQiOiJiNzljOWY0OS0zNDdkLTQyNTgtODdhNC1mODJkNDE4ZmQ5MjUiLCJjbGllbnRTZWNyZXQiOiJjUnhmUFVHYmJOSFVaVVhlIn0.C8zrEKYOuvVYZd6Uy-zej86LXtN20JLPuYJaR-BJzOI';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  // User related endpoints
  getUsers: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Post related endpoints
  getPosts: async (userId: string): Promise<{ posts: Post[] }> => {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data;
  },

  getPost: async (postId: number) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Comment related endpoints
  getComments: async (postId: number): Promise<{ comments: Comment[] }> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Analytics endpoints
  getPostAnalytics: async () => {
    const response = await api.get('/analytics/posts');
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get('/analytics/users');
    return response.data;
  },

  getEngagementAnalytics: async () => {
    const response = await api.get('/analytics/engagement');
    return response.data;
  }
};

export default apiService; 