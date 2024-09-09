import axios from 'axios';
import { BASE_URL } from '../../consts/baseURL';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    console.log(`Response: ${response.status} ${response.statusText}`, response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default api;
