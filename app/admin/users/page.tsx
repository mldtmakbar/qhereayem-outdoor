"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mountain, ArrowLeft, Search, User, Phone, Mail, DollarSign, Instagram, MessageCircle } from "lucide-react"
import Link from "next/link"

const mockUsers = [
  {
    id: 1,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "081234567890",
    joinDate: "2024-01-15",
    totalSpent: 2250000,
    totalBookings: 15,
    lastBooking: "2024-12-01",
    socialMedia: {
      instagram: "@ahmadrizki_adventure",
      whatsapp: "081234567890",
    },
    bookingHistory: [
      { id: 1001, date: "2024-12-01", items: ["Tenda Dome", "Sleeping Bag"], total: 150000, status: "Selesai" },
      { id: 1002, date: "2024-11-15", items: ["Carrier 60L", "Kompor"], total: 200000, status: "Selesai" },
      { id: 1003, date: "2024-10-20", items: ["Paket Adventure Pro"], total: 300000, status: "Selesai" },
    ],
  },
  {
    id: 2,
    name: "Sari Dewi",
    email: "sari.dewi@email.com",
    phone: "081987654321",
    joinDate: "2024-02-20",
    totalSpent: 1800000,
    totalBookings: 12,
    lastBooking: "2024-11-28",
    socialMedia: {
      instagram: "@saridewi_hiking",
      whatsapp: "081987654321",
    },
    bookingHistory: [
      { id: 2001, date: "2024-11-28", items: ["Paket Family Adventure"], total: 250000, status: "Selesai" },
      { id: 2002, date: "2024-10-10", items: ["Tenda Family", "Matras"], total: 180000, status: "Selesai" },
    ],
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081122334455",
    joinDate: "2024-03-10",
    totalSpent: 1500000,
    totalBookings: 10,
    lastBooking: "2024-11-20",
    socialMedia: {
      instagram: "@budisantoso_outdoor",
      whatsapp: "081122334455",
    },
    bookingHistory: [
      { id: 3001, date: "2024-11-20", items: ["Tenda Dome", "Carrier"], total: 125000, status: "Selesai" },
      { id: 3002, date: "2024-09-15", items: ["Kompor", "Headlamp"], total: 90000, status: "Selesai" },
    ],
  },
  {
    id: 4,
    name: "Maya Putri",
    email: "maya.putri@email.com",
    phone: "081555666777",
    joinDate: "2024-04-05",
    totalSpent: 1200000,
    totalBookings: 8,
    lastBooking: "2024-11-10",
    socialMedia: {
      instagram: "@mayaputri_mountain",
      whatsapp: "081555666777",
    },
    bookingHistory: [
      { id: 4001, date: "2024-11-10", items: ["Sleeping Bag", "Matras"], total: 90000, status: "Selesai" },
    ],
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    email: "eko.prasetyo@email.com",
    phone: "081888999000",
    joinDate: "2024-05-12",
    totalSpent: 1050000,
    totalBookings: 7,
    lastBooking: "2024-10-25",
    socialMedia: {
      instagram: "@ekoprasetyo_climb",
      whatsapp: "081888999000",
    },
    bookingHistory: [
      { id: 5001, date: "2024-10-25", items: ["Paket Pendaki Pemula"], total: 150000, status: "Selesai" },
    ],
  },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/login")
    }
  }, [router])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const openUserDetail = (user: any) => {
    setSelectedUser(user)
    setIsDetailDialogOpen(true)
  }

  const totalUsers = users.length
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0)
  const avgSpentPerUser = totalRevenue / totalUsers
  const activeUsers = users.filter((user) => {
    const lastBooking = new Date(user.lastBooking)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return lastBooking > thirtyDaysAgo
  }).length

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
              <span className="text-lg font-bold">Kelola Users</span>
              <p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <User className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-green-400">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <User className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeUsers}</div>
              <p className="text-xs text-gray-400">Active in 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-400">From all users</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {Math.round(avgSpentPerUser).toLocaleString()}</div>
              <p className="text-xs text-gray-400">Per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari nama, email, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/5 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-gray-400">
                          Member sejak {new Date(user.joinDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{user.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Instagram className="h-4 w-4 text-pink-400" />
                          <span className="text-gray-300">{user.socialMedia.instagram}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{user.socialMedia.whatsapp}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-white">Rp {user.totalSpent.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600">{user.totalBookings} Booking</Badge>
                      <Badge className="bg-green-600">
                        Last: {new Date(user.lastBooking).toLocaleDateString("id-ID")}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => openUserDetail(user)}
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Tidak ada user ditemukan</p>
          </div>
        )}

        {/* User Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail User: {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">No. HP</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Tanggal Bergabung</p>
                    <p className="text-white">{new Date(selectedUser.joinDate).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Total Booking</p>
                    <p className="text-white">{selectedUser.totalBookings} kali</p>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Akun Sosial Media</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-400" />
                        <span className="text-gray-400 text-sm">Instagram</span>
                      </div>
                      <p className="text-white">{selectedUser.socialMedia.instagram}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-400 text-sm">WhatsApp</span>
                      </div>
                      <p className="text-white">{selectedUser.socialMedia.whatsapp}</p>
                    </div>
                  </div>
                </div>

                {/* Spending Summary */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Ringkasan Pengeluaran</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-white">Rp {selectedUser.totalSpent.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Total Spent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedUser.totalBookings}</p>
                      <p className="text-gray-400 text-sm">Total Booking</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        Rp {Math.round(selectedUser.totalSpent / selectedUser.totalBookings).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">Avg per Booking</p>
                    </div>
                  </div>
                </div>

                {/* Booking History */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Riwayat Booking</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedUser.bookingHistory.map((booking: any) => (
                      <div key={booking.id} className="bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">#{booking.id}</p>
                            <p className="text-gray-400 text-sm">{booking.date}</p>
                            <p className="text-gray-300 text-sm">{booking.items.join(", ")}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">Rp {booking.total.toLocaleString()}</p>
                            <Badge className={booking.status === "Selesai" ? "bg-green-600" : "bg-yellow-600"}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
