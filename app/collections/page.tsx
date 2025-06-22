"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Filter, ShoppingCart, Loader2 } from "lucide-react"
import { Product } from "@/lib/types"
import { productsApi } from "@/lib/local-api"

// Fallback data in case API fails
const fallbackItems = [
  // Tenda
  {
    id: 1,
    name: "Tenda Dome 2 Orang",
    price: 50000,
    category: "Tenda",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 2,
    name: "Tenda Dome 4 Orang",
    price: 75000,
    category: "Tenda",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 3,
    name: "Tenda Ultralight",
    price: 100000,
    category: "Tenda",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: false,
  },

  // Sleeping
  {
    id: 4,
    name: "Sleeping Bag",
    price: 25000,
    category: "Sleeping",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 5,
    name: "Matras",
    price: 20000,
    category: "Sleeping",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 6,
    name: "Bantal Angin",
    price: 15000,
    category: "Sleeping",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },

  // Tas
  {
    id: 7,
    name: "Carrier 60L",
    price: 50000,
    category: "Tas",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 8,
    name: "Carrier 80L",
    price: 75000,
    category: "Tas",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 9,
    name: "Daypack 30L",
    price: 30000,
    category: "Tas",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },

  // Masak
  {
    id: 10,
    name: "Kompor Portable",
    price: 30000,
    category: "Masak",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 11,
    name: "Nesting Cookset",
    price: 40000,
    category: "Masak",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 12,
    name: "Gas Canister",
    price: 25000,
    category: "Masak",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },

  // Penerangan
  {
    id: 13,
    name: "Headlamp",
    price: 15000,
    category: "Penerangan",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 14,
    name: "Senter LED",
    price: 20000,
    category: "Penerangan",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },
  {
    id: 15,
    name: "Lampu Tenda",
    price: 25000,
    category: "Penerangan",
    type: "GEAR",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
  },

  // Paket
  {
    id: 16,
    name: "Paket Pendaki Pemula",
    price: 150000,
    category: "Paket",
    type: "PAKET",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
    duration: "2 hari",
  },
  {
    id: 17,
    name: "Paket Adventure Pro",
    price: 300000,
    category: "Paket",
    type: "PAKET",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
    duration: "3 hari",
  },
  {
    id: 18,
    name: "Paket Family Camping",
    price: 250000,
    category: "Paket",
    type: "PAKET",
    image: "/placeholder.svg?height=200&width=200",
    available: true,
    duration: "2 hari",
  },
]

const categories = ["Semua", "Tenda", "Sleeping", "Tas", "Masak", "Penerangan", "Paket"]

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const productsData = await productsApi.getProducts()
        
        // If we got data from Supabase, use it
        if (productsData.length > 0) {
          setProducts(productsData)
        } else {
          // Fall back to demo data if no products in Supabase
          setProducts(fallbackItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            price15Days: Math.round(item.price * 1.4),
            price2Days: Math.round(item.price * 1.8),
            stock: item.available ? 5 : 0,
            category: item.category,
            image: item.image,
            description: `${item.name} untuk outdoor activities`,
            forSale: false,
            stockDetails: {
              available: item.available ? 5 : 0,
              rented: 0,
              cleaning: 0,
              maintenance: 0
            },
            rentalCount: 0,
            salesCount: 0
          })))
        }
      } catch (error) {
        console.error("Error loading products:", error)
        // Fallback to initial data if Supabase fails
        setProducts(fallbackItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          price15Days: Math.round(item.price * 1.4),
          price2Days: Math.round(item.price * 1.8),
          stock: item.available ? 5 : 0,
          category: item.category,
          image: item.image,
          description: `${item.name} untuk outdoor activities`,
          forSale: false,
          stockDetails: {
            available: item.available ? 5 : 0,
            rented: 0,
            cleaning: 0,
            maintenance: 0
          },
          rentalCount: 0,
          salesCount: 0
        })))
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredItems = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory
    const matchesAvailability = !showAvailableOnly || (item.stockDetails?.available || 0) > 0
    return matchesSearch && matchesCategory && matchesAvailability
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/3 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/4 rounded-full animate-ping"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img src="/images/logo-new.png" alt="Logo" className="h-8 w-8" />
              <div>
                <span className="text-xl font-bold text-white">®QHERE AYEM OUTDOOR</span>
                <p className="text-xs text-gray-400">Persewaan Alat Gunung</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/20">
                Login untuk Pesan
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            KOLEKSI LENGKAP
          </h1>
          <p className="text-xl text-gray-300 mb-8">Peralatan gunung berkualitas tinggi untuk petualangan Anda</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari peralatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="rounded"
                />
                Hanya yang tersedia
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
              <p className="text-white text-lg">Mengambil data peralatan...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-lg">Tidak ada item yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`bg-white/5 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 group ${
                  (item.stockDetails?.available || 0) <= 0 ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className="bg-white/20 text-white">
                        {item.forSale ? "JUAL" : "RENTAL"}
                      </Badge>
                      <Badge className={(item.stockDetails?.available || 0) > 0 ? "bg-green-600" : "bg-red-600"}>
                        {(item.stockDetails?.available || 0) > 0 ? "Tersedia" : "Tidak Tersedia"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold">
                          {item.forSale 
                            ? `Rp ${(item.salePrice || 0).toLocaleString()}`
                            : `Rp ${item.price.toLocaleString()}/hari`
                          }
                        </p>
                        {!item.forSale && (
                          <p className="text-gray-400 text-xs">
                            1,5 hari: Rp {(item.price15Days ?? Math.round(item.price * 1.4)).toLocaleString()} | 
                            2 hari: Rp {(item.price2Days ?? Math.round(item.price * 1.8)).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href="/login">
                      <Button
                        className={`w-full mt-3 ${
                          (item.stockDetails?.available || 0) > 0
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={(item.stockDetails?.available || 0) <= 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {(item.stockDetails?.available || 0) > 0 ? "Pesan Sekarang" : "Tidak Tersedia"}
                      </Button>
                    </Link>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white/5 p-8 rounded-lg border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Memulai Petualangan?</h2>
          <p className="text-gray-300 mb-6">
            Login sekarang untuk melakukan pemesanan dan nikmati pengalaman outdoor yang tak terlupakan
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3">
              Login & Pesan Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
