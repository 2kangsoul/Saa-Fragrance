import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useMainLayout } from "../hooks/useMainLayout";
import AdminManagerModal from "../../adminmanage/AdminManagerModal";
import PerfumeManagerModal from "../../productmanage/component/PerfumeManagerModal";
import BlogManagerModal from "../../blogmanage/BlogManagerModal"

export default function MainLayout() {
  const {
    isScrolled,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isAuthenticated,
    user,
    logout,
  } = useMainLayout();

  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPerfumeModalOpen, setIsPerfumeModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      <header
        className={`flex justify-between items-center px-6 py-2 sticky top-0 z-50 transition-all duration-500 relative ${
          isScrolled
            ? "bg-[#f4f2ee]/90 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <Link to="/" className="flex-shrink-0">
          <img
            src="/SaaFragrance.png"
            alt="Saa Fragrance Logo"
            className="h-10 object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
          <Link
            to="/products"
            className="hover:text-gray-500 transition-colors"
          >
            Products
          </Link>
          <Link to="/team" className="hover:text-gray-500 transition-colors">
            Team
          </Link>
          <Link to="/blog" className="hover:text-gray-500 transition-colors">
            Blog
          </Link>
          <Link to="/aboutus" className="hover:text-gray-500 transition-colors">
            About Us
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-800">
                Hai, {user?.name}
              </span>

              {/* LOGIKA ROLE UNTUK DESKTOP */}
              {(user?.role === "owner" || user?.role === "admin") ? (
                // Tampilan untuk Owner / Admin (Pakai Dropdown)
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                // Tampilan untuk User Biasa (Langsung Tombol Saja)
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
              <Link
                to="/register"
                className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* TOMBOL MENU MOBILE */}
        <button
          className="lg:hidden p-2 text-gray-800 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#f4f2ee]/95 backdrop-blur-md shadow-md border-t border-gray-200 flex flex-col px-6 py-6 gap-4 transition-all z-50">
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
              Products
            </Link>
            <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
              Team
            </Link>
            <Link to="/aboutus" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium hover:text-gray-500 transition-colors">
              About Us
            </Link>

            <div className="w-full border-t border-gray-300 my-2"></div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <span className="font-medium text-gray-800">
                  Hai, {user?.name}
                </span>

                {/* LOGIKA ROLE UNTUK MOBILE */}
                {(user?.role === "owner" || user?.role === "admin") ? (
                  // Menu Mobile untuk Owner/Admin
                  <div className="flex flex-col gap-3 pl-3 border-l-2 border-gray-300">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsPerfumeModalOpen(true); 
                      }}
                      className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                    >
                      📦 Manage Parfume
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsBlogModalOpen(true); 
                      }}
                      className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                    >
                      ✍️ Manage Blog
                    </button>

                    {user?.role === "owner" && (
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAdminModalOpen(true);
                        }}
                        className="w-max px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors rounded-md text-sm"
                      >
                        ⚙️ Setting Admin
                      </button>
                    )}
                  </div>
                ) : (
                  // Menu Mobile untuk User Biasa
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsBlogModalOpen(true); 
                    }}
                    className="w-max px-4 py-2 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors rounded-md text-sm"
                  >
                    ✍️ Manage Blog
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-max px-4 py-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 transition-colors rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 border border-gray-400 text-gray-800 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* SEMUA MODAL POPUP */}
      <AdminManagerModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <PerfumeManagerModal
        isOpen={isPerfumeModalOpen}
        onClose={() => setIsPerfumeModalOpen(false)}
      />

      <BlogManagerModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-6 py-4 mt-10">
        <hr className="border-t border-gray-300" />
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-sm">
        {/* Konten Footer */}
      </footer>
    </div>
  );
}