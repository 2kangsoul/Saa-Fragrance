// File: src/App.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./Features/landingpages/components/MainLayout";
import Home from "./Features/landingpages/components/Home";
import Products from "./page/Products";
import ChatBot from "./Features/chatbot/Components/ChatBot"; // Import Komponen ChatBot Global

function App() {
  return (
    <>
      <Routes>
        {/* MainLayout akan membungkus semua halaman yang berada di dalam dirinya (Header & Footer) */}
        <Route path="/" element={<MainLayout />}>
          {/* Halaman utama (Landing Page) saat url "localhost:5173/" */}
          <Route index element={<Home />} />

          {/* Halaman Produk saat url "localhost:5173/products" */}
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>

      {/* Floating ChatBot Global yang akan muncul di setiap halaman */}
      <ChatBot />
    </>
  );
}

export default App;