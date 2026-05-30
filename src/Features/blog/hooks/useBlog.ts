import { useState } from "react";
import type { BlogPost } from "../types/blogTypes";

// Dummy data untuk artikel blog
const initialBlogs: BlogPost[] = [
  {
    id: 1,
    title: "panduan memilih parfum niche untuk pemula",
    excerpt:
      "mengenal lebih jauh dunia parfum niche dan bagaimana menemukan aroma yang paling merepresentasikan karakter unik anda tanpa harus blind buy.",
    author: "alsa fragrance",
    date: "28 mei 2026",
    category: "guide",
    imageUrl: "/NichePerfume.png",
  },
  {
    id: 2,
    title: "Mengenal Istilah Sillage, Projection, dan Longevity (SPL)",
    excerpt:
      "Sering mendengar istilah SPL beast mode? Mari bedah satu per satu apa arti sebenarnya dari ketiga pilar performa parfum ini.",
    author: "Tim Edukasi Saa",
    date: "25 Mei 2026",
    category: "Edukasi",
    imageUrl:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Top 5 Parfum Designer Paling Laris di Tahun Ini",
    excerpt:
      "Dari paduan aroma floral yang elegan hingga woody yang maskulin, ini dia deretan mahakarya desainer yang wajib masuk wishlist Anda.",
    author: "Kolektor Parfum",
    date: "20 Mei 2026",
    category: "Rekomendasi",
    imageUrl:
      "https://images.unsplash.com/photo-1615486171448-4fbcaab2bcab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export const useBlog = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Guide", "Edukasi", "Rekomendasi"];

  // Fitur Filtering Opsional (Sesuai kriteria tugas)
  const filteredBlogs =
    activeCategory === "Semua"
      ? initialBlogs
      : initialBlogs.filter((blog) => blog.category === activeCategory);

  return {
    activeCategory,
    setActiveCategory,
    categories,
    filteredBlogs,
  };
};