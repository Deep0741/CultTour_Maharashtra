import api from './api';

export const destinationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/destinations', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/destinations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/destinations/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/destinations/categories/list');
    return response.data;
  }
};
