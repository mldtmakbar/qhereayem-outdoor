"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, TrendingUp, DollarSign, Calendar } from "lucide-react"
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
} from "recharts"

// Sample data for sales analytics
const monthlySalesData = [
  { month: "Jan", sales: 15, revenue: 750000 },
  { month: "Feb", sales: 12, revenue: 620000 },
  { month: "Mar", sales: 19, revenue: 980000 },
  { month: "Apr", sales: 17, revenue: 850000 },
  { month: "Mei", sales: 24, revenue: 1200000 },
  { month: "Jun", sales: 28, revenue: 1450000 },
]

const topSellingItems = [
  { name: "Headlamp LED", sales: 48, revenue: 1200000, category: "Accessories" },
  { name: "Portable Stove", sales: 36, revenue: 900000, category: "Cooking" },
  { name: "Hiking Socks", sales: 32, revenue: 480000, category: "Accessories" },
  { name: "Water Filter", sales: 28, revenue: 840000, category: "Accessories" },
  { name: "Carabiner Set", sales: 24, revenue: 720000, category: "Climbing" },
]

const categoryData = [
  { name: "Accessories", value: 2400000, color: "#3B82F6" },
  { name: "Cooking", value: 1800000, color: "#10B981" },
  { name: "Climbing", value: 1200000, color: "#F59E0B" },
  { name: "Camping", value: 900000, color: "#EF4444" },
  { name: "Clothing", value: 700000, color: "#8B5CF6" },
]

export function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="h-6 w-6" /> Sales Analytics
        </h2>
        <Tabs defaultValue="week" className="w-[300px]" onValueChange={setTimeRange} value={timeRange}>
          <TabsList className="bg-white/5">
            <TabsTrigger value="week" className="data-[state=active]:bg-white/10">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-white/10">
              Month
            </TabsTrigger>
            <TabsTrigger value="quarter" className="data-[state=active]:bg-white/10">
              Quarter
            </TabsTrigger>
            <TabsTrigger value="year" className="data-[state=active]:bg-white/10">
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/5 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Sales</CardTitle>
            <Package className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">115 items</div>
            <p className="text-xs text-green-400">+24.3% from previous period</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Sales Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Rp 5.85M</div>
            <p className="text-xs text-green-400">+18.7% from previous period</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Sale Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Rp 50.9K</div>
            <p className="text-xs text-red-400">-3.2% from previous period</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24.5%</div>
            <p className="text-xs text-green-400">+5.7% from previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Sales */}
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sales Performance</CardTitle>
            <CardDescription className="text-gray-400">Trend of sales over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlySalesData}>
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
                    name === "revenue" ? "Revenue" : "Sales Count",
                  ]}
                />
                <Bar dataKey="sales" name="Sales Count" fill="#10B981" />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sales by Category</CardTitle>
            <CardDescription className="text-gray-400">Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => `${name}`}
                >
                  {categoryData.map((entry, index) => (
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
                  formatter={(value: any) => [`Rp ${value.toLocaleString()}`, "Revenue"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Top Selling Products</CardTitle>
          <CardDescription className="text-gray-400">Best performing products by sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4">#</th>
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-right py-3 px-4">Units Sold</th>
                  <th className="text-right py-3 px-4">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingItems.map((item, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4 text-right">{item.sales}</td>
                    <td className="py-3 px-4 text-right">Rp {item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
