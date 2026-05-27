// File: src/config/api.ts
import axios from 'axios';

// Membaca variabel dari file .env (Khusus Vite)
const APP_ID = import.meta.env.VITE_BACKENDLESS_APP_ID;
const REST_API_KEY = import.meta.env.VITE_BACKENDLESS_REST_API_KEY;
const URL_API_KEY = import.meta.env.VITE_BACKENDLESS_API_URL

// Membuat instance Axios dengan Base URL Backendless
const backendlessApi = axios.create({
  baseURL: `${URL_API_KEY}/${APP_ID}/${REST_API_KEY}/data/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backendlessApi;