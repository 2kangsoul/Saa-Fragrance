// File: src/Features/product/components/componentLogin.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { ComponentLoginProps } from "../types/loginTypes"; // Import Type dari file terpisah

const ComponentLogin: React.FC<ComponentLoginProps> = ({
  showLoginModal,
  setShowLoginModal,
}) => {
  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="bg-white relative rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:bg-gray-100"
          onClick={() => setShowLoginModal(false)}
        >
          ✕
        </button>

        <div className="text-center mb-6 mt-2">
          <h3 className="font-bold text-2xl text-gray-900 mb-2">
            Sign in required
          </h3>
          <p className="text-sm text-gray-500">
            Silakan masuk untuk menambahkan parfum incaran ke keranjang Anda.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="label text-xs font-semibold text-gray-600 px-1 py-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="label text-xs font-semibold text-gray-600 px-1 py-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan kata sandi"
              className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400"
            />
          </div>

          <button className="btn bg-gray-900 text-white hover:bg-black border-none w-full mt-4 rounded-xl cursor-pointer active:scale-95">
            Sign in
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-gray-900 font-bold hover:underline transition-all"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComponentLogin;