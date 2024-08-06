import axios from 'axios';
import { BASE_URL } from '../../consts/baseURL';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'access-token': `Bearer ${localStorage.getItem('token')}`
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Запрос: ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('Ошибка запроса:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Ответ: ${response.status} ${response.statusText}`, response);
    return response;
  },
  (error) => {
    console.error('Ошибка:', error);
    return Promise.reject(error);
  }
);

export default api;
