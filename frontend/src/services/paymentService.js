import axios from "axios";

export const createOrder = (bookingId) =>
  axios.post("/api/payment/create-order", { bookingId });

export const verifyPayment = (data) =>
  axios.post("/api/payment/verify", data);