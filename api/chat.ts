/// <reference types="node" />
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Ini adalah baris sakti untuk mengubah server menjadi mode Edge
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  // Edge runtime menggunakan standar web Request/Response
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 2. Cara membaca data yang dikirim dari frontend
    const body = await req.json();
    const { message, history } = body;

    // Peringatan merah di process.env sekarang sudah hilang!
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `Kamu adalah asisten ahli parfum bernama Fragrance AI.
      Tugas utamamu HANYA menjawab pertanyaan seputar parfum, notes (top, heart, base), 
      performa SPL (Sillage, Projection, Longevity), dan memberikan rekomendasi parfum. 
      Jika user bertanya hal di luar dunia parfum atau wewangian, tolak dengan sopan 
      dan katakan bahwa kamu hanya diprogram untuk membantu urusan parfum.`,
    });

    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 3. Mengembalikan jawaban AI ke frontend
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
