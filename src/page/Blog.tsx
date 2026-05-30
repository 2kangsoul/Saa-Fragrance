import { useState } from "react";
import { useBlog } from "../Features/blog/hooks/useBlog"; 
import BlogFilter from "../Features/blog/component/BlogFilter";
import BlogCard from "../Features/blog/component/BlogCard";
import BlogReadModal from "../Features/blog/component/BlogReadModal"; // <-- IMPORT MODAL BARU
import type { BlogPost } from "../Features/blog/types/blogTypes";

export default function Blog() {
  const { activeCategory, setActiveCategory, categories, filteredBlogs, isLoading } = useBlog();
  
  // State untuk mengontrol Modal Baca Artikel
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  // Fungsi saat tombol di kartu diklik
  const handleOpenArticle = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setIsReadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            The Scent Journal
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Eksplorasi cerita, tips, dan wawasan mendalam seputar dunia
            perfumery langsung dari para ahlinya.
          </p>
        </div>

        {/* NAVIGATION / FILTERING */}
        <BlogFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />

        {/* LOADING & GRID KARTU */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            <span className="animate-pulse">Memuat artikel...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                onReadMore={handleOpenArticle} // <-- LEMPAR FUNGSI KE KARTU
              />
            ))}
          </div>
        )}
        
      </div>

      {/* RENDER MODAL BACA ARTIKEL */}
      <BlogReadModal 
        isOpen={isReadModalOpen}
        onClose={() => setIsReadModalOpen(false)}
        blog={selectedBlog}
      />
    </div>
  );
}