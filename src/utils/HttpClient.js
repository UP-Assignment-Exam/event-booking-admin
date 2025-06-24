import axios from 'axios';
import { API_ENDPOINT, API_TOKEN } from '../config/api';

const httpClient = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
  headers: {
    "x-api-token": API_TOKEN
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
