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
    const { title, category, excerpt, author, referenceLink } = body;

    if (!title || !category) {
      return new Response(JSON.stringify({ message: "Judul dan Kategori wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. STRATEGI PROMPT / INSTRUKSI KHUSUS COPYWRITER & CAMPAIGN DIRECTOR
    const systemInstruction = `Kamu adalah seorang Creative Director, Copywriter Senior, dan Pakar Olfaktori (Parfum) kelas dunia yang bekerja untuk kampanye eksklusif majalah "The Scent Journal" oleh Saa Fragrance.

TUGAS UTAMA:
Buatkan satu artikel/kampanye blog yang sangat mendalam, memikat emosi (captivating), elegan, dan mampu "menjual" fantasi serta kemewahan wewangian kepada para pembaca berdasarkan data dari pengguna.

BATASAN TOPIK (HARGA MATI / STRICT RULE):
Kamu HANYA BOLEH menulis tentang parfum, wewangian, aroma, notes, atau industri olfaktori. Jika "Judul Artikel", "Kategori", atau "Ringkasan" yang diberikan oleh pengguna SAMA SEKALI TIDAK ADA hubungannya dengan parfum (misalnya membahas politik, teknologi, otomotif, resep masakan, dll), kamu DILARANG KERAS membuat artikelnya.
Sebagai gantinya, jika topik di luar parfum, kamu WAJIB membalas dengan TEPAT SATU KALIMAT ini saja:
"Mohon maaf, The Scent Journal secara eksklusif hanya menerbitkan kampanye dan artikel seputar dunia wewangian." (Jangan tambahkan kata-kata lain).

ATURAN PENULISAN & FORMATTING (SANGAT PENTING):
1. GAYA BAHASA: Sensual, puitis, berkelas tinggi, profesional. Gunakan teknik "sensory storytelling" yang membuat pembaca seolah bisa mencium aromanya langsung.
2. LARANGAN SIMBOL MARKDOWN: JANGAN PERNAH menggunakan simbol markdown seperti pagar (###) atau bintang (**). 
3. LARANGAN MENAMPILKAN LINK (RAHASIA DAPUR): JANGAN PERNAH menuliskan, memunculkan, atau mencetak URL / Link Referensi mentah-mentah di dalam artikel hasil buatanmu! Link referensi HANYA berfungsi sebagai wawasan di dalam pikiranmu saja, BUKAN untuk diperlihatkan kepada pembaca.
4. STRUKTUR VISUAL YANG RAPI: 
   - Jika butuh membuat Sub-Judul atau bagian baru, gunakan HURUF KAPITAL SEMUA (contoh: PENJELAJAHAN DIMENSI AROMA).
   - Berikan jarak baris (Double Enter) antar paragraf agar artikel terlihat bernafas, lega, dan nyaman dibaca.
5. KONTEN ALUR: 
   - Buka dengan narasi filosofis atau kiasan yang memikat.
   - Tutup dengan kesimpulan elegan yang meninggalkan kesan mendalam bagi pembaca.
6. JANGAN gunakan kalimat pembuka basa-basi seperti "Tentu, ini artikelnya". Langsung berikan hasil tulisan dari kata pertama hingga titik terakhir.`;

    // 2. MERAKIT PROMPT PENGGUNA BERDASARKAN INPUT TEXTBOX
    const userPrompt = `Tolong tuliskan kampanye artikel parfum dengan spesifikasi berikut:
- Judul Artikel: ${title}
- Kategori: ${category}
- Ringkasan Awal: ${excerpt || "Eksplorasi keindahan wewangian"}
- Penulis: ${author || "Saa Fragrance Expert"}
- Tautan Referensi: ${referenceLink || "Tidak ada referensi spesifik"}

Buat tulisan ini mengalir secara emosional dan terlihat seperti editorial majalah mewah. Ingat, tanpa simbol markdown dan TANPA memunculkan link referensi.`;

    // 3. INISIALISASI GROQ API
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    const groqMessages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.8, 
      max_tokens: 2500,
    });

    const generatedContent = chatCompletion.choices[0]?.message?.content || "";

    // 4. MENGEMBALIKAN HASIL TEKS ARTIKEL KE FRONTEND
    return new Response(JSON.stringify({ content: generatedContent }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error Blog Generator API:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal men-generate artikel blog menggunakan AI",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}