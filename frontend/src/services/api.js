import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create API instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Inventory API endpoints
export const inventoryApi = {
  getAllItems: () => api.get('/inventory'),
  getItemById: (id) => api.get(`/inventory/${id}`),
  createItem: (item) => api.post('/inventory', item),
  updateItem: (id, item) => api.put(`/inventory/${id}`, item),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  getStockReport: () => api.get('/inventory/reports/stock'),
};

export default api;