"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain, ArrowLeft, User, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth-local"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "081234567890",
    joinDate: "2024-01-15",
    totalBookings: 5,
    totalSpent: 750000,
    avatar: "https://lh3.googleusercontent.com/a/default-user", // Google profile photo URL
    googleId: "google_12345abcde" // Google user ID
  })
  const [editForm, setEditForm] = useState(userProfile)
  const router = useRouter()

  useEffect(() => {
    // Get user data from auth system
    const loadUserProfile = async () => {
      const user = await auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Set user profile from auth system
      setUserProfile({
        ...userProfile,
        name: user.name || "User",
        email: user.email || "",
        avatar: user.avatar || "https://lh3.googleusercontent.com/a/default-user",
        joinDate: new Date().toISOString().split("T")[0], // Today's date as fallback
      });
      
      setEditForm({
        ...userProfile,
        name: user.name || "User",
        email: user.email || "",
      });
    };

    loadUserProfile();
  }, [router])

  const handleSave = () => {
    // Update the profile in state
    setUserProfile(editForm)
    setIsEditing(false)
    
    // In a real implementation, this would call an API to update the user profile
    // Since we're using localStorage auth, we'll just show a success message
    alert("Profil berhasil diperbarui!")
  }

  const handleCancel = () => {
    setEditForm(userProfile)
    setIsEditing(false)
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
            <span className="text-lg font-bold">Profil Saya</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/5 border-white/20 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Profil
              </CardTitle>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture - Non-editable from Google */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img src={userProfile.avatar || "/placeholder-user.jpg"} 
                     alt="Profile" 
                     className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Foto profil dari akun Google
              </p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Nama Lengkap
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{userProfile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{userProfile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">
                  No. Telepon
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{userProfile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white flex items-center gap-2">
                  Tanggal Bergabung
                  <span className="text-xs text-gray-400">(tidak dapat diubah)</span>
                </Label>
                <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-white">{new Date(userProfile.joinDate).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userProfile.totalBookings}</p>
                <p className="text-gray-400 text-sm">Total Booking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Rp {userProfile.totalSpent.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
