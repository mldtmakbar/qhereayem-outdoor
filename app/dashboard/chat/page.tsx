"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mountain, Send, Bot, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! Saya AI Assistant dari qhere ayem outdoor. Saya siap membantu Anda dengan informasi tentang peralatan gunung, paket adventure, dan tips pendakian. Ada yang bisa saya bantu?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulated AI responses based on keywords
  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes("tenda") || message.includes("tent")) {
      return "Kami memiliki berbagai jenis tenda: Tenda Dome 2-4 orang (Rp 75.000/hari), Tenda Family 6 orang (Rp 120.000/hari), dan Tenda 4 Season untuk cuaca ekstrem (Rp 150.000/hari). Semua tenda sudah termasuk groundsheet dan rainfly. Mau tahu lebih detail tentang tenda mana?"
    }

    if (message.includes("paket") || message.includes("package")) {
      return "Kami punya 4 paket mountain adventure: 1) Paket Pendaki Pemula (Rp 150.000/2 hari), 2) Paket Adventure Pro (Rp 300.000/3 hari), 3) Paket Family Adventure (Rp 250.000/2 hari), 4) Paket Extreme Explorer (Rp 500.000/5 hari). Paket mana yang sesuai dengan rencana adventure Anda?"
    }

    if (message.includes("harga") || message.includes("price") || message.includes("biaya")) {
      return "Harga sewa bervariasi: Tenda Rp 75.000/hari, Carrier Rp 50.000/hari, Sleeping Bag Rp 25.000/hari, Kompor Rp 30.000/hari. Untuk paket lengkap mulai dari Rp 150.000. Ada diskon untuk sewa lebih dari 3 hari! Mau saya hitungkan total biaya untuk kebutuhan Anda?"
    }

    if (message.includes("booking") || message.includes("sewa") || message.includes("pesan")) {
      return "Untuk booking sangat mudah! Anda bisa: 1) Pilih gear atau paket di dashboard, 2) Tambah ke keranjang, 3) Isi detail tanggal pengambilan dan pengembalian, 4) Submit booking untuk approval admin. Pembayaran dilakukan saat pengambilan barang. Butuh bantuan untuk booking?"
    }

    if (message.includes("lokasi") || message.includes("alamat") || message.includes("dimana")) {
      return "Toko kami berlokasi di Jl Dusun Turen No.RT01, RW.01, Turen, Sardonoharjo, Kec. Ngaglik, Kabupaten Sleman, DIY. Buka Senin-Jumat 08:00-17:00, Sabtu-Minggu 08:00-15:00. Bisa hubungi 0812-8907-3422 untuk info lebih lanjut."
    }

    if (message.includes("tips") || message.includes("saran") || message.includes("advice")) {
      return "Tips pendakian dari kami: 1) Cek cuaca sebelum berangkat, 2) Bawa air lebih dari kebutuhan, 3) Gunakan layering system untuk pakaian, 4) Jangan lupa first aid kit, 5) Informasikan rencana ke keluarga. Mau tips spesifik untuk gunung tertentu?"
    }

    if (message.includes("gunung") || message.includes("mountain")) {
      return "Peralatan kami cocok untuk berbagai gunung di Indonesia: Merapi, Merbabu, Lawu, Sindoro, Sumbing, dll. Untuk gunung dengan ketinggian >3000m, saya rekomendasikan Paket Adventure Pro atau Extreme Explorer. Mau rekomendasi gear untuk gunung spesifik?"
    }

    // Default response
    return "Terima kasih atas pertanyaannya! Saya bisa membantu dengan informasi tentang: peralatan gunung, paket adventure, harga sewa, cara booking, lokasi toko, tips pendakian, dan rekomendasi gear. Silakan tanya lebih spesifik atau ketik 'menu' untuk melihat layanan kami."
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing time
    setTimeout(
      () => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: getAIResponse(inputMessage),
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/4 rounded-full animate-ping"></div>

        {/* Mountain Silhouettes */}
        <svg className="absolute bottom-0 w-full h-64 opacity-10" viewBox="0 0 1200 300" fill="none">
          <path d="M0 300L200 100L400 200L600 50L800 150L1000 80L1200 200V300H0Z" fill="white" />
          <path d="M0 300L150 150L350 250L550 100L750 200L950 130L1200 250V300H0Z" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-white" />
            <span className="text-lg font-bold">AI Assistant</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/5 border-white/20 h-[calc(100vh-200px)] flex flex-col backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              qhere ayem outdoor AI Assistant
            </CardTitle>
            <p className="text-gray-300 text-sm">
              Tanya apa saja tentang peralatan gunung, paket adventure, dan tips pendakian
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === "user"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "ai" && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                      {message.sender === "user" && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${message.sender === "user" ? "text-gray-600" : "text-gray-400"}`}>
                          {message.timestamp.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white border border-white/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanya tentang gear, paket, atau tips pendakian..."
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Lihat paket adventure", "Harga sewa gear", "Tips pendakian", "Cara booking", "Lokasi toko"].map(
                (action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(action)}
                    className="border-white/20 text-white hover:bg-white/10 text-xs"
                  >
                    {action}
                  </Button>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
