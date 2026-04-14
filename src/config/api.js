export const API_BASE_URL = 'https://blog-backend-4whx.onrender.com/api/v1';

export const AUTH_ENDPOINTS = {
  signup: '/auth/signup',
  verifyOtp: (id) => `/auth/verify-otp/${id}`,
  resendOtp: (id) => `/auth/resend-otp/${id}`,
  login: '/auth/login',
  logout: '/auth/logout',
};

export const PROFILE_ENDPOINTS = {
  get: '/profile',
  update: '/profile',
};

export const API_ENDPOINTS = {
  featuredPosts: '/blogs/featured-posts',
};
