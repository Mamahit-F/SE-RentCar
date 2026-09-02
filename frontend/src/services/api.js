import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://se-rentcar-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rental_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global 401 Unauthorized & Session Expired
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('rental_token');
        localStorage.removeItem('rental_user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error.response.data || { message: 'Terjadi kesalahan pada server' });
    }
    return Promise.reject({ message: 'Tidak dapat terhubung ke server backend' });
  }
);

// ============================================================
// API SERVICE MODULES
// ============================================================

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};

export const publicRentalService = {
  getActiveRentals: (params) => apiClient.get('/rentals', { params }),
  getRentalById: (id) => apiClient.get(`/rentals/${id}`),
  getRentalCars: (id) => apiClient.get(`/rentals/${id}/cars`),
};

export const publicCarService = {
  searchCars: (params) => apiClient.get('/cars', { params }),
  getCarById: (id) => apiClient.get(`/cars/${id}`),
};

export const bookingService = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/my'),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  cancelBooking: (id) => apiClient.put(`/bookings/${id}/cancel`),
};

export const paymentService = {
  simulatePayment: (data) => apiClient.post('/payments/simulate', data),
  getPaymentByBooking: (bookingId) => apiClient.get(`/payments/booking/${bookingId}`),
};

export const reviewService = {
  createReview: (data) => apiClient.post('/reviews', data),
  getRentalReviews: (rentalId) => apiClient.get(`/reviews/rental/${rentalId}`),
};

export const partnerService = {
  getDashboardStats: () => apiClient.get('/partner/dashboard/stats'),
  submitRental: (data) => apiClient.post('/partner/rentals', data),
  getMyRentals: () => apiClient.get('/partner/rentals'),
  getMyRentalById: (id) => apiClient.get(`/partner/rentals/${id}`),
  updateMyRental: (id, data) => apiClient.put(`/partner/rentals/${id}`, data),
  getMyCars: () => apiClient.get('/partner/cars'),
  getMyCarById: (id) => apiClient.get(`/partner/cars/${id}`),
  createCar: (data) => apiClient.post('/partner/cars', data),
  updateCar: (id, data) => apiClient.put(`/partner/cars/${id}`, data),
  deleteCar: (id) => apiClient.delete(`/partner/cars/${id}`),
  getPartnerBookings: () => apiClient.get('/partner/bookings'),
  updateBookingStatus: (id, status) => apiClient.put(`/partner/bookings/${id}/status`, { status }),
};

export const adminService = {
  getDashboardStats: () => apiClient.get('/admin/dashboard/stats'),
  getApplications: (status) => apiClient.get('/admin/applications', { params: { status } }),
  approveRental: (id) => apiClient.put(`/admin/applications/${id}/approve`),
  rejectRental: (id, rejectionReason) => apiClient.put(`/admin/applications/${id}/reject`, { rejectionReason }),
  getAllRentals: () => apiClient.get('/admin/rentals'),
  toggleRentalStatus: (id) => apiClient.put(`/admin/rentals/${id}/toggle-status`),
  getAllUsers: () => apiClient.get('/admin/users'),
  getUsersByRole: (role) => apiClient.get(`/admin/users/role/${role}`),
  toggleUserStatus: (id) => apiClient.put(`/admin/users/${id}/toggle-status`),
  getAllBookings: () => apiClient.get('/admin/bookings'),
};

export const healthService = {
  getHealth: () => apiClient.get('/health'),
  getDatabaseHealth: () => apiClient.get('/health/db'),
};

export default apiClient;
