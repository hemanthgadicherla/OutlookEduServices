import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Course APIs
export const courseAPI = {
  getCourses: () => api.get('/courses'),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Registration APIs
export const registrationAPI = {
  createRegistration: (registrationData) => api.post('/registrations', registrationData),
  getRegistrations: () => api.get('/registrations'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (orderData) => api.post('/payments/create-order', orderData),
  verifyPayment: (verificationData) => api.post('/payments/verify', verificationData),
  getPayments: () => api.get('/payments'),
};

// Blog APIs
export const blogAPI = {
  getBlogs: () => api.get('/blogs'),
  createBlog: (blogData) => api.post('/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAdminRegistrations: () => api.get('/admin/registrations'),
  getAdminPayments: () => api.get('/admin/payments'),
  getAdminCourses: () => api.get('/admin/courses'),
};

export default api;