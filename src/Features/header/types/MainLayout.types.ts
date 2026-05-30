// MainLayout.types.ts
import React from "react";

// Kita gunakan 'any' sementara untuk user agar menyesuaikan dengan store Anda,
// atau jika Anda punya tipe UserData, bisa di-import ke sini.
export interface UseMainLayoutReturn {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  user: any; 
  logout: () => void;
}