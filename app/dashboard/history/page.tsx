"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, ArrowLeft, Calendar, Package } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(savedBookings)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-600"
      case "Ditolak":
        return "bg-red-600"
      case "Selesai":
        return "bg-blue-600"
      default:
        return "bg-yellow-600"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Lunas":
        return "bg-green-600"
      case "Belum Bayar":
        return "bg-red-600"
      default:
        return "bg-yellow-600"
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
            <span className="text-lg font-bold">Riwayat Booking</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <Card className="bg-white/5 border-white/20 backdrop-blur">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Belum ada riwayat booking</p>
              <Link href="/dashboard">
                <Button className="bg-white text-black hover:bg-gray-200">Mulai Sewa Sekarang</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-white/5 border-white/20 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Booking #{booking.id.toString().slice(-6)}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>{booking.paymentStatus}</Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Dibuat: {new Date(booking.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">Item yang Disewa:</h4>
                    <div className="space-y-2">
                      {booking.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-white font-semibold">Rp {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-400" />
                        <span className="text-white font-medium">Pengambilan</span>
                      </div>
                      <p className="text-gray-300">{booking.pickupDate}</p>
                      <p className="text-gray-400 text-sm">{booking.pickupTime}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-red-400" />
                        <span className="text-white font-medium">Pengembalian</span>
                      </div>
                      <p className="text-gray-300">{booking.returnDate}</p>
                      <p className="text-gray-400 text-sm">{booking.returnTime}</p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Total Biaya</p>
                        <p className="text-gray-400 text-sm">
                          {booking.totalDays} hari {booking.totalNights || Math.floor(booking.totalDays / 2)} malam
                        </p>
                      </div>
                      <p className="text-white font-bold text-xl">Rp {booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium mb-1">Catatan:</p>
                      <p className="text-gray-300">{booking.notes}</p>
                    </div>
                  )}

                  {booking.status === "Disetujui" && booking.paymentStatus === "Belum Bayar" && (
                    <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg">
                      <p className="text-blue-400 font-medium">Booking Disetujui!</p>
                      <p className="text-gray-300 text-sm">
                        Silakan datang ke tempat untuk mengambil barang dan melakukan pembayaran.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
