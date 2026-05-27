// File: src/Features/product/components/ChatBot.tsx
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // KUNCI UTAMA: Fungsi ini akan mencari teks dengan **bintang** dan menjadikannya BOLD tebal
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Potong tanda bintangnya (2 karakter awal & akhir) lalu beri class font-bold
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Jendela Chat */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col mb-4 overflow-hidden transform transition-all">
          {/* Header Chat */}
          <div className="bg-gray-900 text-white p-3 flex justify-between items-center">
            <span className="font-semibold text-sm">Fragrance AI</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              ✕
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#f8f7f4] flex flex-col gap-3">
            {messages.map((m, i) => {
              if (m.role === "system") return null;
              
              return (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2.5 max-w-[80%] rounded-xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-gray-900 text-white rounded-tr-none" : "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"}`}>
                    {/* Pemanggilan fungsi formatText agar AI bisa mencetak teks BOLD */}
                    {formatText(m.content)}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-2.5 bg-white border border-gray-200 rounded-xl rounded-tl-none shadow-sm">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Area Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya rekomendasi parfum..."
              className="input input-sm flex-1 bg-[#f8f7f4] focus:outline-none focus:border-gray-400 rounded-lg text-xs px-3"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              className="btn btn-sm bg-gray-900 text-white border-none rounded-lg hover:bg-black disabled:bg-gray-300"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Tombol Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-circle w-14 h-14 bg-gray-900 text-white border-none shadow-2xl hover:bg-black transition-transform ${isOpen ? "scale-0" : "scale-100"} absolute bottom-0 right-0`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatBot;