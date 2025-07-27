import axios from 'axios';

const token = localStorage.getItem('token'); // Replace with your actual key

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  withCredentials: true,
  headers: {
    "x-api-token": process.env.REACT_APP_API_TOKEN,
    ...(token && { Authorization: token }) // Add token if available
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token/user if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);


httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let convertedError = error;

    try {
      return Promise.reject(convertedError);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export default httpClient;
