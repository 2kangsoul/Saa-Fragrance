import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Layout
import AuthLayout from "./layout/AuthLayout"; 

// Import Halaman
import Home from "./Features/landingpages/components/Home";
import Products from "./page/Products";
import LoginPage from "./page/loginpage";
import Team from "./page/Team"; 
import Blog from "./page/Blog"; // <-- TAMBAHAN IMPORT BLOG DI SINI
import ChatBot from "./Features/chatbot/Components/ChatBot";
import NicheGuide from "./page/niche";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      
      <Routes>
        {/* AuthLayout SEKARANG MEMBUNGKUS SELURUH APLIKASI */}
        <Route element={<AuthLayout />}>
          
          {/* Rute Bebas (Bisa diakses sebelum login) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/team" element={<Team />} /> 
          <Route path="/blog" element={<Blog />} />
          <Route path="/niche" element={<NicheGuide />} /> {/* <-- TAMBAHAN ROUTE BLOG DI SINI */}
          
          {/* Rute Terlindungi (Wajib Login, diatur otomatis oleh AuthLayout) */}
          <Route path="/products" element={<Products />} />
          
        </Route>
      </Routes>

      <ChatBot />
    </>
  );
}

export default App;