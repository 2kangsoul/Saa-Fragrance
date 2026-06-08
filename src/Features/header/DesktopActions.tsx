import { useState } from "react";
import { Link } from "react-router-dom";
import type { UseMainLayoutReturn } from "../header/types/MainLayout.types";

// Menambahkan fungsi pop-up register dan account ke dalam tipe props
interface DesktopActionsProps extends UseMainLayoutReturn {
  setIsRegisterModalOpen?: (val: boolean) => void;
  setIsAccountModalOpen?: (val: boolean) => void; // <-- Perbaikan baris 8
}

export default function DesktopActions(props: DesktopActionsProps) {
  const {
    isAuthenticated,
    user,
    logout,
    isManageMenuOpen,
    setIsManageMenuOpen,
    setIsAdminModalOpen,
    setIsPerfumeModalOpen,
    setIsBlogModalOpen,
    setIsRegisterModalOpen,
    setIsAccountModalOpen, // <-- Perbaikan baris 20
  } = props;

  // State lokal untuk mengontrol dropdown akun
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  return (
    <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          
          {/* --- BAGIAN YANG DIUBAH: Dropdown Hai, {user?.name} --- */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="text-sm font-medium text-gray-800 hover:text-gray-600 flex items-center gap-1 cursor-pointer"
            >
              Hai, {user?.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 flex flex-col">
                <button
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (setIsAccountModalOpen) setIsAccountModalOpen(true);
                  }}
                  className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                >
                  ⚙️ Account Setting
                </button>
              </div>
            )}
          </div>
          {/* --- AKHIR BAGIAN YANG DIUBAH --- */}

          {/* LOGIKA ROLE UNTUK DESKTOP */}
          {user?.role === "owner" || user?.role === "admin" ? (
            <div className="relative">
              <button
                onClick={() => setIsManageMenuOpen(!isManageMenuOpen)}
                className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md"
              >
                Manage
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isManageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 flex flex-col">
                  <button
                    onClick={() => {
                      setIsManageMenuOpen(false);
                      setIsPerfumeModalOpen(true);
                    }}
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                  >
                    📦 Manage Parfume
                  </button>

                  <button
                    onClick={() => {
                      setIsManageMenuOpen(false);
                      setIsBlogModalOpen(true);
                    }}
                    className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium border-t border-gray-100"
                  >
                    ✍️ Manage Blog
                  </button>

                  {user?.role === "owner" && (
                    <button
                      onClick={() => {
                        setIsManageMenuOpen(false);
                        setIsAdminModalOpen(true);
                      }}
                      className="text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100"
                    >
                      ⚙️ Setting Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsBlogModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md"
            >
              ✍️ Manage Blog
            </button>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 text-red-500 font-bold hover:bg-red-50 hover:text-red-700 transition-colors rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <Link
            to="/login"
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
          
          <button
            onClick={() =>
              setIsRegisterModalOpen && setIsRegisterModalOpen(true)
            }
            className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
}