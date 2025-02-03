import axios from 'axios';
import { env } from '@shared/consts/env';

const api = axios.create({
  baseURL: env.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
