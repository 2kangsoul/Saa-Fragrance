import axios from 'axios';

const APP_ID = import.meta.env.VITE_BACKENDLESS_APP_ID;
const REST_API_KEY = import.meta.env.VITE_BACKENDLESS_REST_API_KEY;
const URL_API_KEY = import.meta.env.VITE_BACKENDLESS_API_URL;

const backendlessApi = axios.create({
  baseURL: `${URL_API_KEY}/${APP_ID}/${REST_API_KEY}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ====================================================================
// INTERCEPTOR: Menyelipkan user-token otomatis ke setiap request API
// ====================================================================
backendlessApi.interceptors.request.use((config) => {
  // 1. Baca data Zustand dari Local Storage
  const authStorage = localStorage.getItem('auth-storage');
  
  if (authStorage) {
    // 2. Parse string JSON menjadi Object
    const parsedStorage = JSON.parse(authStorage);
    // 3. Ambil tokennya
    const token = parsedStorage?.state?.user?.userToken;
    
    // 4. Jika token ada, selipkan ke dalam Headers Backendless
    if (token) {
      config.headers['user-token'] = token;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default backendlessApi;