import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import MainLayout from "../Features/header/MainLayout";

export default function AuthLayout() {
  const { isAuthenticated, user, fetchCurrentUser } = useAuthStore();
  const location = useLocation();

  // Sensor Auto-Restore saat Refresh
  useEffect(() => {
    if (isAuthenticated && user?.userToken && !user?.name) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  // Sensor Anti-Hapus Local Storage
  useEffect(() => {
    if (isAuthenticated) {
      const checkStorage = localStorage.getItem("auth-storage");
      if (!checkStorage) {
        useAuthStore.setState({ isAuthenticated, user });
      }
    }
  }, [location.pathname, isAuthenticated, user]);

  // =========================================================================
  // LOGIKA PENGUNCIAN HALAMAN (GUEST vs PRIVATE)
  // =========================================================================

  // 1. Daftar Halaman yang HANYA BOLEH dibuka oleh orang yang BELUM LOGIN
  // (Masukkan path landing page awal Anda di sini jika ada, misal "/welcome")
  const guestOnlyRoutes = ["/login", "/register"];

  // 2. Daftar Halaman Bebas (Boleh diakses sebelum maupun sesudah login)
  const publicRoutes = ["/"]; // Ubah sesuai kebutuhan. Jika "/" khusus yang sudah login, hapus dari sini.

  // SKENARIO A: Orang SUDAH LOGIN, tapi iseng tekan tombol Back ke /login atau /register
  if (isAuthenticated && guestOnlyRoutes.includes(location.pathname)) {
    // Tendang balik ke halaman dalam (misal "/") dan HANCURKAN histori tombol Back-nya (replace: true)
    return <Navigate to="/" replace />;
  }

  // SKENARIO B: Orang BELUM LOGIN, tapi maksa mau masuk ke halaman dalam (misal /cart, /products)
  if (
    !isAuthenticated &&
    !guestOnlyRoutes.includes(location.pathname) &&
    !publicRoutes.includes(location.pathname)
  ) {
    // Tendang ke halaman login, dan replace history agar saat ditekan Back tidak error
    return <Navigate to="/login" replace />;
  }

  // Jika semua aman, render halamannya
  return <MainLayout />;
}
