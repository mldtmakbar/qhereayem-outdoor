"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Star, MapPin, Phone, MessageCircle, Instagram, Mail, Eye } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/4 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/2 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/3 rounded-full animate-bounce delay-500"></div>

        {/* Animated Stars */}
        <div className="absolute top-32 left-1/3 w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
        <div className="absolute top-64 right-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-48 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-1000"></div>

        {/* Mountain Silhouettes with Animation */}
        <svg className="absolute bottom-0 w-full h-64 opacity-20 animate-pulse" viewBox="0 0 1200 300" fill="none">
          <path d="M0 300L200 100L400 200L600 50L800 150L1000 80L1200 200V300H0Z" fill="white" />
          <path d="M0 300L150 150L350 250L550 100L750 200L950 130L1200 250V300H0Z" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/images/logo-new.png" alt="Logo" className="h-10 w-10 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ®QHERE AYEM OUTDOOR
              </span>
              <p className="text-xs text-gray-400">Persewaan Alat Gunung</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-gray-200 font-semibold">Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative z-10 py-32 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight animate-text-glow">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent animate-gradient">
                ADVENTURE
              </span>
              <br />
              <span className="text-white/80 text-4xl md:text-6xl animate-float">STARTS HERE</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Sewa peralatan gunung berkualitas tinggi untuk petualangan tak terlupakan.
              <br />
              <span className="text-white font-semibold animate-pulse">
                Booking online mudah, aman, dan terpercaya.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
              <Link href="/collections">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 text-lg px-12 py-4 font-bold transform hover:scale-105 transition-all duration-300 animate-bounce-subtle"
                >
                  LIHAT KOLEKSI
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black text-lg px-12 py-4 font-bold transform hover:scale-105 transition-all duration-300"
                >
                  MULAI PETUALANGAN
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400 mt-6 animate-fade-in-up delay-700">
              <MessageCircle className="h-5 w-5 animate-pulse" />
              <span>Chat AI Assistant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notice has been removed as it's already in rental policy */}

      {/* Features with Stagger Animation */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white animate-fade-in-up">
            Mengapa Pilih <span className="text-gray-300 animate-text-glow">®QHERE AYEM OUTDOOR</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-white/10 rounded-full w-fit animate-pulse">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Peralatan Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Semua peralatan kami selalu dalam kondisi prima dan terawat dengan standar internasional
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-white/10 rounded-full w-fit animate-pulse delay-300">
                  <Clock className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Booking 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Sistem booking online yang mudah dan dapat diakses kapan saja dengan AI assistant
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-white/10 rounded-full w-fit animate-pulse delay-500">
                  <Star className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Paket Lengkap</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Paket mountain adventure lengkap dengan panduan dan rekomendasi terbaik
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rental Policy Guidelines */}
      <section className="relative z-10 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white animate-fade-in-up">
            Kebijakan Penyewaan
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur max-w-3xl mx-auto">
            <div className="space-y-4 text-gray-200">
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                <p>Pemesanan diharapkan dilakukan <span className="text-white font-semibold">minimal 1 hari sebelumnya</span> untuk memastikan ketersediaan peralatan.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">2</span>
                </div>
                <p><span className="text-white font-semibold">Cek secara berkala status booking Anda</span>. Ketika status berubah menjadi <span className="text-green-400 font-semibold">"Disetujui"</span>, harap <span className="text-white font-semibold">datang ke toko sesuai dengan jam yang telah diisi</span> pada formulir pemesanan.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">3</span>
                </div>
                <p>Keterlambatan pengambilan maksimal <span className="text-white font-semibold">30 menit</span> dari waktu yang ditentukan.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">4</span>
                </div>
                <p>Untuk pengembalian peralatan, batas waktu maksimal adalah <span className="text-white font-semibold">pukul 9 malam</span> di hari pengembalian yang telah ditentukan.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">5</span>
                </div>
                <p>Keterlambatan pengembalian akan dikenakan <span className="text-white font-semibold">biaya tambahan sesuai ketentuan</span> yang berlaku.</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="min-w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 font-bold text-sm">!</span>
                </div>
                <p className="text-white font-medium">Semua pembayaran dilakukan di lokasi saat pengambilan peralatan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Preview with Enhanced Animation */}
      <section className="relative z-10 py-20 px-4 bg-white/5">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white animate-fade-in-up">
            Peralatan & Paket Populer
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Paket Pendaki Pemula",
                price: "Rp 150.000/2 hari",
                type: "PAKET",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Tenda Dome 4 Orang",
                price: "Rp 75.000/hari",
                type: "GEAR",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Paket Adventure Pro",
                price: "Rp 300.000/3 hari",
                type: "PAKET",
                image: "/placeholder.svg?height=200&width=200",
              },
              {
                name: "Carrier 60L",
                price: "Rp 50.000/hari",
                type: "GEAR",
                image: "/placeholder.svg?height=200&width=200",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`bg-black/50 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 group animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${item.type === "PAKET" ? "bg-white text-black" : "bg-white/20 text-white"} animate-pulse`}
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.name}</h3>
                  <p className="text-gray-300 font-bold">{item.price}</p>
                  <Badge className="mt-2 bg-white/20 text-white animate-pulse delay-500">Tersedia</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12 animate-fade-in-up delay-500">
            <Link href="/collections">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
              >
                <Eye className="h-5 w-5 mr-2" />
                Lihat Semua Koleksi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info with Animation */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-8 text-white">Kunjungi Toko Kami</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 animate-slide-in-left delay-100">
                  <MapPin className="h-6 w-6 text-white mt-1 flex-shrink-0 animate-pulse" />
                  <div>
                    <p className="text-white font-semibold mb-1">Alamat</p>
                    <p className="text-gray-300">
                      Jl Dusun Turen No.RT01, RW.01, Turen, Sardonoharjo,
                      <br />
                      Kec. Ngaglik, Kabupaten Sleman,
                      <br />
                      Daerah Istimewa Yogyakarta
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 animate-slide-in-left delay-200">
                  <Phone className="h-6 w-6 text-white animate-pulse" />
                  <div>
                    <p className="text-white font-semibold mb-1">Telepon</p>
                    <p className="text-gray-300">0812-8907-3422</p>
                  </div>
                </div>

                {/* Social Media with Enhanced Animation */}
                <div className="space-y-4 animate-slide-in-left delay-300">
                  <h3 className="text-white font-semibold text-lg">Ikuti Kami</h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.instagram.com/qhereayemoutdoor/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors transform hover:scale-105 duration-300"
                    >
                      <Instagram className="h-5 w-5 animate-pulse" />
                      <span>@qhereayemoutdoor</span>
                    </a>
                    <a
                      href="https://www.tiktok.com/@qhere.ayem.outdoor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors transform hover:scale-105 duration-300"
                    >
                      <MessageCircle className="h-5 w-5 animate-pulse delay-200" />
                      <span>@qhere.ayem.outdoor</span>
                    </a>
                    <a
                      href="mailto:qhereayemoutdoor@gmail.com"
                      className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors transform hover:scale-105 duration-300"
                    >
                      <Mail className="h-5 w-5 animate-pulse delay-400" />
                      <span>qhereayemoutdoor@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-lg border border-white/10 animate-fade-in-up delay-400 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Jam Operasional</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between animate-slide-in-right delay-500">
                  <span>Senin - Jumat</span>
                  <span>08:00 - 17:00</span>
                </div>
                <div className="flex justify-between animate-slide-in-right delay-600">
                  <span>Sabtu - Minggu</span>
                  <span>08:00 - 15:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/images/logo-new.png" alt="Logo" className="h-8 w-8 animate-pulse" />
              <div>
                <span className="text-xl font-bold text-white">®QHERE AYEM OUTDOOR</span>
                <p className="text-gray-400 text-sm">Persewaan Alat Gunung</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">© 2024 QHERE AYEM OUTDOOR. All rights reserved.</p>
              <p className="text-gray-500 text-sm">
                Supported by <a href="https://sukakelana.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">sukakelana.id</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out;
        }
        
        .animate-text-glow {
          animation: text-glow 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  )
}
