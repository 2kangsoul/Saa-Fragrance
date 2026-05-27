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

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction: `Kamu adalah asisten ahli parfum bernama Fragrance AI.
      Tugas utamamu HANYA menjawab pertanyaan seputar parfum, notes (top, heart, base), 
      performa SPL (Sillage, Projection, Longevity), dan memberikan rekomendasi parfum. 
      Jika user bertanya hal di luar dunia parfum atau wewangian, tolak dengan sopan 
      dan katakan bahwa kamu hanya diprogram untuk membantu urusan parfum.
      PENTING: Jawablah menggunakan teks biasa. JANGAN PERNAH menggunakan format markdown seperti tanda bintang (**) atau list strip (-). 
      ATURAN KHUSUS REKOMENDASI: Jika user meminta rekomendasi parfum, kamu WAJIB mengawalinya dengan kalimat: "Rekomendasi parfume dari Fragrance AI sendiri terdiri dari :"
      Lalu berikan baris baru (ENTER) dan tuliskan rekomendasinya MAKSIMAL 3 POIN dengan format persis seperti ini:
      1. [Nama Parfum] - [Penjelasan sangat singkat maksimal 2 kalimat]
      2. [Nama Parfum] - [Penjelasan sangat singkat maksimal 2 kalimat]
      3. [Nama Parfum] - [Penjelasan sangat singkat maksimal 2 kalimat]`,
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