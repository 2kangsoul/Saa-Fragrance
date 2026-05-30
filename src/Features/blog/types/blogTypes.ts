export interface BlogPost {
  id: string | number; // <-- Ubah baris ini agar kebal error
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string;
}