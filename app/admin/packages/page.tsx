"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mountain, ArrowLeft, Search, Plus, Edit, Trash2, Package, Users, Calendar } from "lucide-react"
import Link from "next/link"

const initialPackages = [
  {
    id: 1,
    name: "Paket Pendaki Pemula",
    price: 150000,
    duration: "2 hari",
    maxPeople: 2,
    description: "Paket lengkap untuk pendaki pemula dengan peralatan dasar",
    imageUrl: "/placeholder.svg?height=300&width=300",
    items: [
      { name: "Tenda Dome 2 Orang", quantity: 1 },
      { name: "Sleeping Bag", quantity: 2 },
      { name: "Matras", quantity: 2 },
      { name: "Kompor Portable", quantity: 1 },
      { name: "Headlamp", quantity: 2 },
    ],
    features: ["Panduan pendakian", "Tips keamanan", "Checklist persiapan"],
    available: true,
    bookings: 15,
  },
  {
    id: 2,
    name: "Paket Adventure Pro",
    price: 300000,
    duration: "3 hari",
    maxPeople: 4,
    description: "Paket lengkap untuk pendaki berpengalaman dengan gear premium",
    imageUrl: "/placeholder.svg?height=300&width=300",
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
    bookings: 8,
  },
  {
    id: 3,
    name: "Paket Family Adventure",
    price: 250000,
    duration: "2 hari",
    maxPeople: 6,
    description: "Paket khusus untuk keluarga dengan anak-anak",
    imageUrl: "/placeholder.svg?height=300&width=300",
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
    bookings: 12,
  },
  {
    id: 4,
    name: "Paket Extreme Explorer",
    price: 500000,
    duration: "5 hari",
    maxPeople: 3,
    description: "Paket untuk ekspedisi ekstrem dengan peralatan profesional",
    imageUrl: "/placeholder.svg?height=300&width=300",
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
    bookings: 3,
  },
]

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState(initialPackages)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    maxPeople: "",
    description: "",
    imageUrl: "",
    items: "",
    features: "",
  })

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddPackage = () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.maxPeople) {
      alert("Mohon lengkapi semua field")
      return
    }

    const newPackage = {
      id: Date.now(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      duration: formData.duration,
      maxPeople: Number.parseInt(formData.maxPeople),
      description: formData.description,
      imageUrl: formData.imageUrl || "/placeholder.svg?height=300&width=300",
      items: formData.items.split("\n").map((item) => {
        const [name, qty] = item.split(" - ")
        return { name: name.trim(), quantity: Number.parseInt(qty) || 1 }
      }),
      features: formData.features.split("\n").map((f) => f.trim()),
      available: true,
      bookings: 0,
    }

    setPackages([...packages, newPackage])
    setFormData({ 
      name: "", 
      price: "", 
      duration: "", 
      maxPeople: "", 
      description: "", 
      imageUrl: "",
      items: "", 
      features: "" 
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPackage = () => {
    if (!formData.name || !formData.price || !formData.duration || !formData.maxPeople) {
      alert("Mohon lengkapi semua field")
      return
    }

    const updatedPackages = packages.map((pkg) =>
      pkg.id === editingPackage.id
        ? {
            ...pkg,
            name: formData.name,
            price: Number.parseInt(formData.price),
            duration: formData.duration,
            maxPeople: Number.parseInt(formData.maxPeople),
            description: formData.description,
            imageUrl: formData.imageUrl || pkg.imageUrl,
            items: formData.items.split("\n").map((item) => {
              const [name, qty] = item.split(" - ")
              return { name: name.trim(), quantity: Number.parseInt(qty) || 1 }
            }),
            features: formData.features.split("\n").map((f) => f.trim()),
          }
        : pkg,
    )

    setPackages(updatedPackages)
    setEditingPackage(null)
    setFormData({ 
      name: "", 
      price: "", 
      duration: "", 
      maxPeople: "", 
      description: "", 
      imageUrl: "",
      items: "", 
      features: "" 
    })
  }

  const handleDeletePackage = (id: number) => {
    if (confirm("Yakin ingin menghapus paket ini?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id))
    }
  }

  const toggleAvailability = (id: number) => {
    setPackages(packages.map((pkg) => (pkg.id === id ? { ...pkg, available: !pkg.available } : pkg)))
  }

  const openEditDialog = (pkg: any) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      duration: pkg.duration,
      maxPeople: pkg.maxPeople.toString(),
      description: pkg.description,
      imageUrl: pkg.imageUrl || "",
      items: pkg.items.map((item: any) => `${item.name} - ${item.quantity}`).join("\n"),
      features: pkg.features.join("\n"),
    })
  }

  const resetForm = () => {
    setFormData({ 
      name: "", 
      price: "", 
      duration: "", 
      maxPeople: "", 
      description: "", 
      imageUrl: "", 
      items: "", 
      features: "" 
    })
    setEditingPackage(null)
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
              <span className="text-lg font-bold">Kelola Paket Adventure</span>
              <p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Add Button */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari paket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Paket
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Paket Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Paket</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Durasi</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="2 hari"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPeople">Max Orang</Label>
                    <Input
                      id="maxPeople"
                      type="number"
                      value={formData.maxPeople}
                      onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="/placeholder.svg?height=300&width=300"
                  />
                </div>
                <div>
                  <Label htmlFor="items">Items (satu per baris: Nama - Quantity)</Label>
                  <textarea
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="w-full h-24 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
                    placeholder="Tenda Dome 2 Orang - 1&#10;Sleeping Bag - 2"
                  />
                </div>
                <div>
                  <Label htmlFor="features">Fitur (satu per baris)</Label>
                  <textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full h-20 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
                    placeholder="Panduan pendakian&#10;Tips keamanan"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPackage} className="bg-white text-black hover:bg-gray-200">
                    Tambah
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      setIsAddDialogOpen(false)
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Packages Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="bg-white/5 border-white/20">
              <CardHeader>
                <img 
                  src={pkg.imageUrl || "/placeholder.svg?height=300&width=300"} 
                  alt={pkg.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">{pkg.name}</CardTitle>
                    <p className="text-gray-300 text-sm mt-1">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">Rp {pkg.price.toLocaleString()}</p>
                    <Badge className={pkg.available ? "bg-green-600" : "bg-red-600"}>
                      {pkg.available ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Package Info */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/5 p-3 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Durasi</span>
                    </div>
                    <p className="text-white font-semibold">{pkg.duration}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Max Orang</span>
                    </div>
                    <p className="text-white font-semibold">{pkg.maxPeople}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">Booking</span>
                    </div>
                    <p className="text-white font-semibold">{pkg.bookings}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Items Termasuk:</h4>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {pkg.items.slice(0, 6).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                        <span className="text-gray-300">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.quantity}x
                        </Badge>
                      </div>
                    ))}
                    {pkg.items.length > 6 && (
                      <div className="text-gray-400 text-xs p-2">+{pkg.items.length - 6} item lainnya</div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-white mb-2">Fitur:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pkg.features.map((feature: string, index: number) => (
                      <Badge key={index} className="bg-white/10 text-white text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => openEditDialog(pkg)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => toggleAvailability(pkg.id)}
                    variant="outline"
                    size="sm"
                    className={`border-white/20 hover:bg-white/10 ${pkg.available ? "text-red-400" : "text-green-400"}`}
                  >
                    {pkg.available ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button
                    onClick={() => handleDeletePackage(pkg.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Tidak ada paket ditemukan</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
          <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Paket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nama Paket</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Harga</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-duration">Durasi</Label>
                  <Input
                    id="edit-duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxPeople">Max Orang</Label>
                  <Input
                    id="edit-maxPeople"
                    type="number"
                    value={formData.maxPeople}
                    onChange={(e) => setFormData({ ...formData, maxPeople: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-imageUrl">URL Gambar</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="/placeholder.svg?height=300&width=300"
                />
              </div>
              <div>
                <Label htmlFor="edit-items">Items (satu per baris: Nama - Quantity)</Label>
                <textarea
                  id="edit-items"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  className="w-full h-24 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-features">Fitur (satu per baris)</Label>
                <textarea
                  id="edit-features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full h-20 bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditPackage} className="bg-white text-black hover:bg-gray-200">
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setEditingPackage(null)
                  }}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
