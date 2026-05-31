import type { BlogPost } from "../types/blogTypes";

interface BlogCardProps {
  blog: BlogPost;
  onReadMore: (blog: BlogPost) => void;
}

export default function BlogCard({ blog, onReadMore }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 transition-transform duration-300 flex flex-col h-full group">
      {/* IMAGE - Tinggi diperkecil */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-[#F58427]">
          {blog.category}
        </div>
      </div>

      {/* KONTEN ARTIKEL - Jarak dan ukuran teks diperkecil */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2 font-medium">
          <span>
            Oleh: <span className="text-gray-700">{blog.author}</span>
          </span>
          <span>{blog.date}</span>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
          {blog.title}
        </h2>

        {/* --- PERBAIKAN: Menambahkan 'text-justify' di sini --- */}
        <p className="text-xs text-justify text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>

        {/* TOMBOL - Dibuat lebih ramping */}
        <button
          onClick={() => onReadMore(blog)}
          className="inline-flex items-center justify-center w-full py-2.5 bg-gray-50 text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-200 hover:bg-gray-900 hover:text-white transition-colors group/btn"
        >
          Baca Selengkapnya
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 ml-1.5 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}