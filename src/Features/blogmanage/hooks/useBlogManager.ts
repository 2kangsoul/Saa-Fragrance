import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { BlogFormData, BlogItem } from "../types/blogManagerTypes";
import {
  fetchBlogsApi,
  deleteBlogApi,
  createBlogApi,
  updateBlogApi,
  generateBlogAIApi,
} from "../api/blogManagerApi";

export const useBlogManager = (isOpen: boolean) => {
  const [activeTab, setActiveTab] = useState<"ai" | "manage">("ai");
  const [pendingPage, setPendingPage] = useState(1);
  const [publishedPage, setPublishedPage] = useState(1);

  // STATE UNTUK OTORISASI ROLE & STATUS
  const [userRole, setUserRole] = useState<string>("user");
  const [isEditingPending, setIsEditingPending] = useState(false);

  // STATE UNTUK DATA ASLI DARI BACKENDLESS
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    category: "Niche",
    excerpt: "",
    author: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    referenceLink: "",
    content: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAdminOrOwner = userRole === "owner" || userRole === "admin";

  const fetchBlogs = async () => {
    setIsLoadingBlogs(true);
    try {
      const fetchedData = await fetchBlogsApi();
      setBlogs(fetchedData);
    } catch (error) {
      console.error("Gagal menarik data:", error);
      toast.error("Gagal memuat data blog dari database.");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlogs();
      setActiveTab("ai");

      try {
        const userStr = localStorage.getItem("user");
        const authStr = localStorage.getItem("auth-storage");

        if (userStr) {
          setUserRole(JSON.parse(userStr)?.role || "user");
        } else if (authStr) {
          setUserRole(JSON.parse(authStr)?.state?.user?.role || "user");
        }
      } catch (error) {
        console.error("Gagal membaca role user", error);
      }
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (blog: BlogItem) => {
    setFormData({
      title: blog.title || "",
      category: blog.category || "Niche",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      imageUrl: blog.imageUrl || "",
      imageUrl2: blog.imageUrl2 || "",
      imageUrl3: blog.imageUrl3 || "",
      referenceLink: "",
      content: blog.content || "",
    });
    setEditId(blog.objectId);
    setIsEditingPending(blog.approval === false || blog.approval == null);
    setActiveTab("ai");
  };

  const handleDeleteClick = async (objectId: string) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus/menolak artikel ini secara permanen?",
      )
    )
      return;

    const loadingToast = toast.loading("Memproses...");
    try {
      await deleteBlogApi(objectId);
      toast.success("Artikel berhasil dihapus!", { id: loadingToast });

      setTimeout(() => {
        fetchBlogs();
        window.dispatchEvent(new Event("refreshBlogs"));
      }, 500);
    } catch (error) {
      console.error("Gagal menghapus:", error);
      toast.error("Gagal menghapus artikel.", { id: loadingToast });
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Judul dan Kategori wajib diisi sebagai acuan AI!");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("AI Llama 3.3 sedang meracik artikel...");

    try {
      const data = await generateBlogAIApi({
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        author: formData.author,
        referenceLink: formData.referenceLink,
      });

      setFormData((prev) => ({ ...prev, content: data.content }));
      toast.success("Artikel berhasil ditulis oleh AI!", { id: loadingToast });
    } catch (error: any) {
      console.error("AI Error:", error);
      toast.error("Gagal men-generate artikel.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Judul dan Konten tidak boleh kosong!");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading(
      editId ? "Memperbarui artikel..." : "Menyimpan ke database...",
    );

    try {
      const currentDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const payload: any = {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        author: formData.author,
        imageUrl: formData.imageUrl,
        imageUrl2: formData.imageUrl2,
        imageUrl3: formData.imageUrl3,
        content: formData.content,
      };

      if (editId) {
        if (isEditingPending && isAdminOrOwner) {
          payload.approval = true;
          payload.publishDate = currentDate;
        }
        await updateBlogApi(editId, payload);
        toast.success(
          isEditingPending
            ? "Artikel berhasil di-Approve & Diterbitkan!"
            : "Artikel berhasil diperbarui!",
          { id: loadingToast },
        );
      } else {
        payload.approval = isAdminOrOwner ? true : false;
        payload.publishDate = currentDate;

        await createBlogApi(payload);
        toast.success(
          isAdminOrOwner
            ? "Artikel berhasil diterbitkan!"
            : "Artikel berhasil dikirim untuk review Admin!",
          { id: loadingToast },
        );
      }

      setFormData({
        title: "",
        category: "Niche",
        excerpt: "",
        author: "",
        imageUrl: "",
        imageUrl2: "",
        imageUrl3: "",
        referenceLink: "",
        content: "",
      });
      setEditId(null);
      setIsEditingPending(false);

      setTimeout(() => {
        fetchBlogs();
        window.dispatchEvent(new Event("refreshBlogs"));
      }, 500);

      if (isAdminOrOwner) setActiveTab("manage");
    } catch (error: any) {
      console.error("Database Error:", error);
      toast.error("Gagal menyimpan ke database.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setIsEditingPending(false);
    setFormData({
      title: "",
      category: "Niche",
      excerpt: "",
      author: "",
      imageUrl: "",
      imageUrl2: "",
      imageUrl3: "",
      referenceLink: "",
      content: "",
    });
  };

  // LOGIKA PAGINASI (Diekstrak dari komponen agar UI lebih bersih)
  const pendingBlogs = blogs.filter(
    (b) => b.approval === false || b.approval == null,
  );
  const publishedBlogs = blogs.filter((b) => b.approval === true);

  const totalPendingPages = Math.ceil(pendingBlogs.length / 5) || 1;
  const currentPending = pendingBlogs.slice(
    (pendingPage - 1) * 5,
    pendingPage * 5,
  );

  const totalPublishedPages = Math.ceil(publishedBlogs.length / 4) || 1;
  const currentPublished = publishedBlogs.slice(
    (publishedPage - 1) * 4,
    publishedPage * 4,
  );

  return {
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
  };
};