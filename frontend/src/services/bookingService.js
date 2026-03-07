import api from './api';

export const bookingService = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/bookings/verify-payment', paymentData);
    return response.data;
  },

  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  getGuideBookings: async (params = {}) => {
    const response = await api.get('/bookings/guide-bookings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData);
    return response.data;
  }
};
