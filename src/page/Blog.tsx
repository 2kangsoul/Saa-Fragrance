import { useBlog } from "../Features/blog/hooks/useBlog" // Sesuaikan path
import BlogFilter from "../Features/blog/component/BlogFilter" 
import BlogCard from "../Features/blog/component/BlogCard" // Sesuaikan path

export default function Blog() {
  // Memanggil semua data dan logika dari custom hook
  const { activeCategory, setActiveCategory, categories, filteredBlogs } = useBlog();

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

        {/* GRID LAYOUT UNTUK BLOG KARTU */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
        
      </div>
    </div>
  );
}