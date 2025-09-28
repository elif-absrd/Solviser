import axios from 'axios';

// Create an Axios instance with a base URL.
// This uses an environment variable for production and a fallback for local development.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api',
  withCredentials: true, // This is crucial for sending HttpOnly cookies with requests
});

// The request interceptor is not strictly needed for auth anymore,
// as the browser handles sending the cookie automatically.
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// The response interceptor is critical for a seamless single sign-on experience.
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Handle global errors, like an expired token (which results in a 401).
    if (error.response && error.response.status === 401) {
      // If the webapp gets a 401 Unauthorized, the user's session is invalid.
      // We must redirect them back to the main website's sign-in page to re-authenticate.
      if (typeof window !== 'undefined') {
        const signInUrl = process.env.NEXT_PUBLIC_WEBSITE_URL
          ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}/signin`
          : 'http://localhost:3000/signin'; // Fallback for local development

        window.location.href = signInUrl;
      }

      return new Promise(() => {});
    }
    // Return the error so it can still be caught by individual components if needed
    return Promise.reject(error);
  }
);

export default api;