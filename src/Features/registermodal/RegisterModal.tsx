import React, { useState } from "react";
import  backendlessApi  from "../../config/api"

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noHandphone, setNoHandphone] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Langsung daftar tanpa OTP manual
      await backendlessApi.post('users/register', {
        email,
        password,
        name,
        no_handphone: noHandphone,
        role: "user"
      });

      alert("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi akun.");
      onClose();
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (error: any) {
      console.error("Gagal mendaftar:", error);
      alert(error.response?.data?.message || "Gagal mendaftar. Email mungkin sudah terdaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Buat Akun</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" placeholder="Nama Lengkap" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="tel" placeholder="Nomor Handphone" required value={noHandphone} onChange={(e) => setNoHandphone(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-gray-900 text-white rounded-lg">
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
}