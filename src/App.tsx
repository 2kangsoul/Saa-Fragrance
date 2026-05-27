import { Routes, Route } from "react-router-dom";
import MainLayout from "./Features/landingpages/components/MainLayout";
import Home from "./Features/landingpages/components/Home";
// 1. Lakukan import komponen Products yang baru saja kita buat
import Products from "./page/Products";

function App() {
  return (
    <Routes>
      {/* MainLayout akan membungkus semua halaman yang berada di dalam dirinya (Header & Footer) */}
      <Route path="/" element={<MainLayout />}>
        {/* Halaman utama (Landing Page) saat url "localhost:5173/" */}
        <Route index element={<Home />} />

        {/* Halaman Produk saat url "localhost:5173/products" */}
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  );
}

export default App;
