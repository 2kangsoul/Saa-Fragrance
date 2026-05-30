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
    // Mengambil data dari textbox form pendaftaran blog di frontend
    const { title, category, excerpt, author, referenceLink } = body;

    if (!title || !category) {
      return new Response(JSON.stringify({ message: "Judul dan Kategori wajib diisi!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. STRATEGI PROMPT / INSTRUKSI KHUSUS GENERATOR BLOG
    const systemInstruction = `Kamu adalah seorang Content Writer Senior, Editor-in-Chief, dan Pakar Olfaktori (Parfum) dari "The Scent Journal" — jurnal eksklusif milik butik Saa Fragrance.

TUGAS UTAMA:
Buatkan satu artikel blog yang sangat mendalam, kaya akan informasi, elegan, dan menarik perhatian para pencinta wewangian (fraghead) maupun pemula berdasarkan data ringkas yang diberikan oleh pengguna.

ATURAN PENULISAN:
1. GAYA BAHASA: Mewah, puitis namun tetap informatif, berwawasan luas, profesional, dan menggunakan diksi storytelling aroma yang kuat.
2. STRUKTUR ARTIKEL:
   - PENDAHULUAN: Buka dengan narasi atau kiasan yang memikat emosi pembaca seputar aroma.
   - PEMBAHASAN UTAMA: Pecah menjadi 3-4 sub-bagian menarik menggunakan heading markdown (###) agar rapi. Jelaskan secara mendalam esensi topik tersebut.
   - HUBUNGAN DENGAN REFERENSI: Jika pengguna menyertakan Link Referensi, integrasikan konteks atau sudut pandang dari materi referensi tersebut ke dalam narasi artikel secara natural.
   - KESIMPULAN: Penutup yang elegan dan berbobot yang merangkum seluruh artikel.
3. FORMAT OUTPUT: Hasilkan konten langsung dalam format Rich-Text Markdown murni (gunakan tebal, miring, list, dan heading). JANGAN tambahkan kata pembuka seperti "Tentu, ini artikelnya:" atau kalimat penutup penawaran. Langsung berikan isi artikel dari kata pertama hingga terakhir.`;

    // 2. MERAKIT PROMPT PENGGUNA BERDASARKAN INPUT TEXTBOX
    const userPrompt = `Buatkan artikel blog lengkap dengan spesifikasi berikut:
- Judul Artikel: ${title}
- Kategori: ${category}
- Ringkasan / Excerpt Awal: ${excerpt || "Tentang keindahan wewangian"}
- Penulis / Author: ${author || "Saa Fragrance Expert"}
- Tautan / Link Referensi Riset: ${referenceLink || "Tidak ada link referensi"}

Tolong kembangkan data di atas menjadi sebuah artikel panjang yang mengalir secara alami dan profesional seputar dunia parfum.`;

    // 3. INISIALISASI GROQ API MENGGUNAKAN KEY YANG SUDAH ADA
    const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || "" });

    const groqMessages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ];

    // Menggunakan model andalan Anda: llama-3.3-70b-versatile
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7, // Sedikit dinaikkan agar artikel lebih kreatif dan mengalir
      max_tokens: 2500, // Memberikan ruang agar tulisan bisa panjang dan mendalam
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