import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore"; 
import type { UseMainLayoutReturn } from "../types/MainLayout.types"; // <-- TAMBAHKAN KATA 'type' DI SINI

export const useMainLayout = (): UseMainLayoutReturn => {
  const [isScrolled, setIsScrolled] = useState(false);

  // STATE BARU: Untuk mengontrol buka/tutup menu di layar HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ambil status login, data user, dan fungsi logout dari Zustand
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup function untuk mencegah memory leak
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mengembalikan semua state dan fungsi agar bisa dipakai di komponen UI
  return {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAuthenticated,
    user,
    logout,
  };
};