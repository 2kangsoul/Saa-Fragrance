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
// INTERCEPTOR REQUEST: Menyelipkan user-token otomatis ke setiap request API
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

// ====================================================================
// INTERCEPTOR RESPONSE: Global Error Handler (Auto-Logout)
// ====================================================================
backendlessApi.interceptors.response.use(
  (response) => {
    // Jika respons sukses (200 OK), biarkan lewat
    return response;
  },
  (error) => {
    // Jika terjadi error dari server Backendless
    if (error.response) {
      const status = error.response.status;
      const errorCode = error.response.data?.code; // Kode error spesifik dari Backendless

      // Cek apakah error karena token kedaluwarsa/tidak valid (401 atau kode 3022/3064)
      if (status === 401 || errorCode === 3022 || errorCode === 3064) {
        console.warn("Sesi habis atau token tidak valid. Membersihkan sesi...");
        
        // Hapus data sesi lama di LocalStorage (Sesuai dengan key Zustand Anda)
        localStorage.removeItem('auth-storage'); 
        
        // Munculkan pesan yang ramah pengguna
        alert("Sesi login Anda telah berakhir demi keamanan. Silakan login kembali.");

        // Paksa pindah ke halaman utama / halaman login
        window.location.href = "/"; 
      }
    }

    // Lemparkan kembali errornya jika ada komponen yang butuh membaca pesan error spesifik
    return Promise.reject(error);
  }
);

export default backendlessApi;