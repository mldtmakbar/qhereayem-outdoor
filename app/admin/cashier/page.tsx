"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Mountain,
  ArrowLeft,
  Search,
  DollarSign,
  Receipt,
  CreditCard,
  CheckCircle,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  Wallet,
  Coins,
  ArrowDown,
  ArrowUp,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Expense, ExpenseCategory, Transaction, DEFAULT_EXPENSE_CATEGORIES } from "@/lib/types"

// Sample inventory for manual transactions
const sampleInventory = [
  {
    id: 1,
    name: "Tenda Dome 4 Orang",
    price: 75000,
    price15Days: 110000, // Price for 1.5 days
    price2Days: 140000,  // Price for 2 days
    category: "Tenda",
    image: "/placeholder.svg?height=100&width=100",
  },
  { 
    id: 2, 
    name: "Sleeping Bag", 
    price: 25000, 
    price15Days: 35000, 
    price2Days: 45000, 
    category: "Sleeping", 
    image: "/placeholder.svg?height=100&width=100" 
  },
  { 
    id: 3, 
    name: "Carrier 60L", 
    price: 50000, 
    price15Days: 70000, 
    price2Days: 90000, 
    category: "Tas", 
    image: "/placeholder.svg?height=100&width=100" 
  },
  { 
    id: 4, 
    name: "Kompor Portable", 
    price: 30000, 
    price15Days: 40000, 
    price2Days: 55000, 
    category: "Masak", 
    image: "/placeholder.svg?height=100&width=100" 
  },
  { 
    id: 5, 
    name: "Headlamp", 
    price: 15000, 
    price15Days: 20000, 
    price2Days: 25000, 
    category: "Penerangan", 
    image: "/placeholder.svg?height=100&width=100" 
  },
  { 
    id: 6, 
    name: "Matras", 
    price: 20000, 
    price15Days: 27000, 
    price2Days: 35000, 
    category: "Sleeping", 
    image: "/placeholder.svg?height=100&width=100" 
  },
]

export default function CashierPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [paymentData, setPaymentData] = useState({
    method: "cash",
    amount: 0,
    notes: "",
    discount: 0,
  })
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isManualTransactionOpen, setIsManualTransactionOpen] = useState(false)
  const [manualCart, setManualCart] = useState<any[]>([])
  const [manualCustomer, setManualCustomer] = useState({
    name: "",
    phone: "",
    days: "1", // Changed to string to handle "1", "1.5", or "2" days
  })
  const [manualPayment, setManualPayment] = useState({
    method: "cash",
    discount: 0,
    notes: "",
  })
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(DEFAULT_EXPENSE_CATEGORIES)
  const [expenseData, setExpenseData] = useState<Partial<Expense>>({
    amount: 0,
    category: expenseCategories[0]?.name || "Others",
    description: "",
    paymentMethod: "cash",
    date: new Date().toISOString().split('T')[0],
    approved: true
  })
  const [financeView, setFinanceView] = useState<'all' | 'income' | 'expense'>('all')
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/login")
      return
    }

    const savedBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(savedBookings)
  }, [router])

  // Filter bookings that are paid and ready for cashier
  const paidBookings = bookings.filter((b) => b.status === "Sudah Dibayar")

  const filteredBookings = paidBookings.filter(
    (booking) =>
      booking.id.toString().includes(searchTerm) ||
      booking.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const openPaymentDialog = (booking: any) => {
    setSelectedBooking(booking)
    setPaymentData({
      method: "cash",
      amount: booking.totalAmount,
      notes: "",
      discount: 0,
    })
    setIsPaymentDialogOpen(true)
  }

  const processPayment = () => {
    if (!selectedBooking) return

    const finalAmount = paymentData.amount - paymentData.discount

    if (finalAmount <= 0) {
      alert("Jumlah pembayaran tidak valid!")
      return
    }

    // Update booking status to picked up
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id
        ? {
            ...booking,
            status: "Barang Telah Diambil",
            paymentMethod: paymentData.method,
            paidAmount: finalAmount,
            discount: paymentData.discount,
            paymentNotes: paymentData.notes,
            paymentDate: new Date().toISOString(),
          }
        : booking,
    )

    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))

    // Save transaction record
    const transaction: Transaction = {
      id: Date.now(),
      bookingId: selectedBooking.id,
      customerName: "Online Customer",
      amount: finalAmount,
      method: paymentData.method,
      discount: paymentData.discount,
      notes: paymentData.notes,
      timestamp: new Date().toISOString(),
      items: selectedBooking.items,
      type: "income",
      transactionType: "online"
    }

    const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    localStorage.setItem("transactions", JSON.stringify([...existingTransactions, transaction]))

    alert(`Barang berhasil diserahkan!\nTotal: Rp ${finalAmount.toLocaleString()}`)
    setIsPaymentDialogOpen(false)
    setSelectedBooking(null)
  }

  // Manual transaction functions
  const addToManualCart = (item: any) => {
    const existingItem = manualCart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setManualCart(
        manualCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setManualCart([...manualCart, { ...item, quantity: 1 }])
    }
  }

  const updateManualCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setManualCart(manualCart.filter((item) => item.id !== itemId))
    } else {
      setManualCart(manualCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
    }
  }

  const getManualCartTotal = () => {
    return manualCart.reduce((total, item) => {
      let itemPrice = item.price; // Default 1-day price
      
      // Use appropriate price based on selected rental duration
      if (manualCustomer.days === "1.5") {
        itemPrice = item.price15Days || Math.round(item.price * 1.5); // Fallback calculation if not specified
      } else if (manualCustomer.days === "2") {
        itemPrice = item.price2Days || (item.price * 2); // Fallback calculation if not specified
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  }

  const processManualTransaction = () => {
    if (!manualCustomer.name || manualCart.length === 0) {
      alert("Mohon lengkapi nama customer dan pilih minimal 1 item!")
      return
    }

    const subtotal = getManualCartTotal()
    const finalAmount = subtotal - manualPayment.discount

    // Save manual transaction
    const transaction: Transaction = {
      id: Date.now(),
      bookingId: undefined, // Using undefined instead of null
      customerName: manualCustomer.name,
      customerPhone: manualCustomer.phone,
      amount: finalAmount,
      method: manualPayment.method,
      discount: manualPayment.discount,
      notes: manualPayment.notes,
      timestamp: new Date().toISOString(),
      items: manualCart.map((item) => {
        let itemPrice = item.price; // Default 1-day price
        
        // Use appropriate price based on selected rental duration
        if (manualCustomer.days === "1.5") {
          itemPrice = item.price15Days || Math.round(item.price * 1.5);
        } else if (manualCustomer.days === "2") {
          itemPrice = item.price2Days || (item.price * 2);
        }
        
        return {
          ...item,
          totalPrice: itemPrice * item.quantity,
        };
      }),
      days: manualCustomer.days,
      type: "income",
      transactionType: "manual"
    }

    const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    localStorage.setItem("transactions", JSON.stringify([...existingTransactions, transaction]))

    alert(`Transaksi manual berhasil!\nCustomer: ${manualCustomer.name}\nTotal: Rp ${finalAmount.toLocaleString()}`)

    // Reset form
    setIsManualTransactionOpen(false)
    setManualCart([])
    setManualCustomer({ name: "", phone: "", days: "1" })
    setManualPayment({ method: "cash", discount: 0, notes: "" })
  }

  // Function to add an expense
  const addExpense = () => {
    if (!expenseData.amount || !expenseData.category || !expenseData.description) {
      alert("Mohon lengkapi data pengeluaran!")
      return
    }

    // Create expense record
    const expense: Expense = {
      id: Date.now(),
      amount: Number(expenseData.amount),
      date: expenseData.date || new Date().toISOString(),
      category: expenseData.category || "Others",
      description: expenseData.description || "",
      paymentMethod: expenseData.paymentMethod || "cash",
      approved: true,
      createdBy: 1, // Assume current admin has ID 1
    }

    // Also create a transaction record for reporting
    const transaction: Transaction = {
      id: expense.id,
      amount: expense.amount,
      timestamp: expense.date,
      method: expense.paymentMethod,
      notes: expense.description,
      type: 'expense',
      transactionType: 'expense',
      category: expense.category
    }

    // Save to localStorage
    const existingExpenses = JSON.parse(localStorage.getItem("expenses") || "[]")
    localStorage.setItem("expenses", JSON.stringify([...existingExpenses, expense]))

    const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    localStorage.setItem("transactions", JSON.stringify([...existingTransactions, transaction]))

    alert(`Pengeluaran berhasil dicatat!\nKategori: ${expense.category}\nJumlah: Rp ${expense.amount.toLocaleString()}`)

    // Reset form
    setIsExpenseDialogOpen(false)
    setExpenseData({
      amount: 0,
      category: expenseCategories[0]?.name || "Others",
      description: "",
      paymentMethod: "cash",
      date: new Date().toISOString().split('T')[0],
      approved: true
    })
  }

  // Convert all transactions to our new format for unified reporting
  const allTransactions: Transaction[] = JSON.parse(localStorage.getItem("transactions") || "[]").map((t: any) => {
    // Add type field if it doesn't exist (for backward compatibility)
    if (!t.type) {
      return {
        ...t,
        type: 'income',
        transactionType: t.bookingId ? 'online' : 'manual'
      }
    }
    return t;
  })

  // Filter transactions for today
  const todayTransactions = allTransactions.filter((t: Transaction) => {
    const transactionDate = new Date(t.timestamp).toDateString()
    const today = new Date().toDateString()
    return transactionDate === today
  })

  // Filter by view type
  const filteredTransactions = todayTransactions.filter((t: Transaction) => {
    if (financeView === 'all') return true;
    return t.type === financeView;
  })

  // Calculate financial summaries
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
  
  const todayExpenses = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
    
  const todayBalance = todayIncome - todayExpenses

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
              <span className="text-lg font-bold">®QHERE AYEM OUTDOOR</span>
              <p className="text-xs text-gray-400">Sistem Kasir</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Siap Diambil</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{paidBookings.length}</div>
              <p className="text-xs text-gray-400">Booking siap diserahkan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pemasukan Hari Ini</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {todayIncome.toLocaleString()}</div>
              <p className="text-xs text-green-400">Total pemasukan</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pengeluaran Hari Ini</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {todayExpenses.toLocaleString()}</div>
              <p className="text-xs text-red-400">Total pengeluaran</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Saldo Hari Ini</CardTitle>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Rp {todayBalance.toLocaleString()}</div>
              <p className="text-xs text-blue-400">Pemasukan - Pengeluaran</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
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
          <div className="flex gap-2">
            <Button onClick={() => setIsManualTransactionOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Transaksi Walk-in
            </Button>
            <Button onClick={() => setIsExpenseDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
              <ArrowDown className="h-4 w-4 mr-2" />
              Catat Pengeluaran
            </Button>
          </div>
        </div>

        {/* Ready for Pickup */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Siap Diambil Customer</h2>

          {filteredBookings.length === 0 ? (
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400">Tidak ada barang yang siap diambil!</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white/5 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Booking #{booking.id.toString().slice(-6)}</CardTitle>
                      <p className="text-gray-400 text-sm">
                        {booking.pickupDate} - {booking.returnDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-600">Sudah Dibayar</Badge>
                      <Badge className="bg-green-600">Siap Diambil</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">Item:</h4>
                    <div className="grid gap-2">
                      {booking.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
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

                  {/* Total and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div>
                      <p className="text-white font-bold text-xl">Total: Rp {booking.totalAmount.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">{booking.totalDays} hari rental</p>
                    </div>
                    <Button onClick={() => openPaymentDialog(booking)} className="bg-green-600 hover:bg-green-700">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Serahkan Barang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Transactions */}
        <div className="mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Transaksi Hari Ini</h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                variant={financeView === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFinanceView('all')}
                className={financeView === 'all' ? 'bg-white text-black' : 'border-white/20 text-white hover:bg-white/10'}
              >
                <FileText className="h-4 w-4 mr-2" />
                Semua
              </Button>
              <Button
                variant={financeView === 'income' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFinanceView('income')}
                className={financeView === 'income' ? 'bg-green-600' : 'border-white/20 text-white hover:bg-white/10'}
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Pemasukan
              </Button>
              <Button
                variant={financeView === 'expense' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFinanceView('expense')}
                className={financeView === 'expense' ? 'bg-red-600' : 'border-white/20 text-white hover:bg-white/10'}
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                Pengeluaran
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">Tidak ada transaksi {financeView === 'income' ? 'pemasukan' : financeView === 'expense' ? 'pengeluaran' : ''} hari ini</p>
                </CardContent>
              </Card>
            ) : (
              filteredTransactions.map((transaction: Transaction) => (
                <Card 
                  key={transaction.id} 
                  className={`bg-white/5 border-white/20 ${
                    transaction.type === 'expense' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {transaction.type === 'expense' ? (
                          <>
                            <p className="text-white font-medium">
                              {transaction.category || "Pengeluaran"}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {transaction.notes}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-white font-medium">
                              {transaction.transactionType === "manual"
                                ? `Walk-in - ${transaction.customerName}`
                                : `Booking #${transaction.bookingId?.toString().slice(-6)}`}
                            </p>
                          </>
                        )}
                        <p className="text-gray-400 text-sm">
                          {new Date(transaction.timestamp).toLocaleTimeString("id-ID")} • {transaction.method}
                        </p>
                        {transaction.transactionType === "manual" && transaction.customerPhone && (
                          <p className="text-gray-300 text-sm">Phone: {transaction.customerPhone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.type === 'expense' ? '- ' : '+ '}
                          Rp {transaction.amount.toLocaleString()}
                        </p>
                        {transaction.discount && transaction.discount > 0 && (
                          <p className="text-blue-400 text-sm">Diskon: Rp {transaction.discount.toLocaleString()}</p>
                        )}
                        <Badge className={
                          transaction.type === 'expense' 
                            ? 'bg-red-600' 
                            : transaction.transactionType === "manual" 
                              ? 'bg-blue-600' 
                              : 'bg-green-600'
                        }>
                          {transaction.type === 'expense' 
                            ? 'Pengeluaran' 
                            : transaction.transactionType === "manual" 
                              ? 'Walk-in' 
                              : 'Online'
                          }
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-black max-w-md">
            <DialogHeader>
              <DialogTitle>Serahkan Barang</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-black font-medium">Booking #{selectedBooking.id.toString().slice(-6)}</p>
                  <p className="text-gray-600 text-sm">Total: Rp {selectedBooking.totalAmount.toLocaleString()}</p>
                  <p className="text-green-600 text-sm">Status: Sudah Dibayar</p>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-black">
                    Catatan Penyerahan
                  </Label>
                  <Input
                    id="notes"
                    placeholder="Catatan saat menyerahkan barang..."
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                    className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={processPayment} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Konfirmasi Serahkan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentDialogOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Expense Dialog */}
        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogContent className="bg-white border-gray-200 text-black max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <ArrowDown className="h-5 w-5 mr-2 text-red-600" />
                Catat Pengeluaran
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expenseAmount" className="text-black">
                  Jumlah Pengeluaran (Rp) *
                </Label>
                <Input
                  id="expenseAmount"
                  type="number"
                  min="0"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({ ...expenseData, amount: Number(e.target.value) })}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              <div>
                <Label htmlFor="expenseCategory" className="text-black">
                  Kategori *
                </Label>
                <select
                  id="expenseCategory"
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-black"
                >
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="expenseDate" className="text-black">
                  Tanggal *
                </Label>
                <Input
                  id="expenseDate"
                  type="date"
                  value={expenseData.date as string}
                  onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              <div>
                <Label htmlFor="expenseDescription" className="text-black">
                  Deskripsi *
                </Label>
                <Input
                  id="expenseDescription"
                  placeholder="Deskripsi pengeluaran..."
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                  className="bg-white border-gray-300 text-black placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="expensePaymentMethod" className="text-black">
                  Metode Pembayaran
                </Label>
                <select
                  id="expensePaymentMethod"
                  value={expenseData.paymentMethod}
                  onChange={(e) => setExpenseData({ ...expenseData, paymentMethod: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-black"
                >
                  <option value="cash">Tunai</option>
                  <option value="transfer">Transfer Bank</option>
                  <option value="debit">Kartu Debit</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={addExpense}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!expenseData.amount || !expenseData.category || !expenseData.description}
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Catat Pengeluaran
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsExpenseDialogOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manual Transaction Dialog */}
        <Dialog open={isManualTransactionOpen} onOpenChange={setIsManualTransactionOpen}>
          <DialogContent className="bg-black/95 border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Mountain className="h-5 w-5" />
                <div>
                  <span>Transaksi Walk-in Customer</span>
                  <p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Product Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Pilih Barang</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {sampleInventory.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-white/10 border-white/20 shadow-sm cursor-pointer hover:bg-white/15 transition-colors"
                    >
                      <CardContent className="p-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <h4 className="text-white text-sm font-medium mb-1">{item.name}</h4>
                        <p className="text-gray-400 text-xs mb-2">{item.category}</p>
                        <div className="space-y-1 mb-2">
                          <p className="text-white text-xs flex justify-between">
                            <span>1 hari:</span>
                            <span className="font-bold">Rp {item.price.toLocaleString()}</span>
                          </p>
                          <p className="text-white text-xs flex justify-between">
                            <span>1.5 hari:</span>
                            <span className="font-bold">Rp {(item.price15Days || Math.round(item.price * 1.5)).toLocaleString()}</span>
                          </p>
                          <p className="text-white text-xs flex justify-between">
                            <span>2 hari:</span>
                            <span className="font-bold">Rp {(item.price2Days || (item.price * 2)).toLocaleString()}</span>
                          </p>
                        </div>
                        <Button
                          onClick={() => addToManualCart(item)}
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Tambah
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right: Cart & Customer Info */}
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Data Customer</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="customerName" className="text-gray-300">
                        Nama Customer *
                      </Label>
                      <Input
                        id="customerName"
                        placeholder="Nama lengkap customer..."
                        value={manualCustomer.name}
                        onChange={(e) => setManualCustomer({ ...manualCustomer, name: e.target.value })}
                        className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerPhone" className="text-gray-700">
                        No. HP
                      </Label>
                      <Input
                        id="customerPhone"
                        placeholder="08xxxxxxxxxx"
                        value={manualCustomer.phone}
                        onChange={(e) => setManualCustomer({ ...manualCustomer, phone: e.target.value })}
                        className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rentalDays" className="text-gray-700">
                        Lama Sewa (hari)
                      </Label>
                      <select
                        id="rentalDays"
                        value={manualCustomer.days}
                        onChange={(e) => setManualCustomer({ ...manualCustomer, days: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1">1 hari</option>
                        <option value="1.5">1.5 hari</option>
                        <option value="2">2 hari</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-gray-700" />
                    Keranjang ({manualCart.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {manualCart.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Keranjang kosong</p>
                    ) : (
                      manualCart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm">{item.name}</p>
                            <p className="text-gray-500 text-xs">Rp {item.price.toLocaleString()}/hari</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => updateManualCartQuantity(item.id, item.quantity - 1)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 border-gray-300 text-gray-800 hover:bg-gray-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-gray-800 text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              onClick={() => updateManualCartQuantity(item.id, item.quantity + 1)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 border-gray-300 text-gray-800 hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Pembayaran</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="paymentMethod" className="text-gray-700">
                        Metode Pembayaran
                      </Label>
                      <select
                        id="paymentMethod"
                        value={manualPayment.method}
                        onChange={(e) => setManualPayment({ ...manualPayment, method: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-800"
                      >
                        <option value="cash">Tunai</option>
                        <option value="transfer">Transfer Bank</option>
                        <option value="qris">QRIS</option>
                        <option value="debit">Kartu Debit</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="discount" className="text-gray-700">
                        Diskon (Rp)
                      </Label>
                      <Input
                        id="discount"
                        type="number"
                        value={manualPayment.discount}
                        onChange={(e) => setManualPayment({ ...manualPayment, discount: Number(e.target.value) })}
                        className="bg-white border-gray-300 text-gray-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentNotes" className="text-gray-700">
                        Catatan
                      </Label>
                      <Input
                        id="paymentNotes"
                        placeholder="Catatan transaksi..."
                        value={manualPayment.notes}
                        onChange={(e) => setManualPayment({ ...manualPayment, notes: e.target.value })}
                        className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({manualCustomer.days} hari):</span>
                      <span>Rp {getManualCartTotal().toLocaleString()}</span>
                    </div>
                    {manualPayment.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon:</span>
                        <span>- Rp {manualPayment.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-900 font-bold border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>Rp {(getManualCartTotal() - manualPayment.discount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={processManualTransaction}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!manualCustomer.name || manualCart.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Proses Transaksi
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsManualTransactionOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
