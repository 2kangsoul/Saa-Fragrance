import type { BlogPost } from "../types/blogTypes"; 

interface BlogReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogPost | null;
}

export default function BlogReadModal({ isOpen, onClose, blog }: BlogReadModalProps) {
  if (!isOpen || !blog) return null;

  const authorName = blog.author || "Saa Editor";
  const initial = authorName.charAt(0).toUpperCase();

  // Ambil tipe bypass untuk menghindari error TypeScript
  const safeBlog = blog as any; 

  // --- LOGIKA PEMOTONG TEKS ---
  // Kita akan membagi teks menjadi 3 bagian untuk diselipkan gambar
  const contentStr = safeBlog.content || "";
  const totalLength = contentStr.length;
  
  const part1End = Math.floor(totalLength / 3);
  const part2End = Math.floor((totalLength / 3) * 2);

  // Mencari jeda baris/enter terdekat agar teks tidak terpotong di tengah kalimat
  const safePart1End = contentStr.indexOf("\n\n", part1End) !== -1 ? contentStr.indexOf("\n\n", part1End) : part1End;
  const safePart2End = contentStr.indexOf("\n\n", part2End) !== -1 ? contentStr.indexOf("\n\n", part2End) : part2End;

  const textPart1 = contentStr.substring(0, safePart1End);
  const textPart2 = contentStr.substring(safePart1End, safePart2End);
  const textPart3 = contentStr.substring(safePart2End);
  // -----------------------------

  // --- LOGIKA PEMBEDA UKURAN TEKS (BARU) ---
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Jika baris kosong (enter), buat jarak spasi
      if (!line.trim()) return <span key={i} className="block h-4"></span>;
      
      // Deteksi jika baris ini adalah sub-judul (semua huruf KAPITAL)
      const isHeading = line === line.toUpperCase() && /[A-Z]/.test(line);
      
      if (isHeading) {
        // KOTAK BIRU: Diperbesar sedikit dan ditebalkan
        return (
          <span key={i} className="block text-lg md:text-xl font-bold text-gray-900 font-sans mt-8 mb-2">
            {line}
          </span>
        );
      }
      
      // KOTAK KUNING: Diperkecil sedikit (teks paragraf normal)
      return (
        <span key={i} className="block text-sm md:text-base text-gray-800 leading-loose mb-2">
          {line}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white rounded-full p-2 hover:bg-red-500 z-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto w-full h-full bg-[#fcfbf9]">
          
          {/* 1. GAMBAR COVER UTAMA */}
          <div className="h-64 md:h-96 w-full relative">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
              <span className="w-max bg-[#F58427] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md mb-4">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {initial}
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{authorName}</p>
                <p className="text-sm text-gray-500">{blog.date}</p>
              </div>
            </div>

            {/* 2. TEKS BAGIAN 1 */}
            <div className="font-serif">
              {formatContent(textPart1)}
            </div>

            {/* 3. GAMBAR KEDUA (Diperkecil / Lebar 70% di tengah) */}
            {safeBlog.imageUrl2 && (
              <div className="my-10 flex justify-center">
                <img 
                  src={safeBlog.imageUrl2} 
                  alt="Ilustrasi 2" 
                  className="w-full md:w-3/4 max-h-[400px] rounded-2xl shadow-lg object-cover border border-gray-100"
                />
              </div>
            )}

            {/* 4. TEKS BAGIAN 2 */}
            <div className="font-serif">
              {formatContent(textPart2)}
            </div>

            {/* 5. GAMBAR KETIGA (Diperkecil / Lebar 70% di tengah) */}
            {safeBlog.imageUrl3 && (
              <div className="my-10 flex justify-center">
                <img 
                  src={safeBlog.imageUrl3} 
                  alt="Ilustrasi 3" 
                  className="w-full md:w-3/4 max-h-[400px] rounded-2xl shadow-lg object-cover border border-gray-100"
                />
              </div>
            )}

            {/* 6. TEKS BAGIAN 3 (AKHIR) */}
            <div className="font-serif">
              {formatContent(textPart3)}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}