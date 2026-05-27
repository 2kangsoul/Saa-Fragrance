/// <reference types="node" />
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { message, history } = body;

    // 1. AMBIL DATA DARI BACKENDLESS SECARA DINAMIS
    const baseUrl = process.env.VITE_BACKENDLESS_API_URL || "https://api.backendless.com";
    const appId = process.env.VITE_BACKENDLESS_APP_ID || "";
    const apiKey = process.env.VITE_BACKENDLESS_REST_API_KEY || "";
    
    // NAMA TABEL SUDAH DISESUAIKAN PERSIS DENGAN GAMBAR DATABASE ANDA
    const tableName = "Product"; 
    
    const fetchUrl = `${baseUrl}/${appId}/${apiKey}/data/${tableName}?pageSize=50`;
    const dbResponse = await fetch(fetchUrl);
    const dbData = await dbResponse.json();

    if (!dbResponse.ok) {
      console.error("Gagal Mengambil Database:", dbData);
    }

    // 2. OLAH DATA (Menyaring stok > 0 dan membaca array Backendless dengan aman)
    let productList = "KOSONG";
    const records = Array.isArray(dbData) ? dbData : (dbData?.data || []);

    if (records.length > 0) {
      const availableProducts = records
        .filter((item: any) => parseInt(item.stock) > 0)
        .map((item: any) => `- Brand: ${item.brand}, Aroma: ${item.notes}, Stok Tersisa: ${item.stock} botol`)
        .join("\n");
        
      if (availableProducts.length > 0) {
        productList = availableProducts;
      }
    }

    // 3. INSTRUKSI KE AI
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `Kamu adalah asisten ahli parfum bernama Fragrance AI.
      Tugas utamamu HANYA menjawab pertanyaan seputar parfum, notes (top, heart, base), 
      performa SPL (Sillage, Projection, Longevity), dan memberikan rekomendasi parfum. 
      Jika user bertanya hal di luar dunia parfum atau wewangian, tolak dengan sopan.
      PENTING: Jawablah menggunakan teks biasa tanpa format markdown (seperti tanda bintang atau list strip).

      DAFTAR PRODUK TOKO KAMI YANG READY STOK:
      ${productList}

      ATURAN MUTLAK REKOMENDASI: 
      1. Jika "DAFTAR PRODUK TOKO KAMI YANG READY STOK" berisi "KOSONG", kamu WAJIB menjawab: "Mohon maaf, saat ini kami tidak dapat menarik data stok atau semua produk sedang habis." dan JANGAN PERNAH merekomendasikan parfum apapun.
      2. Kamu HANYA BOLEH merekomendasikan parfum yang ada di dalam "DAFTAR PRODUK TOKO KAMI YANG READY STOK" di atas. JANGAN PERNAH menyebutkan brand jika tidak ada di daftar.
      3. Awali dengan: "Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :"
      4. Lalu berikan baris baru (ENTER) dan tulis MAKSIMAL 3 POIN dengan format:
      1. [Nama Brand dari tabel] - [Penjelasan notes sangat singkat] (Tersisa [jumlah stok] botol)
      Lalu berikan baris baru (ENTER)
      2. [Nama Brand dari tabel] - [Penjelasan notes sangat singkat] (Tersisa [jumlah stok] botol)
      Lalu berikan baris baru (ENTER)
      3. [Nama Brand dari tabel] - [Penjelasan notes sangat singkat] (Tersisa [jumlah stok] botol)`,
    });

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error AI Chat:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal memproses pesan AI",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}