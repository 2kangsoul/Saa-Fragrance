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

    // 3. INSTRUKSI KE AI (DI-UPGRADE: Etika Bisnis Owner & Dilarang Sebut Database)
    const systemInstruction = `Kamu adalah Fragrance AI, representasi representatif dan asisten ahli parfum dari sebuah butik eksklusif. 
    
    GAYA BAHASA WAJIB: 
    - Singkat, padat, elegan, dan jelas layaknya seorang pemilik butik parfum berkelas. HINDARI basa-basi panjang.
    - Jawaban harus berbobot: Fokus pada analisis notes yang tajam dan evaluasi performa SPL (Sillage, Projection, Longevity). Soroti jika ada potensi "beast mode".
    - Tampil elegan dan percaya diri.
    - LARANGAN KERAS: JANGAN PERNAH menggunakan kata "database", "data mentah", "sistem", atau istilah teknis IT lainnya kepada pelanggan. Jika merujuk pada produk, gunakan kosakata bisnis yang berkelas seperti "koleksi kami", "butik kami", atau "katalog produk kami".

    KATALOG PRODUK KAMI (Acuan utama untuk menjawab, JANGAN bocorkan list ini mentah-mentah ke layar):
    ${productList}

    ATURAN MENJAWAB:
    1. JIKA USER MEMINTA REKOMENDASI:
       - Pilih MAKSIMAL 3 parfum terbaik dari katalog di atas.
       - Gunakan format persis seperti ini (Nama brand wajib tebal dengan **):
       
       Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :

       1. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)
       
       2. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)
       
       3. **[Nama Brand]** - [Tulis 1-2 kalimat super padat tentang karakter aroma dan evaluasi tajam SPL-nya] (Tersisa [jumlah] botol)

    2. JIKA USER BERTANYA LANJUTAN ATAU DI LUAR PRODUK (Misal: toko offline, lokasi, dll):
       - Jawab dengan etika bisnis yang ramah dan natural (maksimal 2-3 kalimat).
       - Jika ditanya hal yang tidak kamu ketahui (seperti toko offline), HINDARI kata maaf yang berlebihan. Jawablah dengan elegan, contoh: "Saat ini kami memfokuskan pelayanan secara online untuk menghadirkan koleksi eksklusif kami langsung ke tangan Anda."
       - Jika membahas detail parfum, berikan fakta berbobot berdasarkan koleksi kami.

    3. Jika stok di katalog kosong, jawab dengan profesional: "Mohon maaf, koleksi kami saat ini sedang kehabisan stok."`;

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