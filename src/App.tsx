import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Layout
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./Features/header/component/MainLayout"; // <-- TAMBAHAN IMPORT MAINLAYOUT

// Import Halaman
import Home from "./Features/landingpages/components/Home";
import Products from "./page/Products";
import LoginPage from "./page/loginpage";
import Team from "./page/Team";
import Blog from "./page/Blog";
import ChatBot from "./Features/chatbot/Components/ChatBot";
import NicheGuide from "./page/niche";

function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* MainLayout membungkus SEMUA rute agar Header dan Footer selalu muncul */}
        <Route element={<MainLayout />}>
          {/* Rute Bebas (Bisa diakses tanpa login) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/niche" element={<NicheGuide />} />

          {/* Rute Terlindungi (Wajib Login, dicegat oleh AuthLayout) */}
          <Route element={<AuthLayout />}>
            <Route path="/products" element={<Products />} />
          </Route>
        </Route>
      </Routes>

      <ChatBot />
    </>
  );
}

export default App;
