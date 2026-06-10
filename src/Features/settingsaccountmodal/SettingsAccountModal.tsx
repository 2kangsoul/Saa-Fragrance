import { useState } from "react";
import backendlessApi from "../../config/api"; // Sesuaikan path ini dengan lokasi file api.ts kamu

interface SettingsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Sesuaikan dengan tipe data user kamu
}

export default function SettingsAccountModal({ isOpen, onClose, user }: SettingsAccountModalProps) {
  // Mengambil data default dari user agar form tidak kosong jika data sudah ada
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let userId = user?.objectId || user?.id;

      // Karena console.log membuktikan objectId tidak terbawa dari state login,
      // kita otomatis cari tahu objectId-nya ke database Backendless menggunakan email user!
      if (!userId && user?.email) {
        const userFetchRes = await backendlessApi.get(`data/Users?where=email%3D'${user.email}'`);
        if (userFetchRes.data && userFetchRes.data.length > 0) {
          userId = userFetchRes.data[0].objectId;
        }
      }

      // Validasi terakhir, jika gagal mencari ID
      if (!userId) {
        alert("Error: Gagal memverifikasi ID pengguna. Silakan logout dan login ulang.");
        setIsLoading(false);
        return;
      }

      let profilePicUrl = user.profilePic || "";

      // 1. Jika ada file foto baru yang dipilih, unggah ke Backendless Storage
      if (profilePic) {
        const fileName = `${Date.now()}-${profilePic.name.replace(/\s+/g, '-')}`;
        const formData = new FormData();
        formData.append("upload", profilePic);

        // API Endpoint Backendless untuk upload file
        const uploadRes: any = await backendlessApi.post(
          `files/profile_pictures/${fileName}?overwrite=true`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        // Mengambil link URL secara aman
        profilePicUrl = uploadRes.data?.fileURL || uploadRes.fileURL; 
      }

      // 2. Siapkan data yang akan di-update ke tabel Users
      // --- PERBAIKAN DI SINI: MENAMBAHKAN EMAIL & NAME ---
      const userToUpdate: any = {
        email: user.email, // WAJIB DIKIRIM karena Backendless meminta kolom identity
        name: user.name,   // Dikirim jaga-jaga jika diset Required di database
        phone: phone,
        address: address,
        profilePic: profilePicUrl,
      };

      // Jika kolom password diisi (tidak kosong), ikutkan untuk diganti
      if (password.trim() !== "") {
        userToUpdate.password = password;
      }

      // 3. Update data ke tabel Users berdasarkan userId yang sudah berhasil didapatkan
      await backendlessApi.put(`data/Users/${userId}`, userToUpdate);

      alert("Profile updated successfully!");
      onClose(); // Tutup modal setelah save
      window.location.reload(); // Refresh halaman agar data terbaru langsung muncul

    } catch (error: any) {
      console.error("Gagal menyimpan data:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error updating profile: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-500 hover:text-red-500 text-xl font-bold">
            &times;
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-4">
          {/* Upload Foto Profil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                {profilePic ? (
                  <img src={URL.createObjectURL(profilePic)} alt="Preview" className="w-full h-full object-cover" />
                ) : user?.profilePic ? (
                  <img src={user.profilePic} alt="Current Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Pic</div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                disabled={isLoading}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>

          {/* Input Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text" 
              placeholder="e.g. 08123456789" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
          </div>

          {/* Input Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              placeholder="Enter your full address" 
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none disabled:bg-gray-100"
            ></textarea>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}