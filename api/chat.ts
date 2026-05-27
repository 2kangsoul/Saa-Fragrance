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

    // 1. AMBIL DATA DARI BACKENDLESS
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

    // 2. OLAH DATA STOK
    let productList = "KOSONG";
    const records = Array.isArray(dbData) ? dbData : (dbData?.data || []);

    if (records.length > 0) {
      const availableProducts = records
        .filter((item: any) => parseInt(item.stock) > 0)
        .map((item: any) => `- Brand: ${item.brand}, Aroma: ${item.notes}, Stok: ${item.stock}`)
        .join("\n");
        
      if (availableProducts.length > 0) {
        productList = availableProducts;
      }
    }

    // 3. INSTRUKSI KE AI (Diperketat Khusus untuk Llama Groq)
    const systemInstruction = `Kamu adalah Fragrance AI, asisten ahli parfum eksklusif.

    DATA MENTAH DATABASE TOKO KAMI (RAHASIA - JANGAN PERNAH DITAMPILKAN MENTAH-MENTAH KE USER!):
    ${productList}

    ATURAN MUTLAK MENJAWAB REKOMENDASI (WAJIB DIPATUHI): 
    1. Jika user meminta rekomendasi parfum, kamu WAJIB HANYA MEMILIH 3 PARFUM TERBAIK dari data mentah di atas. JANGAN PERNAH mengeluarkan semua isi database!
    2. Jika data mentah "KOSONG", jawab: "Mohon maaf, saat ini kami tidak dapat menarik data stok atau semua produk sedang habis."
    3. Format jawabanmu WAJIB persis seperti cetakan di bawah ini (Nama brand WAJIB ditebalkan dengan **):
    
    Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :

    1. **[Pilih Brand 1 dari database]** - [Buat penjelasan yang menarik, elegan, dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)

    2. **[Pilih Brand 2 dari database]** - [Buat penjelasan yang menarik, elegan, dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)

    3. **[Pilih Brand 3 dari database]** - [Buat penjelasan yang menarik, elegan, dan detail tentang karakter aromanya] (Tersisa [jumlah stok] botol)
    
    PERINGATAN: DILARANG keras menyalin atau membocorkan data list mentah ke layar. Cukup berikan 3 poin di atas saja dengan deskripsi yang elegan.`;

    // 4. INISIALISASI GROQ API
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    const groqMessages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg: any) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.1-8b-instant", 
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