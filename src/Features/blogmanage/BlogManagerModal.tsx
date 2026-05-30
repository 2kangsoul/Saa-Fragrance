import React, { useState } from "react";
import toast from "react-hot-toast";
import backendlessApi from "../../config/api";

interface BlogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BlogManagerModal({
  isOpen,
  onClose,
}: BlogManagerModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Niche",
    excerpt: "",
    author: "",
    imageUrl: "", // Gambar 1 (Cover Utama)
    imageUrl2: "", // Gambar 2
    imageUrl3: "", // Gambar 3
    referenceLink: "",
    content: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi Menembak API Groq Llama 3.3
  const handleGenerateAI = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Judul dan Kategori wajib diisi sebagai acuan AI!");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading(
      "AI Llama 3.3 sedang meracik artikel...",
    );

    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          excerpt: formData.excerpt,
          author: formData.author,
          referenceLink: formData.referenceLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghubungi AI");
      }

      // Memasukkan hasil tulisan AI ke Textarea Content
      setFormData((prev) => ({ ...prev, content: data.content }));
      toast.success("Artikel berhasil ditulis oleh AI!", { id: loadingToast });
    } catch (error: any) {
      console.error("AI Error:", error);
      toast.error("Gagal men-generate artikel.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  // Fungsi Menyimpan ke Backendless
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Judul dan Konten tidak boleh kosong!");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Menyimpan ke database...");

    try {
      const currentDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await backendlessApi.post("data/Blogs", {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        author: formData.author,
        imageUrl: formData.imageUrl,
        imageUrl2: formData.imageUrl2, // Tambahan
        imageUrl3: formData.imageUrl3, // Tambahan
        content: formData.content,
        publishDate: currentDate,
      });

      // Jangan lupa update bagian reset form di bawahnya:
      setFormData({
        title: "",
        category: "Niche",
        excerpt: "",
        author: "",
        imageUrl: "",
        imageUrl2: "", // Reset
        imageUrl3: "", // Reset
        referenceLink: "",
        content: "",
      });

      // Tutup modal
      onClose();
    } catch (error: any) {
      console.error("Database Error:", error);
      toast.error("Gagal menyimpan ke database.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Container Modal */}
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 py-5 border-b border-gray-100 shrink-0 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ✍️ Pembuat Artikel Blog AI
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Isi referensi singkat, biarkan Llama 3.3 merangkai sisanya.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* KOLOM KIRI: Input Data Dasar */}
            <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 pb-10">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Judul Artikel *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="Contoh: Sejarah Parfum Niche"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Kategori *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm bg-white"
                  >
                    <option value="Niche">Niche</option>
                    <option value="Designer">Designer</option>
                    <option value="Tips">Tips</option>
                    <option value="Review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                    placeholder="Nama Anda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Ringkasan (Excerpt)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm resize-none"
                  placeholder="Teks singkat yang muncul di kartu blog..."
                />
              </div>

              {/* Gambar 1 (Cover Utama) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Gambar Cover *
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="https://... (Cover Utama)"
                />
              </div>

              {/* Gambar 2 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Gambar 2 (Opsional)
                </label>
                <input
                  type="text"
                  name="imageUrl2"
                  value={formData.imageUrl2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Gambar 3 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Gambar 3 (Opsional)
                </label>
                <input
                  type="text"
                  name="imageUrl3"
                  value={formData.imageUrl3}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Link Referensi (Bahan AI)
                </label>
                <input
                  type="text"
                  name="referenceLink"
                  value={formData.referenceLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                  placeholder="URL artikel/web untuk bahan bacaan AI"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-[#F58427] to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <span className="animate-pulse">
                    ✨ AI Sedang Berpikir...
                  </span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Generate Konten AI
                  </>
                )}
              </button>
            </div>

            {/* KOLOM KANAN: FULL REVIEW (Gambar + Textarea) */}
            <div className="lg:col-span-8 flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Full Review (Preview)
                </span>
              </div>

              {/* Area Dalam yang bisa di-scroll */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* PREVIEW GAMBAR COVER */}
                {formData.imageUrl ? (
                  <div className="w-full h-48 md:h-72 rounded-xl overflow-hidden shadow-sm shrink-0 relative group border border-gray-100 bg-gray-50">
                    <img
                      src={formData.imageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/800x400?text=Gambar+Tidak+Valid/Rusak";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      Cover Image
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 shrink-0 bg-gray-50/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-2 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-medium">
                      Preview gambar cover akan muncul di sini...
                    </span>
                  </div>
                )}

                {/* TEXTAREA EDITOR */}
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full min-h-[300px] flex-1 focus:outline-none focus:ring-0 text-sm text-gray-800 leading-relaxed resize-none bg-transparent"
                  placeholder="Hasil Full Review dari AI akan muncul di sini. Anda bisa membaca keseluruhannya dan mengeditnya secara manual sebelum diterbitkan..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: Tombol Simpan */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={handleSaveBlog}
            disabled={isSaving}
            className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSaving ? "Menerbitkan..." : "Terbitkan Artikel"}
          </button>
        </div>
      </div>
    </div>
  );
}