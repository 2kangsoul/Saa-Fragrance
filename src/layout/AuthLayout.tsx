import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import MainLayout from "../Features/landingpages/components/MainLayout";

export default function AuthLayout() {
  const { isAuthenticated, user, fetchCurrentUser } = useAuthStore();
  const location = useLocation();

  // =========================================================================
  // SENSOR REFRESH: Ambil nama dari Backendless jika RAM kosong tapi token ada
  // =========================================================================
  useEffect(() => {
    // Jika status login TRUE, ADA token, tapi NAMANYA KOSONG (berarti web baru di-refresh)
    if (isAuthenticated && user?.userToken && !user?.name) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  // =========================================================================
  // SENSOR ANTI-HAPUS: Memaksa RAM menulis ulang ke Local Storage
  // =========================================================================
  useEffect(() => {
    if (isAuthenticated) {
      const checkStorage = localStorage.getItem("auth-storage");
      if (!checkStorage) {
        useAuthStore.setState({ isAuthenticated, user });
      }
    }
  }, [location.pathname, isAuthenticated, user]);

  const publicRoutes = ["/", "/login", "/register"];

  // LOGIKA 1: Belum login tapi masuk ke halaman private
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // LOGIKA 2: Sudah login tapi maksa buka halaman login
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <MainLayout />;
}