import { useBlogManager } from "../hooks/useBlogManager";
import type { BlogManagerModalProps } from "../types/blogManagerTypes";

export default function BlogManagerModal({
  isOpen,
  onClose,
}: BlogManagerModalProps) {
  const {
    activeTab,
    setActiveTab,
    pendingPage,
    setPendingPage,
    publishedPage,
    setPublishedPage,
    formData,
    handleChange,
    isGenerating,
    isSaving,
    handleGenerateAI,
    handleSaveBlog,
    handleEditClick,
    handleDeleteClick,
    handleCancelEdit,
    editId,
    isEditingPending,
    isAdminOrOwner,
    isLoadingBlogs,
    currentPending,
    totalPendingPages,
    currentPublished,
    totalPublishedPages,
  } = useBlogManager(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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

        {/* HEADER DENGAN TAB KONTROL */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === "ai"
                ? editId
                  ? isEditingPending
                    ? "🔍 Review & Approve Artikel"
                    : "✏️ Mode Edit Artikel"
                  : "✍️ Pembuat Artikel Blog AI"
                : "⚙️ Dashboard Admin Blog"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {activeTab === "ai"
                ? "Isi referensi singkat, biarkan Llama 3.3 merangkai sisanya."
                : "Pusat kontrol untuk meninjau, menyetujui, dan mengelola artikel."}
            </p>
          </div>

          <div className="flex bg-gray-200 p-1 rounded-lg mr-8">
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeTab === "ai"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Generator
            </button>

            {isAdminOrOwner && (
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === "manage"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Blog
              </button>
            )}
          </div>
        </div>

        {/* KONDISI TAB AI GENERATOR */}
        {activeTab === "ai" ? (
          <>
            <div className="flex-1 overflow-hidden p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* KOLOM KIRI */}
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
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      URL Gambar Cover (Utama) *
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                      placeholder="https://..."
                    />
                  </div>
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
                      <>Generate Konten AI</>
                    )}
                  </button>
                </div>

                {/* KOLOM KANAN */}
                <div className="lg:col-span-8 flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 shrink-0">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Full Review (Preview)
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
                      {formData.imageUrl && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                          <img
                            src={formData.imageUrl}
                            className="w-full h-full object-cover"
                            alt="Preview 1"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/400x225?text=Error")
                            }
                          />{" "}
                          <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                            Cover
                          </div>
                        </div>
                      )}
                      {formData.imageUrl2 && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                          <img
                            src={formData.imageUrl2}
                            className="w-full h-full object-cover"
                            alt="Preview 2"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/400x225?text=Error")
                            }
                          />{" "}
                          <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                            Image 2
                          </div>
                        </div>
                      )}
                      {formData.imageUrl3 && (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                          <img
                            src={formData.imageUrl3}
                            className="w-full h-full object-cover"
                            alt="Preview 3"
                            onError={(e) =>
                              (e.currentTarget.src =
                                "https://via.placeholder.com/400x225?text=Error")
                            }
                          />{" "}
                          <div className="absolute top-2 left-2 bg-black/60 text-[8px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                            Image 3
                          </div>
                        </div>
                      )}
                    </div>
                    {!formData.imageUrl &&
                      !formData.imageUrl2 &&
                      !formData.imageUrl3 && (
                        <div className="w-full h-24 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-400 shrink-0 text-xs italic">
                          Belum ada URL gambar yang dimasukkan...
                        </div>
                      )}
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full min-h-[400px] flex-1 focus:outline-none focus:ring-0 text-sm text-gray-800 leading-relaxed resize-none bg-transparent font-serif"
                      placeholder="Hasil AI akan muncul di sini. Anda bisa mengeditnya..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              {editId && isAdminOrOwner && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-bold rounded hover:bg-gray-300 transition-colors"
                >
                  Batal Edit
                </button>
              )}
              <button
                onClick={handleSaveBlog}
                disabled={isSaving}
                className="px-8 py-2.5 bg-gray-900 text-white text-sm font-bold rounded hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSaving
                  ? "Menyimpan..."
                  : editId
                    ? isEditingPending
                      ? "Terbitkan Artikel (Approve)"
                      : "Perbarui Artikel"
                    : isAdminOrOwner
                      ? "Terbitkan Artikel"
                      : "Ajukan Artikel (Review)"}
              </button>
            </div>
          </>
        ) : (
          /* KONDISI TAB MANAGE BLOG */
          <div className="flex-1 overflow-hidden p-6 bg-[#f4f2ee]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
              {/* KOLOM KIRI (APPROVAL BLOG) */}
              <div className="lg:col-span-5 flex flex-col h-full border border-red-200 rounded-xl overflow-hidden bg-white shadow-md">
                <div className="bg-red-50 px-4 py-3 border-b border-red-200 shrink-0">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    Approval Blog
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {currentPending.length > 0 ? (
                    currentPending.map((item) => (
                      <div
                        key={item.objectId}
                        className="p-4 border border-gray-100 rounded-lg flex justify-between items-center shadow-sm hover:border-red-300 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-800 mb-1">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            Oleh: {item.author || "User"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-4 py-2 bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-900 transition-colors shadow-sm"
                          >
                            Full Review
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.objectId)}
                            className="px-4 py-2 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-200 transition-colors shadow-sm"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        Belum ada pengajuan artikel baru...
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                  <button
                    onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                    disabled={pendingPage === 1}
                    className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-xs text-gray-500 font-medium">
                    Page {pendingPage} of {totalPendingPages}
                  </span>
                  <button
                    onClick={() =>
                      setPendingPage((p) => Math.min(totalPendingPages, p + 1))
                    }
                    disabled={pendingPage === totalPendingPages}
                    className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* KOLOM KANAN (MANAGE BLOG) */}
              <div className="lg:col-span-7 flex flex-col h-full border border-blue-200 rounded-xl overflow-hidden bg-white shadow-md">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 shrink-0">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Manage Blog
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
                  {isLoadingBlogs ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                      <span className="animate-pulse font-bold text-blue-600">
                        Memuat Data...
                      </span>
                    </div>
                  ) : currentPublished.length > 0 ? (
                    currentPublished.map((blog) => (
                      <div
                        key={blog.objectId}
                        className="p-4 border border-gray-100 rounded-lg flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-800 mb-1 line-clamp-1 pr-4">
                            {blog.title}
                          </p>
                          <div className="flex gap-2 items-center">
                            <span className="text-[9px] bg-gray-900 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {blog.category}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {blog.publishDate || "Tanggal tidak diketahui"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditClick(blog)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-yellow-200 transition-colors shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(blog.objectId)}
                            className="px-4 py-2 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-200 transition-colors shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                      <span className="text-xs font-medium">
                        Data blog Anda masih kosong.
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                  <button
                    onClick={() => setPublishedPage((p) => Math.max(1, p - 1))}
                    disabled={publishedPage === 1}
                    className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="text-xs text-gray-500 font-medium">
                    Page {publishedPage} of {totalPublishedPages}
                  </span>
                  <button
                    onClick={() =>
                      setPublishedPage((p) =>
                        Math.min(totalPublishedPages, p + 1),
                      )
                    }
                    disabled={publishedPage === totalPublishedPages}
                    className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}