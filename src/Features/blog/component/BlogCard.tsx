import type { BlogPost } from "../types/blogTypes";

interface BlogCardProps {
  blog: BlogPost;
  onReadMore: (blog: BlogPost) => void; // <-- TAMBAHAN PROPS INI
}

export default function BlogCard({ blog, onReadMore }: BlogCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full group">
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F58427]">
            {blog.category}
          </span>
        </div>
      </div>

      {/* KONTEN ARTIKEL */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3 font-medium">
          <span>
            Oleh: <span className="text-gray-700">{blog.author}</span>
          </span>
          <span>{blog.date}</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
          {blog.title}
        </h2>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>

        {/* UBAH LINK MENJADI BUTTON */}
        <button
          onClick={() => onReadMore(blog)}
          className="inline-flex items-center justify-center w-full py-3 bg-gray-50 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-gray-200 hover:bg-gray-900 hover:text-white transition-colors group/btn"
        >
          Baca Selengkapnya
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
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