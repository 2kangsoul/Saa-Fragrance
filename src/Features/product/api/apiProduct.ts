// File: src/Features/product/api/apiProduct.ts
import { useState, useEffect } from "react";
import backendlessApi from "../../../config/api"; // Sesuaikan path ini jika posisi folder berbeda
import type { ProductType } from "../types/productTypes"; // Sesuaikan path ini dengan lokasi file type Anda

// Membuat Custom Hook sesuai standar React
export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await backendlessApi.get<ProductType[]>(
          "data/Product?pageSize=100",
        );
        setProducts(response.data);
      } catch (err: any) {
        console.error("Gagal mengambil data produk dari Backendless:", err);
        
        const errorMessage = err.response?.data?.message || err.message;
        const statusCode = err.response?.status;
        
        // Deteksi masalah token/sesi secara lebih luas (401 Unauthorized / 403 Forbidden)
        const isSessionExpired = 
          statusCode === 401 || 
          statusCode === 403 ||
          (typeof errorMessage === "string" && (errorMessage.toLowerCase().includes("session") || errorMessage.toLowerCase().includes("token")));

        if (isSessionExpired) {
          // 1. Bersihkan semua riwayat login di storage
          localStorage.removeItem("userToken");
          localStorage.removeItem("user");
          sessionStorage.clear();
          
          // 2. Sapu bersih memori aplikasi dengan me-reload halaman
          // Ini akan memaksa backendlessApi membuang token lama dan mereset Navbar Anda
          window.location.reload();
          return; // Hentikan eksekusi kode di sini
        }

        setError(
          "Koneksi ke database terputus. Silakan coba muat ulang halaman.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mengembalikan nilai agar bisa dipakai di komponen mana saja
  return { products, loading, error };
};