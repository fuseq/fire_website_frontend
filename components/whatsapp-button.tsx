"use client"

import { MessageCircle } from "lucide-react"

export function WhatsappButton() {
  const phoneNumber = "905321234567" // WhatsApp numaranızı buraya yazın (ülke kodu ile)
  const message = "Merhaba, yangın güvenliği ürünleri hakkında bilgi almak istiyorum."

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group animate-bounce hover:animate-none"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        WhatsApp ile iletişime geç
      </span>

      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
    </button>
  )
}
