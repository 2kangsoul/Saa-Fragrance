// File: src/Features/product/hooks/loginHooks.tsx
import { useState } from "react";
import type { LoginHookReturn } from "../types/loginTypes"; // Import Type dari file terpisah

// Terapkan tipe balikan (return type) ke Custom Hook
export const useLoginState = (): LoginHookReturn => {
  // --- STATE UNTUK FITUR LOGIN MODAL ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      console.log("Produk berhasil ditambahkan ke keranjang!");
    }
  };

  return {
    isLoggedIn,
    setIsLoggedIn,
    showLoginModal,
    setShowLoginModal,
    handleAddToCart,
  };
};