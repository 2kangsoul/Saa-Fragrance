/// <reference types="node" />
import Groq from "groq-sdk";

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

    // 1. AMBIL DATA DARI BACKENDLESS (Tidak Diubah Sama Sekali!)
    const baseUrl = process.env.VITE_BACKENDLESS_API_URL || "https://api.backendless.com";
    const appId = process.env.VITE_BACKENDLESS_APP_ID || "";
    const apiKey = process.env.VITE_BACKENDLESS_REST_API_KEY || "";
    const tableName = "Product"; 
    
    const fetchUrl = `${baseUrl}/${appId}/${apiKey}/data/${tableName}?pageSize=50`;
    const dbResponse = await fetch(fetchUrl);
    const dbData = await dbResponse.json();

    if (!dbResponse.ok) {
      console.error("Gagal Mengambil Database:", dbData);
    }

    // 2. OLAH DATA STOK (Tidak Diubah Sama Sekali!)
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

    // 3. INSTRUKSI KE AI (Sama persis, format teks tebal tetap dijaga)
    const systemInstruction = `Kamu adalah asisten ahli parfum bernama Fragrance AI.
    Tugas utamamu HANYA menjawab pertanyaan seputar parfum, notes (top, heart, base), performa SPL, dan memberikan rekomendasi parfum. 
    Jika user bertanya hal di luar dunia parfum, tolak dengan sopan.

    DAFTAR PRODUK TOKO KAMI YANG READY STOK:
    ${productList}

    ATURAN MUTLAK REKOMENDASI: 
    1. Jika "DAFTAR PRODUK TOKO KAMI YANG READY STOK" berisi "KOSONG", kamu WAJIB menjawab: "Mohon maaf, saat ini kami tidak dapat menarik data stok atau semua produk sedang habis." dan JANGAN merekomendasikan parfum apapun.
    2. Kamu HANYA BOLEH merekomendasikan parfum yang ada di dalam "DAFTAR PRODUK" di atas.
    3. Awali dengan: "Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :"
    4. Lalu berikan jarak 2 baris baru (ENTER 2x) dan tulis MAKSIMAL 3 POIN dengan format cetakan wajib seperti di bawah ini (Nama brand WAJIB tebal menggunakan bintang ganda **):
    
    1. **[Nama Brand dari tabel]** - [Buat penjelasan elegan dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)
    
    2. **[Nama Brand dari tabel]** - [Buat penjelasan elegan dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)
    
    3. **[Nama Brand dari tabel]** - [Buat penjelasan elegan dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)`;

    // 4. INISIALISASI GROQ API (Pengganti Gemini)
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    // Menyusun riwayat chat untuk Groq
    const groqMessages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg: any) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    // Memanggil model Llama 3 yang super cepat dan gratis
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama3-8b-8192", 
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error AI Chat:", error);
    return new Response(
      JSON.stringify({ message: "Gagal memproses pesan AI", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}