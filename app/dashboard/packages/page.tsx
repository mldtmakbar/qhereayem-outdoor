"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mountain, Search, ShoppingCart, User, History, LogOut, Package, Calendar, Users } from "lucide-react"
import Link from "next/link"

const mountainPackages = [
  {
    id: 1,
    name: "Paket Pendaki Pemula",
    price: 150000,
    duration: "2 hari",
    maxPeople: 2,
    image: "/placeholder.svg?height=300&width=400",
    description: "Paket lengkap untuk pendaki pemula dengan peralatan dasar",
    items: [
      { name: "Tenda Dome 2 Orang", quantity: 1 },
      { name: "Sleeping Bag", quantity: 2 },
      { name: "Matras", quantity: 2 },
      { name: "Kompor Portable", quantity: 1 },
      { name: "Headlamp", quantity: 2 },
    ],
    features: ["Panduan pendakian", "Tips keamanan", "Checklist persiapan"],
    available: true,
  },
  {
    id: 2,
    name: "Paket Adventure Pro",
    price: 300000,
    duration: "3 hari",
    maxPeople: 4,
    image: "/placeholder.svg?height=300&width=400",
    description: "Paket lengkap untuk pendaki berpengalaman dengan gear premium",
    items: [
      { name: "Tenda Dome 4 Orang", quantity: 1 },
      { name: "Sleeping Bag Premium", quantity: 4 },
      { name: "Carrier 60L", quantity: 4 },
      { name: "Kompor Multi-fuel", quantity: 1 },
      { name: "Headlamp LED", quantity: 4 },
      { name: "Trekking Pole", quantity: 4 },
    ],
    features: ["GPS Navigator", "Emergency kit", "Weather radio", "Panduan advanced"],
    available: true,
  },
  {
    id: 3,
    name: "Paket Family Adventure",
    price: 250000,
    duration: "2 hari",
    maxPeople: 6,
    image: "/placeholder.svg?height=300&width=400",
    description: "Paket khusus untuk keluarga dengan anak-anak",
    items: [
      { name: "Tenda Family 6 Orang", quantity: 1 },
      { name: "Sleeping Bag", quantity: 6 },
      { name: "Matras Keluarga", quantity: 3 },
      { name: "Kompor Portable", quantity: 2 },
      { name: "Headlamp", quantity: 6 },
      { name: "First Aid Kit", quantity: 1 },
    ],
    features: ["Kid-friendly gear", "Safety equipment", "Family guide"],
    available: true,
  },
  {
    id: 4,
    name: "Paket Extreme Explorer",
    price: 500000,
    duration: "5 hari",
    maxPeople: 3,
    image: "/placeholder.svg?height=300&width=400",
    description: "Paket untuk ekspedisi ekstrem dengan peralatan profesional",
    items: [
      { name: "Tenda 4 Season", quantity: 1 },
      { name: "Sleeping Bag -10°C", quantity: 3 },
      { name: "Carrier 80L", quantity: 3 },
      { name: "Kompor High Altitude", quantity: 1 },
      { name: "Climbing Gear Set", quantity: 1 },
      { name: "Emergency Shelter", quantity: 1 },
    ],
    features: ["Professional gear", "Satellite communicator", "Extreme weather kit"],
    available: false,
  },
]

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (!userRole) {
      router.push("/login")
    }
  }, [router])

  const filteredPackages = mountainPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToCart = (pkg: any) => {
    setCart([...cart, { ...pkg, type: "package" }])
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    router.push("/")
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-white" />
            <span className="text-xl font-bold">qhere ayem outdoor</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Gear
              </Button>
            </Link>
            <Link href="/dashboard/packages">
              <Button variant="ghost" className="text-white hover:bg-white/10 bg-white/10">
                <Package className="h-4 w-4 mr-2" />
                Paket
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <History className="h-4 w-4 mr-2" />
                Riwayat
              </Button>
            </Link>
            <Link href="/dashboard/cart">
              <Button variant="ghost" className="text-white hover:bg-white/10 relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Keranjang
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-white text-black text-xs">{cart.length}</Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <User className="h-4 w-4 mr-2" />
              Profil
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Paket Mountain Adventure</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Pilih paket lengkap sesuai kebutuhan petualangan Anda. Semua paket sudah termasuk peralatan dan panduan.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari paket adventure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className="bg-white/5 border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur"
            >
              <div className="relative">
                <img
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={pkg.available ? "bg-white text-black" : "bg-red-500 text-white"}>
                    {pkg.available ? "Tersedia" : "Tidak Tersedia"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/50 text-white">{pkg.duration}</Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl mb-2">{pkg.name}</CardTitle>
                    <p className="text-gray-300 text-sm">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">Rp {pkg.price.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{pkg.duration}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Package Info */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">Max {pkg.maxPeople} orang</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{pkg.duration}</span>
                  </div>
                </div>

                {/* Items Included */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Peralatan Termasuk:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded text-sm">
                        <span className="text-gray-300">{item.name}</span>
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                          {item.quantity}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Fitur Tambahan:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature, index) => (
                      <Badge key={index} className="bg-white/10 text-white text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => addToCart(pkg)}
                  disabled={!pkg.available}
                  className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400"
                >
                  {pkg.available ? "Tambah ke Keranjang" : "Tidak Tersedia"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Tidak ada paket yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
