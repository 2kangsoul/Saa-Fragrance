import { Outlet } from "react-router-dom";
import { useMainLayout } from "../hooks/useMainLayout";

import AdminManagerModal from "../../adminmanage/AdminManagerModal";
import PerfumeManagerModal from "../../productmanage/component/PerfumeManagerModal";
import BlogManagerModal from "../../blogmanage/component/BlogManagerModal";

import Header from "../Header";
import Footer from "../footer"

export default function MainLayout() {
  // Ambil semua state dan fungsi dari custom hook
  const layoutState = useMainLayout();

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* Oper seluruh state ke Header menggunakan spread operator */}
      <Header {...layoutState} />

      <main>
        <Outlet />
      </main>

      {/* SEMUA MODAL POPUP */}
      <AdminManagerModal
        isOpen={layoutState.isAdminModalOpen}
        onClose={() => layoutState.setIsAdminModalOpen(false)}
      />

      <PerfumeManagerModal
        isOpen={layoutState.isPerfumeModalOpen}
        onClose={() => layoutState.setIsPerfumeModalOpen(false)}
      />

      <BlogManagerModal
        isOpen={layoutState.isBlogModalOpen}
        onClose={() => layoutState.setIsBlogModalOpen(false)}
      />

      <Footer />
    </div>
  );
}