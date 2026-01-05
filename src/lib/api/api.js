import axios from 'axios';

/**
 * Production-ready Axios instance configured for a Clerk-authenticated
 * Express backend. The instance:
 *  - reads the base URL from VITE_API_URL (defaults to localhost)
 *  - attaches a Clerk session token to requests via an interceptor
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Axios instance with sane defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 0, // No timeout to allow for long running AI requests
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach Authorization header from the active Clerk session (production-style)
api.interceptors.request.use(async (config) => {
  if (!config.headers) config.headers = {};

  if (!config.headers.Authorization) {
    try {
      const clerk = window?.Clerk;
      const session = clerk?.session;
      if (session) {
        // Use the active session's default JWT; no custom template
        const token = await session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.warn('Clerk token fetch failed', err);
    }
  }

  return config;
});

// Basic response interceptor placeholder (extend as needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place for auth / refresh handling or logging
    return Promise.reject(error);
  }
);

export default api;
