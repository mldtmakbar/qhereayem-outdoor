"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mountain, ArrowLeft, TrendingUp, DollarSign, Users, Calendar, Package } from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const monthlyData = [
  {
    month: "Jan",
    revenue: 2400000,
    bookings: 45,
    customers: 38,
    salesRevenue: 750000,
    salesCount: 15,
  },
  {
    month: "Feb",
    revenue: 1800000,
    bookings: 32,
    customers: 28,
    salesRevenue: 620000,
    salesCount: 12,
  },
  {
    month: "Mar",
    revenue: 3200000,
    bookings: 58,
    customers: 52,
    salesRevenue: 980000,
    salesCount: 19,
  },
  {
    month: "Apr",
    revenue: 2800000,
    bookings: 48,
    customers: 41,
    salesRevenue: 850000,
    salesCount: 17,
  },
  {
    month: "Mei",
    revenue: 3600000,
    bookings: 65,
    customers: 58,
    salesRevenue: 1200000,
    salesCount: 24,
  },
  {
    month: "Jun",
    revenue: 4200000,
    bookings: 72,
    customers: 65,
    salesRevenue: 1450000,
    salesCount: 28,
  },
  {
    month: "Jul",
    revenue: 4800000,
    bookings: 85,
    customers: 78,
    salesRevenue: 1650000,
    salesCount: 32,
  },
  {
    month: "Agu",
    revenue: 5200000,
    bookings: 92,
    customers: 85,
    salesRevenue: 1780000,
    salesCount: 35,
  },
  {
    month: "Sep",
    revenue: 4600000,
    bookings: 78,
    customers: 72,
    salesRevenue: 1520000,
    salesCount: 30,
  },
  {
    month: "Okt",
    revenue: 5800000,
    bookings: 98,
    customers: 89,
    salesRevenue: 1950000,
    salesCount: 38,
  },
  {
    month: "Nov",
    revenue: 6200000,
    bookings: 105,
    customers: 95,
    salesRevenue: 2100000,
    salesCount: 41,
  },
  {
    month: "Des",
    revenue: 7200000,
    bookings: 125,
    customers: 112,
    salesRevenue: 2450000,
    salesCount: 48,
  },
]

const categoryRevenue = [
  { name: "Tenda", revenue: 15600000, percentage: 35, color: "#3B82F6" },
  { name: "Tas Carrier", revenue: 8900000, percentage: 20, color: "#10B981" },
  { name: "Sleeping Gear", revenue: 6700000, percentage: 15, color: "#F59E0B" },
  { name: "Cooking", revenue: 5300000, percentage: 12, color: "#EF4444" },
  { name: "Lighting", revenue: 4200000, percentage: 10, color: "#8B5CF6" },
  { name: "Accessories", revenue: 3500000, percentage: 8, color: "#EC4899" },
]

// Add best seller data for sold items (not rentals)
const bestSellers = [
  { name: "Headlamp LED", salesCount: 48, revenue: 1200000, category: "Accessories" },
  { name: "Portable Stove", salesCount: 36, revenue: 900000, category: "Cooking" },
  { name: "Hiking Socks", salesCount: 32, revenue: 480000, category: "Accessories" },
  { name: "Water Filter", salesCount: 28, revenue: 840000, category: "Accessories" },
  { name: "Carabiner Set", salesCount: 24, revenue: 720000, category: "Climbing" },
]

// Track sales vs rental revenue
const revenueByType = [
  { month: "Jan", rental: 2400000, sales: 750000 },
  { month: "Feb", rental: 1800000, sales: 620000 },
  { month: "Mar", rental: 3200000, sales: 980000 },
  { month: "Apr", rental: 2800000, sales: 850000 },
  { month: "Mei", rental: 3600000, sales: 1200000 },
  { month: "Jun", rental: 4200000, sales: 1450000 },
]

const dailyBookings = [
  { day: "Sen", bookings: 12, revenue: 850000 },
  { day: "Sel", bookings: 15, revenue: 1200000 },
  { day: "Rab", bookings: 8, revenue: 650000 },
  { day: "Kam", bookings: 18, revenue: 1450000 },
  { day: "Jum", bookings: 22, revenue: 1800000 },
  { day: "Sab", bookings: 35, revenue: 2800000 },
  { day: "Min", bookings: 28, revenue: 2200000 },
]

const topCustomers = [
  { name: "Ahmad Rizki", bookings: 15, totalSpent: 2250000 },
  { name: "Sari Dewi", bookings: 12, totalSpent: 1800000 },
  { name: "Budi Santoso", bookings: 10, totalSpent: 1500000 },
  { name: "Maya Putri", bookings: 8, totalSpent: 1200000 },
  { name: "Eko Prasetyo", bookings: 7, totalSpent: 1050000 },
]

export default function AnalyticsPage() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "admin") {
      router.push("/login")
    }
  }, [router])

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
          </Link>          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-white" />
            <div>
              <span className="text-lg font-bold">Analytics Dashboard</span>
              <p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Analytics Mode Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="overview">
            <TabsList className="bg-white/5 border-white/20">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
              <TabsTrigger value="rental" className="data-[state=active]:bg-white/10">Rental Analytics</TabsTrigger>
              <TabsTrigger value="sales" className="data-[state=active]:bg-white/10">Sales Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Rp 54.2M</div>
                    <p className="text-xs text-green-400">+20.1% dari tahun lalu</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Rental Revenue</CardTitle>
                    <Mountain className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Rp 38.4M</div>
                    <p className="text-xs text-green-400">+15.2% dari tahun lalu</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Sales Revenue</CardTitle>
                    <Package className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Rp 15.8M</div>
                    <p className="text-xs text-green-400">+28.5% dari tahun lalu</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">1,247</div>
                    <p className="text-xs text-green-400">+8.2% dari tahun lalu</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">623</div>
                    <p className="text-xs text-green-400">+12.5% dari tahun lalu</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Revenue</CardTitle>
                    <CardDescription className="text-gray-400">
                      Breakdown of monthly revenue including rental and sales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#22222f" />
                          <XAxis dataKey="month" stroke="#999" />
                          <YAxis stroke="#999" tickFormatter={(value) => `${value / 1000000}M`} />
                          <Tooltip 
                            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, ``]}
                            contentStyle={{ 
                              backgroundColor: 'rgba(20, 20, 30, 0.9)',
                              borderColor: 'rgba(255,255,255,0.1)',
                              color: '#fff'
                            }} 
                          />
                          <Bar dataKey="revenue" name="Rental Revenue" fill="#3b82f6" />
                          <Bar dataKey="salesRevenue" name="Sales Revenue" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue by Category</CardTitle>
                    <CardDescription className="text-gray-400">
                      Distribution of revenue across product categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <div className="w-[200px] h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryRevenue}
                            dataKey="percentage"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryRevenue.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number, name: string, props: any) => {
                              const data = props.payload;
                              return [`Rp ${data.revenue.toLocaleString()}`, name];
                            }}
                            contentStyle={{ 
                              backgroundColor: 'rgba(20, 20, 30, 0.9)',
                              borderColor: 'rgba(255,255,255,0.1)',
                              color: '#fff'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {categoryRevenue.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm text-gray-300">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Best Sellers Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Top Rental Items</CardTitle>
                    <CardDescription className="text-gray-400">
                      Most popular rental gear by booking frequency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-white/10">
                      <div className="grid grid-cols-3 p-3 text-sm font-medium text-gray-400 bg-white/5">
                        <div>Product</div>
                        <div className="text-center">Rentals</div>
                        <div className="text-right">Revenue</div>
                      </div>
                      <div className="divide-y divide-white/5">
                        <div className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-white">Tenda Dome 4 Orang</div>
                          <div className="text-center text-white">48</div>
                          <div className="text-right text-white">Rp 3,600,000</div>
                        </div>
                        <div className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-white">Carrier 60L</div>
                          <div className="text-center text-white">42</div>
                          <div className="text-right text-white">Rp 2,100,000</div>
                        </div>
                        <div className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-white">Sleeping Bag</div>
                          <div className="text-center text-white">38</div>
                          <div className="text-right text-white">Rp 950,000</div>
                        </div>
                        <div className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-white">Matras Camping</div>
                          <div className="text-center text-white">32</div>
                          <div className="text-right text-white">Rp 640,000</div>
                        </div>
                        <div className="grid grid-cols-3 p-3 text-sm">
                          <div className="text-white">Kompor Portable</div>
                          <div className="text-center text-white">28</div>
                          <div className="text-right text-white">Rp 560,000</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Best Sellers Table - SALES */}
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Top Selling Items</CardTitle>
                    <CardDescription className="text-gray-400">
                      Most popular items for purchase by sales count
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border border-white/10">
                      <div className="grid grid-cols-3 p-3 text-sm font-medium text-gray-400 bg-white/5">
                        <div>Product</div>
                        <div className="text-center">Sold</div>
                        <div className="text-right">Revenue</div>
                      </div>
                      <div className="divide-y divide-white/5">
                        {bestSellers.map((item, index) => (
                          <div key={index} className="grid grid-cols-3 p-3 text-sm">
                            <div className="text-white">{item.name}</div>
                            <div className="text-center text-white">{item.salesCount}</div>
                            <div className="text-right text-white">Rp {item.revenue.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="rental" className="mt-4">
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-white">Rental Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Rentals</CardTitle>
                      <Mountain className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">1,247</div>
                      <p className="text-xs text-green-400">+15.3% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Rental Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">Rp 38.4M</div>
                      <p className="text-xs text-green-400">+15.2% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Average Rental</CardTitle>
                      <Calendar className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">3.2 hari</div>
                      <p className="text-xs text-green-400">+0.4 hari dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Return Rate</CardTitle>
                      <Users className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">68.5%</div>
                      <p className="text-xs text-green-400">+5.2% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* More rental-specific analytics can go here */}
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="mt-4">
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-white">Sales Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Sales</CardTitle>
                      <Package className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">432</div>
                      <p className="text-xs text-green-400">+28.3% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Sales Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">Rp 15.8M</div>
                      <p className="text-xs text-green-400">+28.5% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Avg Sales Value</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">Rp 365K</div>
                      <p className="text-xs text-green-400">+3.2% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
                      <Users className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">24.8%</div>
                      <p className="text-xs text-green-400">+2.5% dari tahun lalu</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* More sales-specific analytics can go here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Detailed Stats */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Conversion Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Visitor to Lead</span>
                <span className="text-white font-bold">24.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Lead to Customer</span>
                <span className="text-white font-bold">68.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Overall Conversion</span>
                <span className="text-white font-bold">16.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg Time to Convert</span>
                <span className="text-white font-bold">3.2 days</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Top Customers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{customer.name}</span>
                  <span className="text-white font-bold">Rp {customer.totalSpent.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Business Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Monthly Growth</span>
                <span className="text-green-400 font-bold">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Customer Growth</span>
                <span className="text-green-400 font-bold">+8.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Revenue Growth</span>
                <span className="text-green-400 font-bold">+15.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Market Share</span>
                <span className="text-white font-bold">23.4%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
