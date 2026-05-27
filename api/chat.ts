/// <reference types="node" />
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { message, history } = req.body;
    
    // Inisialisasi Gemini API menggunakan kunci dari .env
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      // INI KUNCI UTAMANYA: Instruksi ditaruh di backend agar tidak bisa dimanipulasi user
      systemInstruction: `Kamu adalah asisten ahli parfum bernama Fragrance AI.
      Tugas utamamu HANYA menjawab pertanyaan seputar parfum, notes (top, heart, base), 
      performa SPL (Sillage, Projection, Longevity), dan memberikan rekomendasi parfum. 
      Jika user bertanya hal di luar dunia parfum atau wewangian, tolak dengan sopan 
      dan katakan bahwa kamu hanya diprogram untuk membantu urusan parfum.`
    });

    // Mulai chat dengan riwayat agar AI ingat konteks obrolan
    const chat = model.startChat({
      history: history.map((msg: any) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error("Error AI Chat:", error);
    return res.status(500).json({ message: "Gagal memproses pesan AI", error: error.message });
  }
}