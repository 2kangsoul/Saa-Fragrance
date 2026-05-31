import { useState, useEffect, useCallback } from "react";
import backendlessApi from "../../../config/api"; 
import type { BlogPost } from "../types/blogTypes";

export const useBlog = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Kategori disesuaikan persis dengan pilihan di BlogManagerModal
  const categories = ["Semua", "Niche", "Designer", "Tips", "Review"];

  // Gunakan useCallback agar fungsi ini stabil dan bisa dipanggil dari luar
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await backendlessApi.get("data/Blogs", {
        params: {
          sortBy: "created desc"
        }
      });
      
      const fetchedBlogs = res.data.map((item: any) => ({
        id: item.objectId, 
        title: item.title,
        excerpt: item.excerpt,
        author: item.author,
        date: item.publishDate, 
        category: item.category,
        imageUrl: item.imageUrl,
        imageUrl2: item.imageUrl2, 
        imageUrl3: item.imageUrl3, 
        approval: item.approval, 
        content: item.content, 
      }));

      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Gagal mengambil data blog:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(); // Tarik saat pertama kali render
    
    // Pasang "telinga" untuk mendengarkan sinyal dari Modal Admin
    window.addEventListener("refreshBlogs", fetchBlogs);
    
    // Bersihkan telinga saat pindah halaman
    return () => {
      window.removeEventListener("refreshBlogs", fetchBlogs);
    };
  }, [fetchBlogs]);

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
    isLoading, 
  };
};