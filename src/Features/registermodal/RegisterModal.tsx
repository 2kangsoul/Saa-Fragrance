import React, { useState } from "react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void; // Opsional: Untuk tombol "Sudah punya akun? Login"
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Masukkan logika integrasi API Register Anda di sini
    console.log("Data Register:", { name, email, password });
    
    // Setelah sukses, bisa panggil onClose() atau arahkan ke login
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Container Modal dengan animasi muncul (fade-in) */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f4f2ee]/30">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Buat Akun</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors shadow-md"
          >
            Daftar Sekarang
          </button>

          {/* Opsi pindah ke Login */}
          {onSwitchToLogin && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-gray-900 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </form>

      </div>
    </div>
  );
}