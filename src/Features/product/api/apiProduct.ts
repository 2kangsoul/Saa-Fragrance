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
          "Product?pageSize=100",
        );
        setProducts(response.data);
      } catch (err: any) {
        console.error("Gagal mengambil data produk dari Backendless:", err);
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