"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth-local"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Eye,
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 2400000, bookings: 45 },
  { month: "Feb", revenue: 1800000, bookings: 32 },
  { month: "Mar", revenue: 3200000, bookings: 58 },
  { month: "Apr", revenue: 2800000, bookings: 48 },
  { month: "Mei", revenue: 3600000, bookings: 65 },
  { month: "Jun", revenue: 4200000, bookings: 72 },
]

const popularItems = [
  { name: "Tenda Dome", count: 45, revenue: 3375000, color: "#3B82F6" },
  { name: "Carrier 60L", count: 38, revenue: 1900000, color: "#10B981" },
  { name: "Sleeping Bag", count: 32, revenue: 800000, color: "#F59E0B" },
  { name: "Kompor Portable", count: 28, revenue: 840000, color: "#EF4444" },
  { name: "Headlamp", count: 25, revenue: 375000, color: "#8B5CF6" },
]

const packageData = [
  { name: "Paket Pendaki Pemula", bookings: 15, revenue: 2250000 },
  { name: "Paket Adventure Pro", bookings: 8, revenue: 2400000 },
  { name: "Paket Family Adventure", bookings: 12, revenue: 3000000 },
  { name: "Paket Extreme Explorer", bookings: 3, revenue: 1500000 },
]

const inventoryStatus = [
  { category: "Tenda", total: 25, available: 18, rented: 7 },
  { category: "Tas", total: 30, available: 22, rented: 8 },
  { category: "Sleeping", total: 40, available: 28, rented: 12 },
  { category: "Masak", total: 20, available: 15, rented: 5 },
  { category: "Penerangan", total: 35, available: 31, rented: 4 },
  { category: "Aksesoris", total: 15, available: 12, rented: 3 },
  { category: "Climbing", total: 10, available: 8, rented: 2 },
  { category: "Navigation", total: 8, available: 6, rented: 2 },
]

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [showAllInventory, setShowAllInventory] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth.getUser();
        
        if (!user || user.role !== 'admin') {
          router.push("/login");
          return;
        }
        
        // For testing purposes, save the role to localStorage to support existing code
        localStorage.setItem("userRole", user.role);
        
        const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
        setBookings(savedBookings);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push("/login");
      }
    };
    
    checkAuth();
  }, [router])

  const pendingBookings = bookings.filter((b) => b.status === "Menunggu Persetujuan")
  const approvedBookings = bookings.filter((b) => b.status === "Disetujui")
  const completedBookings = bookings.filter((b) => b.status === "Selesai")
  const totalRevenue = bookings.filter((b) => b.paymentStatus === "Lunas").reduce((sum, b) => sum + b.totalAmount, 0)
  const monthlyRevenue = 4200000 // Current month
  const totalCustomers = 156
  const activeRentals = approvedBookings.length

  const displayedInventory = showAllInventory ? inventoryStatus : inventoryStatus.slice(0, 5)

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("userRole");
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-new.png" alt="Logo" className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold">®QHERE AYEM OUTDOOR</span>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/analytics">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/admin/sales">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sales
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Package className="h-4 w-4 mr-2" />
                Inventori
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                Booking
              </Button>
            </Link>
            <Link href="/admin/packages">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Package className="h-4 w-4 mr-2" />
                Paket
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
            </Link>
            <Link href="/admin/cashier">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <DollarSign className="h-4 w-4 mr-2" />
                Kasir
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Booking Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{pendingBookings.length}</div>
              <p className="text-xs text-gray-400">Menunggu persetujuan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Sewa Aktif</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeRentals}</div>
              <p className="text-xs text-gray-400">Sedang berlangsung</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue Bulan Ini</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400">+12% dari bulan lalu</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Customer</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalCustomers}</div>
              <p className="text-xs text-green-400">+8 customer baru</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Grafik Pendapatan & Booking
              </CardTitle>
              <CardDescription className="text-gray-400">
                Pendapatan dan jumlah booking 6 bulan terakhir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                    formatter={(value: any, name: string) => [
                      name === "revenue" ? `Rp ${value.toLocaleString()}` : value,
                      name === "revenue" ? "Pendapatan" : "Booking",
                    ]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Popular Items Chart */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Barang Paling Populer
              </CardTitle>
              <CardDescription className="text-gray-400">Barang yang paling sering disewa</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={popularItems}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {popularItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Package Performance */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Performa Paket Adventure</CardTitle>
              <CardDescription className="text-gray-400">Booking dan revenue per paket</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={packageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                    formatter={(value: any, name: string) => [
                      name === "revenue" ? `Rp ${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Booking",
                    ]}
                  />
                  <Bar dataKey="bookings" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Status Inventori
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllInventory(!showAllInventory)}
                  className="text-white hover:bg-white/10"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showAllInventory ? "Sembunyikan" : "Lihat Semua"}
                </Button>
              </CardTitle>
              <CardDescription className="text-gray-400">Ketersediaan barang per kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedInventory.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.category}</span>
                      <span className="text-gray-400 text-sm">
                        {item.available}/{item.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(item.available / item.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Tersedia: {item.available}</span>
                      <span>Disewa: {item.rented}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2 bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Booking Terbaru</CardTitle>
              <CardDescription className="text-gray-400">Daftar booking yang perlu ditindaklanjuti</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Belum ada booking</p>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-white font-medium">Booking #{booking.id.toString().slice(-6)}</p>
                          <p className="text-gray-400 text-sm">
                            {booking.items.length} item • Rp {booking.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            booking.status === "Disetujui"
                              ? "bg-green-600"
                              : booking.status === "Ditolak"
                                ? "bg-red-600"
                                : "bg-yellow-600"
                          }
                        >
                          {booking.status}
                        </Badge>
                        <Badge className={booking.paymentStatus === "Lunas" ? "bg-green-600" : "bg-red-600"}>
                          {booking.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/admin/bookings">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Lihat Semua Booking
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Statistik Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-400" />
                  <span className="text-white text-sm">Total Booking</span>
                </div>
                <span className="text-white font-bold">{bookings.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-white text-sm">Selesai</span>
                </div>
                <span className="text-white font-bold">{completedBookings.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-white text-sm">Pending</span>
                </div>
                <span className="text-white font-bold">{pendingBookings.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-white text-sm">Stok Rendah</span>
                </div>
                <span className="text-white font-bold">3</span>
              </div>

              <div className="pt-4">
                <h4 className="text-white font-medium mb-2">Revenue Hari Ini</h4>
                <p className="text-2xl font-bold text-white">Rp 450.000</p>
                <p className="text-green-400 text-sm">+15% dari kemarin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
