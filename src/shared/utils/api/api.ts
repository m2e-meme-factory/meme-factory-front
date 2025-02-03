import axios from 'axios';
import { env } from '@shared/consts/env';

console.log('env.baseUrl', env.baseUrl);

const api = axios.create({
  baseURL: env.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
