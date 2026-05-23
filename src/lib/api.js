import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser  = (data) => API.post('/auth/register', data);
export const loginUser     = (data) => API.post('/auth/login', data);
export const logoutUser    = ()     => API.get('/auth/logout');
export const getProfile    = ()     => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const forgotPassword = (data, frontendUrl) => API.post(`/auth/password/forgot?frontendUrl=${encodeURIComponent(frontendUrl)}`, data);
export const resetPassword  = (token, data) => API.put(`/auth/password/reset/${token}`, data);
export const updatePassword = (data) => API.put('/auth/password/update', data);

// ─── Products ────────────────────────────────────────────────────────────────
export const fetchAllProducts    = (params) => API.get('/product', { params });
export const fetchSingleProduct  = (id)     => API.get(`/product/singleProduct/${id}`);
export const postProductReview   = (id, data) => API.put(`/product/post-new/review/${id}`, data);
export const deleteReview        = (id)     => API.delete(`/product/delete/review/${id}`);
export const aiSearchProducts    = (data)   => API.post('/product/ai-search', data);

// ─── Orders ──────────────────────────────────────────────────────────────────
export const placeOrder      = (data)    => API.post('/order/new', data);
export const fetchMyOrders   = ()        => API.get('/order/orders/me');
export const fetchSingleOrder = (id)     => API.get(`/order/${id}`);

// ─── Payment ─────────────────────────────────────────────────────────────────
export const verifyPayment = (data) => API.post('/payment/verify-payment', data);

export default API;
