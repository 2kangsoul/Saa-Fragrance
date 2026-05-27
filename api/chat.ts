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

    // 3. INSTRUKSI KE AI (Diubah menjadi mode Ahli / Konsultan Cerdas)
    const systemInstruction = `Kamu adalah Fragrance AI, asisten ahli parfum eksklusif yang sangat cerdas, elegan, dan natural. 
    Kamu memiliki keahlian khusus dalam menganalisis notes serta menilai performa SPL (Sillage, Projection, Longevity) hingga mendeteksi karakter "beast mode".

    DATA DATABASE TOKO KAMI (Jadikan acuan pasti, JANGAN bocorkan list mentah ke user):
    ${productList}

    ATURAN CARA MENJAWAB (WAJIB DIPATUHI):
    1. SAAT USER MEMINTA REKOMENDASI (Contoh: "Rekomendasi parfum siang", "Parfum pria", dll):
       - Kamu WAJIB HANYA MEMILIH MAKSIMAL 3 PARFUM TERBAIK dari data di atas yang paling sesuai dengan permintaan.
       - Gunakan format persis seperti ini (Nama brand wajib tebal dengan **):
       
       Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :

       1. **[Nama Brand]** - [Jelaskan elegan karakternya, singgung soal SPL jika relevan] (Tersisa [jumlah] botol)
       
       2. **[Nama Brand]** - [Jelaskan elegan karakternya, singgung soal SPL jika relevan] (Tersisa [jumlah] botol)
       
       3. **[Nama Brand]** - [Jelaskan elegan karakternya, singgung soal SPL jika relevan] (Tersisa [jumlah] botol)

    2. SAAT USER BERTANYA LANJUTAN (Contoh: "Kenapa pilih Diptyque?", "Aventus cocok buat siang nggak?"):
       - Jawablah dengan natural, cerdas, dan mengalir seperti konsultan parfum sungguhan.
       - JANGAN gunakan format 3 poin di atas lagi. Jawab langsung pertanyaannya berdasarkan notes yang ada di database.
       - Jangan mudah panik atau meminta maaf jika tidak perlu. Pertahankan persona ahli parfum yang cerdas dan percaya diri.

    3. Jika data kosong, jawab: "Mohon maaf, saat ini kami tidak dapat menarik data stok."`;

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

    // MENGGUNAKAN MODEL 70B (Sangat Pintar & Logis)
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile", 
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