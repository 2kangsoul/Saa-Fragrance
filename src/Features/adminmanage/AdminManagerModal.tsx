import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import backendlessApi from "../../config/api"; // Sesuaikan jika path-nya berbeda

interface AdminManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminUser {
  objectId: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminManagerModal({
  isOpen,
  onClose,
}: AdminManagerModalProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // State untuk navigasi form sisi kiri
  const [activeForm, setActiveForm] = useState<"new" | "existing">("new");

  // State untuk form tambah admin baru
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // State untuk form jadikan admin (user lama)
  const [existingFormData, setExistingFormData] = useState({
    email: "",
    duration: "permanent",
  });

  // Fungsi mengambil daftar admin dari Backendless
  const fetchAdmins = async () => {
    setIsFetching(true);
    try {
      // Mengambil user yang role-nya spesifik 'admin'
      const res = await backendlessApi.get("data/Users", {
        params: {
          where: "role='admin'",
        },
      });
      setAdmins(res.data);
    } catch (error: any) {
      console.error("Gagal mengambil data admin:", error);
      toast.error("Gagal memuat daftar admin");
    } finally {
      setIsFetching(false);
    }
  };

  // Jalankan fetch saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  // Fungsi Tambah Admin Baru
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      // Endpoint bawaan Backendless untuk register user baru
      await backendlessApi.post("users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "admin", // Otomatis jadikan admin
      });

      toast.success(`Admin ${formData.name} berhasil ditambahkan!`);
      setFormData({ name: "", email: "", password: "" }); // Kosongkan form
      fetchAdmins(); // Refresh tabel
    } catch (error: any) {
      console.error("Gagal menambah admin:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan admin");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Menjadikan User Lama Sebagai Admin
  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingFormData.email) {
      toast.error("Email harus diisi!");
      return;
    }

    setIsLoading(true);
    try {
      // Cari user berdasarkan email
      const res = await backendlessApi.get("data/Users", {
        params: { where: `email='${existingFormData.email}'` },
      });

      if (res.data.length === 0) {
        toast.error("Pengguna dengan email tersebut tidak ditemukan!");
        setIsLoading(false);
        return;
      }

      const user = res.data[0];

      // Update role user tersebut menjadi admin
      await backendlessApi.put(`data/Users/${user.objectId}`, {
        role: "admin",
        adminDuration: existingFormData.duration, // Menyimpan durasi yang dipilih
      });

      toast.success(
        `Berhasil menjadikan ${existingFormData.email} sebagai admin!`,
      );
      setExistingFormData({ email: "", duration: "permanent" }); // Kosongkan form
      fetchAdmins(); // Refresh tabel
    } catch (error: any) {
      console.error("Gagal memproses:", error);
      toast.error("Gagal menjadikan admin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Hapus Admin
  const handleDeleteAdmin = async (objectId: string, adminName: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin mencopot jabatan dan menghapus akun ${adminName}?`,
    );
    if (!confirmDelete) return;

    try {
      await backendlessApi.delete(`data/Users/${objectId}`);
      toast.success(`Admin ${adminName} berhasil dihapus.`);
      fetchAdmins(); // Refresh tabel
    } catch (error: any) {
      console.error("Gagal menghapus admin:", error);
      toast.error("Gagal menghapus admin. Pastikan Anda memiliki izin.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      {/* Container Modal */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
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

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            ⚙️ Manajemen Admin
          </h2>
          <p className="text-sm text-gray-500">
            Kelola akses administrator untuk butik Saa Fragrance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BAGIAN KIRI: Form Dinamis (Tambah Admin / Jadikan Admin) */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-max">
            {/* Tab Navigasi Kiri */}
            <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveForm("new")}
                className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${
                  activeForm === "new"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tambah Admin Baru
              </button>
              <button
                onClick={() => setActiveForm("existing")}
                className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-1 ${
                  activeForm === "existing"
                    ? "bg-white text-gray-900 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Jadikan Admin
                {/* Tanda Panah */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Render Form Berdasarkan Tab yang Aktif */}
            {activeForm === "new" ? (
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Misal: Budi Santoso"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="admin@saafragrance.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "+ Daftarkan Admin"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleMakeAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Pengguna Aktif
                  </label>
                  <input
                    type="email"
                    value={existingFormData.email}
                    onChange={(e) =>
                      setExistingFormData({
                        ...existingFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="email.user@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi Admin
                  </label>
                  <select
                    value={existingFormData.duration}
                    onChange={(e) =>
                      setExistingFormData({
                        ...existingFormData,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm bg-white"
                  >
                    <option value="7 hari">7 Hari</option>
                    <option value="30 hari">30 Hari</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "+ Jadikan Admin"}
                </button>
              </form>
            )}
          </div>

          {/* BAGIAN KANAN: Daftar Admin */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Daftar Admin Aktif
            </h3>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {isFetching ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Memuat data...
                </div>
              ) : admins.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Belum ada admin lain yang terdaftar.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-[350px] overflow-y-auto">
                  {admins.map((admin) => (
                    <li
                      key={admin.objectId}
                      className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {admin.name}
                        </p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteAdmin(admin.objectId, admin.name)
                        }
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Admin"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
