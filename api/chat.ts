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

    // 3. INSTRUKSI KE AI (DI-UPGRADE: Singkat, Padat, Berbobot)
    const systemInstruction = `Kamu adalah Fragrance AI, pakar parfum eksklusif. 
    
    GAYA BAHASA WAJIB: 
    - Singkat, padat, dan jelas. HINDARI basa-basi panjang atau kalimat bertele-tele.
    - Jawaban harus berbobot: Fokus pada analisis notes yang tajam dan evaluasi performa SPL (Sillage, Projection, Longevity). Soroti jika ada potensi "beast mode".
    - Tampil elegan dan percaya diri. Jangan pernah meminta maaf kecuali benar-benar terjadi error sistem.

    DATA DATABASE TOKO KAMI (Acuan utama, JANGAN bocorkan list mentah):
    ${productList}

    ATURAN MENJAWAB:
    1. JIKA USER MEMINTA REKOMENDASI:
       - Pilih MAKSIMAL 3 parfum terbaik dari data di atas.
       - Gunakan format persis seperti ini (Nama brand wajib tebal dengan **):
       
       Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :

       1. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)
       
       2. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)
       
       3. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)

    2. JIKA USER BERTANYA LANJUTAN:
       - Jawab langsung ke intinya (maksimal 2-3 kalimat).
       - Berikan fakta berbobot tentang komposisi atau performanya berdasarkan notes di database. 

    3. Jika stok di data kosong, jawab: "Mohon maaf, stok saat ini sedang kosong."`;

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