import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://se-rentcar-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============================================================
// REQUEST INTERCEPTOR
// Attach JWT Bearer Token if present
// ============================================================
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

// ============================================================
// RESPONSE INTERCEPTOR
// Handle Global 401 Unauthorized & Session Expired
// ============================================================
apiClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('rental_token');
        localStorage.removeItem('rental_user');

        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(
        error.response.data || {
          message: 'Terjadi kesalahan pada server',
        }
      );
    }

    return Promise.reject({
      message: 'Tidak dapat terhubung ke server backend',
    });
  }
);

// ============================================================
// AUTH SERVICE
// Backend:
// /api/auth/...
// ============================================================
export const authService = {
  login: (credentials) =>
    apiClient.post('/api/auth/login', credentials),

  register: (userData) =>
    apiClient.post('/api/auth/register', userData),

  getCurrentUser: () =>
    apiClient.get('/api/auth/me'),
};

// ============================================================
// USER SERVICE
// Backend:
// /api/users/...
// ============================================================
export const userService = {
  getProfile: () =>
    apiClient.get('/api/users/profile'),

  updateProfile: (data) =>
    apiClient.put('/api/users/profile', data),
};

// ============================================================
// PUBLIC RENTAL SERVICE
// Backend:
// /api/rentals/...
// ============================================================
export const publicRentalService = {
  getActiveRentals: (params) =>
    apiClient.get('/api/rentals', { params }),

  getRentalById: (id) =>
    apiClient.get(`/api/rentals/${id}`),

  getRentalCars: (id) =>
    apiClient.get(`/api/rentals/${id}/cars`),
};

// ============================================================
// PUBLIC CAR SERVICE
// Backend:
// /api/cars/...
// ============================================================
export const publicCarService = {
  searchCars: (params) =>
    apiClient.get('/api/cars', { params }),

  getCarById: (id) =>
    apiClient.get(`/api/cars/${id}`),
};

// ============================================================
// BOOKING SERVICE
// Backend:
// /api/bookings/...
// ============================================================
export const bookingService = {
  createBooking: (data) =>
    apiClient.post('/api/bookings', data),

  getMyBookings: () =>
    apiClient.get('/api/bookings/my'),

  getBookingById: (id) =>
    apiClient.get(`/api/bookings/${id}`),

  cancelBooking: (id) =>
    apiClient.put(`/api/bookings/${id}/cancel`),
};

// ============================================================
// PAYMENT SERVICE
// Backend:
// /api/payments/...
// ============================================================
export const paymentService = {
  simulatePayment: (data) =>
    apiClient.post('/api/payments/simulate', data),

  getPaymentByBooking: (bookingId) =>
    apiClient.get(`/api/payments/booking/${bookingId}`),
};

// ============================================================
// REVIEW SERVICE
// Backend:
// /api/reviews/...
// ============================================================
export const reviewService = {
  createReview: (data) =>
    apiClient.post('/api/reviews', data),

  getRentalReviews: (rentalId) =>
    apiClient.get(`/api/reviews/rental/${rentalId}`),
};

// ============================================================
// PARTNER SERVICE
// Backend:
// /api/partner/...
// ============================================================
export const partnerService = {
  // Dashboard
  getDashboardStats: () =>
    apiClient.get('/api/partner/dashboard/stats'),

  // Rental Place
  submitRental: (data) =>
    apiClient.post('/api/partner/rentals', data),

  getMyRentals: () =>
    apiClient.get('/api/partner/rentals'),

  getMyRentalById: (id) =>
    apiClient.get(`/api/partner/rentals/${id}`),

  updateMyRental: (id, data) =>
    apiClient.put(`/api/partner/rentals/${id}`, data),

  // Cars / Fleet
  getMyCars: () =>
    apiClient.get('/api/partner/cars'),

  getMyCarById: (id) =>
    apiClient.get(`/api/partner/cars/${id}`),

  createCar: (data) =>
    apiClient.post('/api/partner/cars', data),

  updateCar: (id, data) =>
    apiClient.put(`/api/partner/cars/${id}`, data),

  deleteCar: (id) =>
    apiClient.delete(`/api/partner/cars/${id}`),

  // Bookings
  getPartnerBookings: () =>
    apiClient.get('/api/partner/bookings'),

  updateBookingStatus: (id, status) =>
    apiClient.put(
      `/api/partner/bookings/${id}/status`,
      { status }
    ),
};

// ============================================================
// ADMIN SERVICE
// Backend:
// /api/admin/...
// ============================================================
export const adminService = {
  // Dashboard
  getDashboardStats: () =>
    apiClient.get('/api/admin/dashboard/stats'),

  // Applications
  getApplications: (status) =>
    apiClient.get('/api/admin/applications', {
      params: { status },
    }),

  approveRental: (id) =>
    apiClient.put(`/api/admin/applications/${id}/approve`),

  rejectRental: (id, rejectionReason) =>
    apiClient.put(
      `/api/admin/applications/${id}/reject`,
      { rejectionReason }
    ),

  // Rentals
  getAllRentals: () =>
    apiClient.get('/api/admin/rentals'),

  toggleRentalStatus: (id) =>
    apiClient.put(`/api/admin/rentals/${id}/toggle-status`),

  // Users
  getAllUsers: () =>
    apiClient.get('/api/admin/users'),

  getUsersByRole: (role) =>
    apiClient.get(`/api/admin/users/role/${role}`),

  toggleUserStatus: (id) =>
    apiClient.put(`/api/admin/users/${id}/toggle-status`),

  // Bookings
  getAllBookings: () =>
    apiClient.get('/api/admin/bookings'),
};

// ============================================================
// HEALTH SERVICE
// Backend:
// /api/health/...
// ============================================================
export const healthService = {
  getHealth: () =>
    apiClient.get('/api/health'),

  getDatabaseHealth: () =>
    apiClient.get('/api/health/db'),
};

export default apiClient;
