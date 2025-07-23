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
