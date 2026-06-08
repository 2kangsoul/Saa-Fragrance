import { useState } from "react";

interface SettingsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Sesuaikan dengan tipe data user kamu
}

export default function SettingsAccountModal({ isOpen, onClose, user }: SettingsAccountModalProps) {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // Di sini nanti logika untuk kirim data ke API/Backend
    console.log("Menyimpan data...", { phone, address, password, profilePic });
    onClose(); // Tutup modal setelah save
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl font-bold">
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
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Pic</div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 cursor-pointer"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}