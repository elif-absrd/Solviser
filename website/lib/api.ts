import axios from 'axios';

// We need to extend the AxiosRequestConfig interface to allow our custom property
declare module 'axios' {
  export interface AxiosRequestConfig {
    _isPublic?: boolean;
  }
}

// Create an Axios instance with a base URL.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  withCredentials: true, // This is crucial for sending HttpOnly cookies with requests
});

// The response interceptor is now smarter.
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    const config = error.config;

    // Handle global errors, like an expired token (which results in a 401).
    if (error.response && error.response.status === 401) {
      
      // CRITICAL CHANGE: Only redirect if the request was NOT marked as public.
      if (!config || !config._isPublic) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
          window.location.href = '/signin';
        }
      }
    }
    // Return the error so it can still be caught by individual components if needed
    return Promise.reject(error);
  }
);

export default api;