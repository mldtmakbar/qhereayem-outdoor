"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mountain, ArrowLeft, Search, Undo2, CheckCircle } from "lucide-react"
import Link from "next/link"

const statusPipeline = [
  { id: "pending", label: "Menunggu Persetujuan", color: "bg-yellow-600" },
  { id: "approved", label: "Disetujui", color: "bg-green-600" },
  { id: "waiting_payment", label: "Menunggu Pembayaran", color: "bg-blue-600" },
  { id: "paid", label: "Sudah Dibayar", color: "bg-purple-600" },
  { id: "picked_up", label: "Barang Telah Diambil", color: "bg-indigo-600" },
  { id: "returned", label: "Barang Telah Dikembalikan", color: "bg-teal-600" },
  { id: "completed", label: "Selesai", color: "bg-gray-600" },
  { id: "cancelled", label: "Dibatalkan", color: "bg-red-600" },
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Semua")
  const [statusHistory, setStatusHistory] = useState<any[]>([])

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(savedBookings)
    const savedHistory = JSON.parse(localStorage.getItem("statusHistory") || "[]")
    setStatusHistory(savedHistory)
  }, [])

  const updateBookingStatus = (bookingId: number, newStatus: string) => {
    const oldBooking = bookings.find((b) => b.id === bookingId)
    if (!oldBooking) return

    // Save to history for undo
    const historyEntry = {
      id: Date.now(),
      bookingId,
      oldStatus: oldBooking.status,
      newStatus,
      timestamp: new Date().toISOString(),
    }

    const newHistory = [...statusHistory, historyEntry]
    setStatusHistory(newHistory)
    localStorage.setItem("statusHistory", JSON.stringify(newHistory))

    // Auto-update payment status based on booking status
    let updatedPaymentStatus = oldBooking.paymentStatus
    if (newStatus === "Menunggu Pembayaran") {
      updatedPaymentStatus = "Belum Bayar"
    } else if (newStatus === "Sudah Dibayar") {
      updatedPaymentStatus = "Lunas"
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: newStatus, paymentStatus: updatedPaymentStatus } : booking,
    )
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))

    // Show success message
    if (newStatus === "Sudah Dibayar") {
      alert("Status berhasil diubah! Booking sekarang tersedia di halaman Kasir.")
    }
  }

  const undoStatusChange = (historyId: number) => {
    const historyEntry = statusHistory.find((h) => h.id === historyId)
    if (!historyEntry) return

    const updatedBookings = bookings.map((booking) =>
      booking.id === historyEntry.bookingId ? { ...booking, status: historyEntry.oldStatus } : booking,
    )
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))

    // Remove from history
    const newHistory = statusHistory.filter((h) => h.id !== historyId)
    setStatusHistory(newHistory)
    localStorage.setItem("statusHistory", JSON.stringify(newHistory))
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toString().includes(searchTerm) ||
      booking.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === "Semua" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    const statusObj = statusPipeline.find((s) => s.label === status)
    return statusObj?.color || "bg-gray-600"
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

  const recentHistory = statusHistory.slice(-5).reverse()

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = statusPipeline.findIndex((s) => s.label === currentStatus)
    if (currentIndex < statusPipeline.length - 2) {
      // -2 because cancelled is separate
      return statusPipeline[currentIndex + 1].label
    }
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-white" />
            <div>
              <span className="text-lg font-bold">Kelola Booking</span>
              <p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Status Pipeline */}
        <Card className="bg-white/5 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Pipeline Status Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {statusPipeline.slice(0, -1).map((status, index) => (
                <div key={status.id} className="flex items-center">
                  <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                  {index < statusPipeline.length - 2 && <div className="w-4 h-0.5 bg-white/20 mx-2"></div>}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Badge className="bg-red-600 text-white">Dibatalkan</Badge>
              <span className="text-gray-400 text-sm ml-2">(dapat dilakukan dari status manapun)</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Status "Sudah Dibayar" akan otomatis muncul di halaman Kasir untuk diproses
            </p>
          </CardContent>
        </Card>

        {/* Recent Status Changes */}
        {recentHistory.length > 0 && (
          <Card className="bg-white/5 border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Perubahan Status Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentHistory.map((history) => (
                  <div key={history.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div>
                      <span className="text-white">Booking #{history.bookingId.toString().slice(-6)}</span>
                      <span className="text-gray-400 mx-2">→</span>
                      <span className="text-white">{history.newStatus}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {new Date(history.timestamp).toLocaleTimeString("id-ID")}
                      </span>
                    </div>
                    <Button
                      onClick={() => undoStatusChange(history.id)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      Undo
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari booking ID atau nama barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
          >
            <option value="Semua">Semua Status</option>
            {statusPipeline.map((status) => (
              <option key={status.id} value={status.label}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-gray-400">Tidak ada booking ditemukan</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white/5 border-white/20">
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
                    <div className="grid gap-2">
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

                  {/* Schedule and Total */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium mb-1">Pengambilan</p>
                      <p className="text-gray-300">{booking.pickupDate}</p>
                      <p className="text-gray-400 text-sm">{booking.pickupTime}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium mb-1">Pengembalian</p>
                      <p className="text-gray-300">{booking.returnDate}</p>
                      <p className="text-gray-400 text-sm">{booking.returnTime}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium mb-1">Total</p>
                      <p className="text-white font-bold text-lg">Rp {booking.totalAmount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">{booking.totalDays} hari</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-white font-medium mb-1">Catatan:</p>
                      <p className="text-gray-300">{booking.notes}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20">
                    {/* Next Status Button */}
                    {getNextStatus(booking.status) && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, getNextStatus(booking.status)!)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {getNextStatus(booking.status)}
                      </Button>
                    )}

                    {/* Cancel Button (available from any status except completed/cancelled) */}
                    {booking.status !== "Selesai" && booking.status !== "Dibatalkan" && (
                      <Button onClick={() => updateBookingStatus(booking.id, "Dibatalkan")} variant="destructive">
                        Batalkan
                      </Button>
                    )}

                    {/* All Status Options */}
                    <div className="flex flex-wrap gap-1 ml-4">
                      {statusPipeline.map((status) => (
                        <Button
                          key={status.id}
                          onClick={() => updateBookingStatus(booking.id, status.label)}
                          variant="outline"
                          size="sm"
                          className={`border-white/20 text-white hover:bg-white/10 text-xs ${
                            booking.status === status.label ? "bg-white/20" : ""
                          }`}
                          disabled={booking.status === status.label}
                        >
                          {status.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
