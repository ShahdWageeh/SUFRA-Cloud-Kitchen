// Base API service layer
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  get: async (endpoint) => {
    // Fetch logic
  },
  post: async (endpoint, data) => {
    // Post logic
  },
  put: async (endpoint, data) => {
    // Put logic
  },
  delete: async (endpoint) => {
    // Delete logic
  },
};
