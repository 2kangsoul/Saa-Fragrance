import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-[#161722] px-4 transition-colors duration-300">
      <div className="text-center">
        {/* Angka 404 Besar */}
        <h1 className="text-9xl font-black text-gray-200 dark:text-[#25273D]">
          404
        </h1>
        
        {/* Pesan Error */}
        <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
          Oops! Halaman tidak ditemukan.
        </h2>
        <p className="mt-4 mb-8 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau memang tidak pernah ada.
        </p>

        {/* Tombol Kembali ke Home */}
        <Link
          to="/"
          className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}