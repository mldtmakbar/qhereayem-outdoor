"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain, ArrowLeft, Calendar, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { CartItem, Booking, BookingItem } from "@/lib/types"
import { productsApi, bookingsApi } from "@/lib/local-api"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    notes: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  // Load cart from local storage on component mount
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        setIsLoading(true)
        
        // Get cart from local storage
        const storedCart = localStorage.getItem('cart')
        if (!storedCart) {
          setCartItems([])
          return
        }
        
        const parsedCart = JSON.parse(storedCart) as CartItem[]
        
        // If we have items, check their current availability from local API
        if (parsedCart.length > 0) {
          // Get all product IDs from cart
          const productIds = parsedCart.map(item => item.product.id)
          
          // Fetch fresh product data from local API
          const products = await productsApi.getProductsByIds(productIds)
          
          // Update cart with fresh product data
          const updatedCart = parsedCart.map(cartItem => {
            const freshProduct = products.find(p => p.id === cartItem.product.id)
            if (freshProduct) {
              return {
                ...cartItem,
                product: freshProduct
              }
            }
            return cartItem
          })
          
          setCartItems(updatedCart)
        } else {
          setCartItems([])
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCartItems()
  }, [])

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.product.id !== id)
    setCartItems(updatedCart)
    
    // Update local storage
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return
    
    const updatedCart = cartItems.map((item) => 
      (item.product.id === id ? { ...item, quantity } : item)
    )
    setCartItems(updatedCart)
    
    // Update local storage
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const calculateDays = () => {
    if (!bookingDetails.pickupDate || !bookingDetails.returnDate) return 2 // minimum 2 hari 1 malam
    const pickup = new Date(bookingDetails.pickupDate)
    const returnDate = new Date(bookingDetails.returnDate)
    const diffTime = Math.abs(returnDate.getTime() - pickup.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Sistem rental gunung: 1 hari = 2 hari 1 malam
    // Jadi kalikan dengan 2 untuk mendapatkan hari malam
    const rentalDays = diffDays * 2
    return rentalDays || 2 // minimum 2 hari 1 malam
  }

  const calculateNights = () => {
    return Math.floor(calculateDays() / 2)
  }

  // Submit booking function
  const submitBooking = async () => {
    try {
      setIsSubmitting(true)
      
      // Get user profile from localStorage
      const userStr = localStorage.getItem('mountain_gear_currentUser')
      
      if (!userStr) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to make a booking",
          variant: "destructive"
        })
        router.push('/login')
        return
      }
      
      const userProfile = JSON.parse(userStr)
      
      // Extract pickup and return dates from form
      const pickupDate = new Date(bookingDetails.pickupDate)
      const returnDate = new Date(bookingDetails.returnDate)
      
      // Calculate total days for rental
      const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 1) {
        toast({
          title: "Invalid Dates",
          description: "Return date must be at least 1 day after pickup date",
          variant: "destructive"
        })
        return
      }
      
      // Calculate total price
      const totalPrice = cartItems.reduce((total, item) => {
        let itemPrice
        if (diffDays <= 1) {
          itemPrice = item.product.price
        } else if (diffDays <= 1.5) {
          itemPrice = item.product.price15Days || item.product.price * 1.5
        } else {
          itemPrice = item.product.price2Days || item.product.price * 2
        }
        return total + (itemPrice * item.quantity)
      }, 0)
      
      // Create booking in local DB
      const booking: Omit<Booking, "id"> = {
        userId: userProfile.id,
        items: [],
        startDate: pickupDate.toISOString(),
        endDate: returnDate.toISOString(),
        totalPrice,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customFields: {
          totalDays: diffDays,
          pickupTime: bookingDetails.pickupTime,
          returnTime: bookingDetails.returnTime,
          notes: bookingDetails.notes
        }
      }
      
      // Create booking and get ID
      const newBooking = await bookingsApi.createBooking(booking)
      
      if (!newBooking) {
        toast({
          title: "Booking Error",
          description: "Failed to create booking",
          variant: "destructive"
        })
        return
      }
      
      // Create booking items
      const bookingItems = cartItems.map(item => ({
        bookingId: newBooking.id,
        productId: item.product.id,
        quantity: item.quantity,
        priceAtBooking: item.product.price
      }))
      
      // Add booking items to the booking
      const itemsError = await bookingsApi.addBookingItems(bookingItems)
      
      if (!itemsError) {
        toast({
          title: "Booking Error",
          description: "Failed to add items to booking",
          variant: "destructive"
        })
        // Rollback booking creation
        await bookingsApi.deleteBooking(newBooking.id)
        return
      }
      
      // Clear the cart
      localStorage.removeItem('cart')
      
      // Show success message
      toast({
        title: "Success",
        description: "Booking created successfully!",
      })
      
      // Redirect to dashboard history
      router.push('/dashboard/history')
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
          <p className="text-white text-lg">Memuat keranjang...</p>
        </div>
      </div>
    )
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
            <span className="text-lg font-bold">Keranjang Sewa</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Item yang Disewa</h2>
            {cartItems.length === 0 ? (
              <Card className="bg-white/5 border-white/20 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Keranjang kosong</p>
                  <Link href="/dashboard">
                    <Button className="mt-4 bg-white text-black hover:bg-gray-200">Mulai Belanja</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card key={item.product.id} className="bg-white/5 border-white/20 backdrop-blur">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.product.name}</h3>
                        <p className="text-sm text-gray-400">{item.product.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <p className="text-white">Rp {item.product.price.toLocaleString()}/hari</p>
                            <div className="flex items-center mt-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="bg-white/20 text-white px-2 py-1 rounded-l"
                              >
                                -
                              </button>
                              <span className="bg-white/10 text-white px-4 py-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="bg-white/20 text-white px-2 py-1 rounded-r"
                                disabled={(item.product.stockDetails?.available || 0) <= item.quantity}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Booking Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Detail Pemesanan</h2>
            <Card className="bg-white/5 border-white/20 backdrop-blur">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Tanggal Pengambilan</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={bookingDetails.pickupDate}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, pickupDate: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupTime">Jam Pengambilan</Label>
                    <Input
                      id="pickupTime"
                      type="time"
                      value={bookingDetails.pickupTime}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, pickupTime: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Tanggal Pengembalian</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={bookingDetails.returnDate}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, returnDate: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white"
                      min={bookingDetails.pickupDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnTime">Jam Pengembalian</Label>
                    <Input
                      id="returnTime"
                      type="time"
                      value={bookingDetails.returnTime}
                      onChange={(e) =>
                        setBookingDetails({ ...bookingDetails, returnTime: e.target.value })
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan Tambahan</Label>
                  <Input
                    id="notes"
                    placeholder="Misal: Warna yang diinginkan, catatan khusus, dll"
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between mb-2">
                    <span>Total Item</span>
                    <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} item</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Durasi Rental</span>
                    <span>
                      {calculateDays()} hari ({calculateNights()} malam)
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Harga per Hari</span>
                    <span>Rp {calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-white/10">
                    <span>Total Pembayaran</span>
                    <span>Rp {(calculateTotal() * calculateDays()).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={submitBooking}
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={cartItems.length === 0}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Buat Pemesanan
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    *Pembayaran dilakukan di lokasi saat pengambilan barang. Deposit sebesar 50% dari harga barang akan dikenakan dan dikembalikan saat pengembalian.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
