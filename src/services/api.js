import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

console.log('🔗 API Base URL:', API_BASE_URL);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:       (d) => api.post('/auth/register', d),
  login:          (d) => api.post('/auth/login', d),
  logout:         ()  => api.get('/auth/logout'),
  profile:        ()  => api.get('/auth/profile'),
  updateProfile:  (d) => api.put('/auth/profile', d),
  forgotPassword: (d, frontendUrl) => api.post(`/auth/password/forgot?frontendUrl=${encodeURIComponent(frontendUrl)}`, d),
  resetPassword:  (token, d) => api.put(`/auth/password/reset/${token}`, d),
  updatePassword: (d) => api.put('/auth/password/update', d),
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:         (p)     => api.get('/product', { params: p }),
  getOne:         (id)    => api.get(`/product/singleProduct/${id}`),
  aiSearch:       (d)     => api.post('/product/ai-search', d),
  checkPurchase:  (id)    => api.get(`/product/check-purchase/${id}`),
  review:         (id, d) => api.put(`/product/post-new/review/${id}`, d),
  delReview:      (id)    => api.delete(`/product/delete/review/${id}`),
  // Admin
  create:    (d)     => api.post('/product/admin/create', d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id, d) => api.put(`/product/admin/update/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:    (id)    => api.delete(`/product/admin/delete/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  place:     (d) => api.post('/order/new', d),
  myOrders:  ()  => api.get('/order/orders/me'),
  getOne:    (id) => api.get(`/order/${id}`),
  cancel:    (id) => api.put(`/order/${id}/cancel`),
  // Admin
  getAll:    ()  => api.get('/order/admin/getall'),
  update:    (id, d) => api.put(`/order/admin/update/${id}`, d),
  delete:    (id) => api.delete(`/order/admin/delete/${id}`),
};

// ── Payment ───────────────────────────────────────────────────────────────────
export const paymentAPI = {
  verify: (d) => api.post('/payment/verify-payment', d),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers:   (p) => api.get('/admin/getallUsers', { params: p }),
  deleteUser: (id) => api.delete(`/admin/delete/${id}`),
  stats:      ()  => api.get('/admin/fetch/dashboard-stats'),
};

export default api;
