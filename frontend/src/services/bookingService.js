import axios from "axios";

export const createBooking = (data) =>
  axios.post("/api/bookings/create", data);

export const updateBookingStatus = (data) =>
  axios.post("/api/bookings/update-status", data);

export const startTour = (bookingId) =>
  axios.post("/api/bookings/start", { bookingId });

export const endTour = (bookingId) =>
  axios.post("/api/bookings/end", { bookingId });