export interface BlogPost {
  id: string | number; // <-- Ubah baris ini agar kebal error
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string;
  imageUrl2?: string; // Tambahkan ini
  imageUrl3?: string; // Tambahkan ini
}
