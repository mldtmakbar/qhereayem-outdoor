"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain, ArrowLeft, Download, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

const reportData = {
  daily: {
    date: "2024-01-15",
    totalBookings: 12,
    totalRevenue: 1850000,
    salesRevenue: 450000,
    rentalRevenue: 1400000,
    salesCount: 8,
    newCustomers: 3,
    topItems: ["Tenda Dome", "Carrier 60L", "Sleeping Bag"],
    topSales: ["Headlamp LED", "Portable Stove", "Hiking Socks"],
  },
  weekly: {
    week: "8-14 Jan 2024",
    totalBookings: 78,
    totalRevenue: 12500000,
    salesRevenue: 3200000,
    rentalRevenue: 9300000,
    salesCount: 52,
    newCustomers: 18,
    avgOrderValue: 425000,
  },
  monthly: {
    month: "Januari 2024",
    totalBookings: 285,
    totalRevenue: 45200000,
    salesRevenue: 12800000,
    rentalRevenue: 32400000,
    salesCount: 186,
    newCustomers: 65,
    repeatCustomers: 120,
  },
  yearly: {
    year: "2024",
    totalBookings: 1247,
    totalRevenue: 185600000,
    salesRevenue: 48700000,
    rentalRevenue: 136900000,
    salesCount: 845,
    newCustomers: 356,
    customerRetention: "85.7%",
  },
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("monthly")
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/login")
    }
  }, [router])

  const generateReport = () => {
    alert(`Generating ${selectedReport} report...`)
  }

  const exportReport = (format: string) => {
    alert(`Exporting report as ${format}...`)
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
            <span className="text-lg font-bold">Laporan & Reports</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Report Generator */}
        <Card className="bg-white/5 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Laporan
            </CardTitle>
            <CardDescription className="text-gray-400">Buat laporan custom sesuai kebutuhan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reportType" className="text-white">
                  Jenis Laporan
                </Label>
                <select
                  id="reportType"
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
                >
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                  <option value="sales">Laporan Penjualan</option>
                  <option value="rentals">Laporan Rental</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate" className="text-white">
                  Tanggal Mulai
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-white">
                  Tanggal Selesai
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={generateReport} className="bg-white text-black hover:bg-gray-200">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button
                onClick={() => exportReport("PDF")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={() => exportReport("Excel")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Report */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Laporan Harian</CardTitle>
              <CardDescription className="text-gray-400">{reportData.daily.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Booking</p>
                  <p className="text-2xl font-bold text-white">{reportData.daily.totalBookings}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">Rp {reportData.daily.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Rental Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.daily.rentalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sales Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.daily.salesRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400">{reportData.daily.salesCount} items sold</p>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Customer Baru</p>
                <p className="text-xl font-bold text-white">{reportData.daily.newCustomers}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Top Rental Items</p>
                  <div className="space-y-1">
                    {reportData.daily.topItems.map((item, index) => (
                      <p key={index} className="text-white text-sm">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-2">Top Sales Items</p>
                  <div className="space-y-1">
                    {reportData.daily.topSales.map((item, index) => (
                      <p key={index} className="text-white text-sm">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Report */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Laporan Mingguan</CardTitle>
              <CardDescription className="text-gray-400">{reportData.weekly.week}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Booking</p>
                  <p className="text-2xl font-bold text-white">{reportData.weekly.totalBookings}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">Rp {reportData.weekly.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Rental Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.weekly.rentalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sales Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.weekly.salesRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400">{reportData.weekly.salesCount} items sold</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Customer Baru</p>
                  <p className="text-xl font-bold text-white">{reportData.weekly.newCustomers}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Avg Order Value</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.weekly.avgOrderValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly & Yearly Reports */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Monthly Report */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Laporan Bulanan</CardTitle>
              <CardDescription className="text-gray-400">{reportData.monthly.month}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Booking</p>
                  <p className="text-2xl font-bold text-white">{reportData.monthly.totalBookings}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">Rp {reportData.monthly.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Rental Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.monthly.rentalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sales Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.monthly.salesRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400">{reportData.monthly.salesCount} items sold</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Customer Baru</p>
                  <p className="text-xl font-bold text-white">{reportData.monthly.newCustomers}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Repeat Customer</p>
                  <p className="text-xl font-bold text-white">{reportData.monthly.repeatCustomers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Report */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Laporan Tahunan</CardTitle>
              <CardDescription className="text-gray-400">{reportData.yearly.year}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Booking</p>
                  <p className="text-2xl font-bold text-white">{reportData.yearly.totalBookings}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">Rp {reportData.yearly.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Rental Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.yearly.rentalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Sales Revenue</p>
                  <p className="text-xl font-bold text-white">Rp {reportData.yearly.salesRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400">{reportData.yearly.salesCount} items sold</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Customer Baru</p>
                  <p className="text-xl font-bold text-white">{reportData.yearly.newCustomers}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Retention Rate</p>
                  <p className="text-xl font-bold text-white">{reportData.yearly.customerRetention}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <Card className="bg-white/5 border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Riwayat Export</CardTitle>
            <CardDescription className="text-gray-400">File laporan yang telah di-export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Laporan Bulanan Januari 2024.pdf", date: "15 Jan 2024", size: "2.3 MB" },
                { name: "Revenue Report Q4 2023.xlsx", date: "10 Jan 2024", size: "1.8 MB" },
                { name: "Customer Analysis 2023.pdf", date: "5 Jan 2024", size: "3.1 MB" },
                { name: "Inventory Report Dec 2023.xlsx", date: "1 Jan 2024", size: "1.2 MB" },
              ].map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-400 text-sm">
                        {file.date} • {file.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
