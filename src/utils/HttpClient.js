import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  withCredentials: true,
  headers: {
    "x-api-token": process.env.REACT_APP_API_TOKEN
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
