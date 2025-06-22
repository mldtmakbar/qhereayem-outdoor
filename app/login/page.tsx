"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain, Eye, EyeOff, LogIn, Loader2 } from "lucide-react"
import { auth } from "@/lib/auth-local"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // Make sure default users are initialized
        const storedUsers = localStorage.getItem('mountain_gear_users');
        if (!storedUsers || JSON.parse(storedUsers).length === 0) {
          // Initialize the auth system with default users if needed
          await auth.resetAuth();
        }
        
        const user = await auth.getUser();
        
        if (user) {
          if (user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    
    if (!email || !password) {
      setErrorMessage('Harap isi email dan password');
      return;
    }
    
    try {
      setIsLoading(true);
      const { user, error } = await auth.signInWithEmail(email, password);
      
      if (error) {
        setErrorMessage(`Login gagal: ${error.message}`);
        return;
      }
      
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMessage('Login gagal. Silakan coba lagi.');
      }
    } catch (error: any) {
      setErrorMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
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
        <svg className="absolute bottom-0 w-full h-64 opacity-20" viewBox="0 0 1200 300" fill="none">
          <path d="M0 300L200 100L400 200L600 50L800 150L1000 80L1200 200V300H0Z" fill="white" />
          <path d="M0 300L150 150L350 250L550 100L750 200L950 130L1200 250V300H0Z" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="border-gray-800 bg-black/60 backdrop-blur-md">            <CardHeader className="space-y-1 items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 mb-2">
                <Mountain className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-white">Selamat Datang Kembali</CardTitle>
              <CardDescription className="text-gray-400">
                Masuk untuk melanjutkan ke Mountain Gear Rental
              </CardDescription>
            </CardHeader>
            <CardContent>              <div className="bg-gray-800 p-3 rounded-md mb-4">
                <h3 className="text-sm font-medium mb-2 text-white">Demo Credentials:</h3>
                <div className="space-y-1 text-xs text-gray-300">
                  <p><strong>Admin:</strong> admin@qhereayem.com / admin123</p>
                  <p><strong>User:</strong> user@qhereayem.com / user123</p>
                </div>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    className="bg-gray-900 text-white border-gray-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link href="#" className="text-xs text-blue-500 hover:text-blue-400">
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-gray-900 text-white border-gray-800 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-900/40 border border-red-800 text-red-300 px-3 py-2 rounded-md text-sm">
                    {errorMessage}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Masuk
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-400">
                  Belum punya akun?{" "}
                  <Link href="/register" className="text-blue-500 hover:text-blue-400">
                    Daftar sekarang
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
