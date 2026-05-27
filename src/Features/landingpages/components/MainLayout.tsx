import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        className={`flex justify-between items-center px-6 py-2 sticky top-0 z-50 transition-all duration-500 ${
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
          <Link to="/aboutus" className="hover:text-gray-500 transition-colors">
            About Us
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          <Link
            to="/signin"
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
        </div>
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
              src="https://via.placeholder.com/40x40?text=Logo"
              alt="Logo"
              className="h-8 mb-6"
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
