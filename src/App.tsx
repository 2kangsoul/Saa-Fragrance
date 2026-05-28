import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import Layout
import AuthLayout from "./layout/AuthLayout"; 

// Import Halaman
import Home from "./Features/landingpages/components/Home";
import Products from "./page/Products";
import LoginPage from "./page/loginpage";
import ChatBot from "./Features/chatbot/Components/ChatBot";

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
          
          {/* Rute Terlindungi (Wajib Login, diatur otomatis oleh AuthLayout) */}
          <Route path="/products" element={<Products />} />
          
        </Route>
      </Routes>

      <ChatBot />
    </>
  );
}

export default App;