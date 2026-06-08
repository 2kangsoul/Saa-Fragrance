import backendlessApi from '../config/api';

export const getDashboardStats = async () => {
  // Ambil data penjualan terbanyak, total pendapatan, dll.
  // Sesuaikan endpoint dengan nama tabel di Backendless Anda
  const [products, orders] = await Promise.all([
    backendlessApi.get("data/Products?sortBy=soldCount%20DESC&pageSize=5"),
    backendlessApi.get("data/Orders")
  ]);
  
  return {
    topProducts: products.data,
    totalOrders: orders.data.length
  };
};