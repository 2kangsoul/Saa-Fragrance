import { useState, useEffect } from "react";
import backendlessApi from "../../../config/api"; // Sesuaikan jumlah titik (../) dengan struktur folder Anda
import type { BlogPost } from "../types/blogTypes";

export const useBlog = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Kategori disesuaikan persis dengan pilihan di BlogManagerModal
  const categories = ["Semua", "Niche", "Designer", "Tips", "Review"];

  // Fungsi untuk menarik data asli dari Backendless
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        // Mengambil data dari tabel Blogs, diurutkan dari yang terbaru (opsional: tambah sortBy)
        const res = await backendlessApi.get("data/Blogs", {
          params: {
            sortBy: "created desc"
          }
        });
        
        // Memetakan (Mapping) data Backendless agar sesuai dengan tipe BlogPost Anda
        const fetchedBlogs = res.data.map((item: any) => ({
          id: item.objectId, 
          title: item.title,
          excerpt: item.excerpt,
          author: item.author,
          date: item.publishDate, 
          category: item.category,
          imageUrl: item.imageUrl,
          imageUrl2: item.imageUrl2, // <-- TAMBAHAN
          imageUrl3: item.imageUrl3, // <-- TAMBAHAN
          approval: item.approval, // <-- INI YANG HARUS DITAMBAHKAN AGAR TIDAK KOSONG
          content: item.content, 
        }));

        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Gagal mengambil data blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fitur Filtering Tetap Sama
  const filteredBlogs =
    activeCategory === "Semua"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  return {
    activeCategory,
    setActiveCategory,
    categories,
    filteredBlogs,
    isLoading, // Tambahan fitur loading state jika Anda butuh menampilkan animasi muter-muter
  };
};