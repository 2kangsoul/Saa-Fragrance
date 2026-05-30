import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../src/stores/useAuthStore"; // <-- IMPORT STORE DI SINI

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  // STATE BARU: Untuk mengontrol buka/tutup menu di layar HP
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ambil status login, data user, dan fungsi logout dari Zustand
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* =======================================================================
          HEADER NAVIGASI GLOBAL
          ======================================================================= */}
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

        {/* NAVIGASI DESKTOP (Tetap sembunyi di HP) */}
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
          <Link to="/aboutus" className="hover:text-gray-500 transition-colors">
            About Us
          </Link>
        </nav>

        {/* AREA USER DESKTOP (Tetap sembunyi di HP) */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          {/* LOGIKA PERUBAHAN TAMPILAN HEADER (Ternary Operator) */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-800">
                Hai, {user?.name}
              </span>
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

        {/* =======================================================================
            TOMBOL HAMBURGER KHUSUS HP (Sembunyi di Desktop)
            ======================================================================= */}
        <button
          className="lg:hidden p-2 text-gray-800 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            // Ikon X (Tutup)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          ) : (
            // Ikon Garis Tiga (Buka)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* =======================================================================
            MENU DROPDOWN KHUSUS HP (Muncul saat tombol ditekan)
            ======================================================================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#f4f2ee]/95 backdrop-blur-md shadow-md border-t border-gray-200 flex flex-col px-6 py-6 gap-4 transition-all">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
            >
              Team
            </Link>
            <Link
              to="/aboutus"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-800 font-medium hover:text-gray-500 transition-colors"
            >
              About Us
            </Link>

            <div className="w-full border-t border-gray-300 my-2"></div>

            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <span className="font-medium text-gray-800">
                  Hai, {user?.name}
                </span>
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

      {/* =======================================================================
          KONTEN HALAMAN DINAMIS (Halaman akan berganti di sini)
          ======================================================================= */}
      <main>
        <Outlet />
      </main>

      {/* =======================================================================
          FOOTER GLOBAL
          ======================================================================= */}
      <div className="max-w-7xl mx-auto px-6 py-4 mt-10">
        <hr className="border-t border-gray-300" />
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <img
              src="/SaaFragrance.png"
              alt="Saa Fragrance Logo"
              className="h-10 mb-6 object-contain"
            />
            <div className="flex gap-4 text-gray-600">
              <Link to="#" className="hover:text-black">
                X
              </Link>
              <Link to="#" className="hover:text-black">
                IG
              </Link>
              <Link to="#" className="hover:text-black">
                YT
              </Link>
              <Link to="#" className="hover:text-black">
                IN
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Use cases</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              UI design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              UX design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Wireframing
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Explore</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              Design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Prototyping
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Development features
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Resources</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              Blog
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Best practices
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Colors
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
