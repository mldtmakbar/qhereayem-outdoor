"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/auth-local"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, History, LogOut, Filter, Package, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Product, CartItem, Cart } from "@/lib/types"
import { productsApi } from "@/lib/local-api"

export default function Dashboard() {
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("Semua")
	const [cart, setCart] = useState<Cart>([])
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<string[]>(["Semua"])
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()

	// Check authentication status
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const user = await auth.getUser();
				
				if (!user) {
					router.push("/login");
					return;
				}
				
				// Save role for components that use localStorage
				localStorage.setItem("userRole", user.role);
				
				// If user is admin, redirect to admin page
				if (user.role === "admin") {
					router.push("/admin");
				}
			} catch (error) {
				console.error('Error checking authentication:', error);
				router.push("/login");
			}
		};
		
		checkAuth();
	}, [router])

	// Load products from local API
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setIsLoading(true)
				const productsData = await productsApi.getProducts()
				
				if (productsData.length > 0) {
					setProducts(productsData)
					
					// Extract unique categories from products
					const uniqueCategories = Array.from(
						new Set(productsData.map((p) => p.category))
					)
					setCategories(["Semua", ...uniqueCategories])
				} else {
					// If no products are available, set empty array
					setProducts([])
				}
			} catch (error) {
				console.error("Error loading products:", error)
				setProducts([])
			} finally {
				setIsLoading(false)
			}
		}

		loadProducts()
	}, [])

	// Filter products based on search term and category
	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	const addToCart = (product: Product) => {
		// Check if product is already in cart
		const existingItemIndex = cart.findIndex((item) => item.product.id === product.id)

		// Check if we have enough stock
		const availableStock = product.stockDetails?.available || 0
		const cartQuantity = existingItemIndex !== -1 ? cart[existingItemIndex].quantity : 0

		if (availableStock <= cartQuantity) {
			alert("Stok tidak mencukupi")
			return
		}

		if (existingItemIndex !== -1) {
			// If product exists in cart, increase quantity
			const updatedCart = [...cart]
			updatedCart[existingItemIndex].quantity += 1
			setCart(updatedCart)
		} else {
			// If product is new to cart, add it with quantity 1
			setCart([...cart, { product, quantity: 1 }])
		}
	}

	const handleLogout = async () => {
		try {
			await auth.signOut();
			localStorage.removeItem("userRole");
			router.push("/login");
		} catch (error) {
			console.error("Error signing out:", error);
			router.push("/login");
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
				<svg
					className="absolute bottom-0 w-full h-64 opacity-10"
					viewBox="0 0 1200 300"
					fill="none"
				>
					<path
						d="M0 300L200 100L400 200L600 50L800 150L1000 80L1200 200V300H0Z"
						fill="white"
					/>
					<path
						d="M0 300L150 150L350 250L550 100L750 200L950 130L1200 250V300H0Z"
						fill="white"
						opacity="0.5"
					/>
				</svg>
			</div>

			{/* Header */}
			<header className="relative z-10 border-b border-white/10 bg-black/80 backdrop-blur">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<img
							src="/images/logo-new.png"
							alt="Logo"
							className="h-8 w-8"
						/>
						<span className="text-xl font-bold">®QHERE AYEM OUTDOOR</span>
					</div>
					<div className="flex items-center gap-4">
						<Link href="/dashboard">
							<Button variant="ghost" className="text-white hover:bg-white/10 bg-white/10">
								Gear
							</Button>
						</Link>
						<Link href="/dashboard/packages">
							<Button variant="ghost" className="text-white hover:bg-white/10">
								<Package className="h-4 w-4 mr-2" />
								Paket
							</Button>
						</Link>
						<Link href="/dashboard/chat">
							<Button variant="ghost" className="text-white hover:bg-white/10">
								<MessageCircle className="h-4 w-4 mr-2" />
								AI Chat
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
									<Badge
										variant="default"
										className="absolute -top-2 -right-2 bg-white text-black text-xs"
									>
										{cart.reduce((total, item) => total + item.quantity, 0)}
									</Badge>
								)}
							</Button>
						</Link>
						<Link href="/dashboard/profile">
							<Button variant="ghost" className="text-white hover:bg-white/10">
								<User className="h-4 w-4 mr-2" />
								Profil
							</Button>
						</Link>
						<Button
							variant="ghost"
							onClick={handleLogout}
							className="text-white hover:bg-white/10"
						>
							<LogOut className="h-4 w-4 mr-2" />
							Keluar
						</Button>
					</div>
				</div>
			</header>

			<div className="relative z-10 container mx-auto px-4 py-8">
				{/* Rental Policy Information */}
				<div className="mb-6">
					<Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-white/10">
						<CardContent className="p-4">
							<h2 className="text-xl font-bold text-white mb-3">
								Kebijakan Penyewaan
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<ul className="space-y-2 list-disc pl-5">
										<li>
											Pembayaran dilakukan{" "}
											<strong className="text-white">di lokasi</strong> saat
											pengambilan barang.
										</li>
										<li>
											Deposit sebesar 50% dari harga barang akan dikenakan dan
											dikembalikan saat pengembalian.
										</li>
										<li>
											Biaya dihitung per 24 jam. Keterlambatan dikenakan biaya
											tambahan sebesar 50% dari harga sewa per hari.
										</li>
										<li>
											Penggantian barang rusak/hilang dikenakan biaya sesuai
											harga barang.
										</li>
									</ul>
								</div>
								<div>
									<ul className="space-y-2 list-disc pl-5">
										<li>
											Harap membawa KTP/SIM dan alamat yang jelas saat
											pengambilan.
										</li>
										<li>
											Reservasi dapat dilakukan 1-30 hari sebelum pengambilan.
										</li>
										<li>
											Pembatalan dapat dilakukan minimal 3 hari sebelum tanggal
											pengambilan.
										</li>
										<li>
											Kami juga menjual beberapa item. Item yang dijual ditandai
											dengan label khusus.
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Search and Filter */}
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
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="bg-white/5 border border-white/20 rounded-md px-3 py-2 text-white"
							>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Loading State */}
				{isLoading ? (
					<div className="flex justify-center items-center py-20">
						<div className="flex flex-col items-center">
							<Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
							<p className="text-white text-lg">Mengambil data peralatan...</p>
						</div>
					</div>
				) : (
					<>
						{/* Products Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredProducts.map((product) => (
								<Card
									key={product.id}
									className="bg-white/5 border-white/20 hover:border-white/40 transition-colors backdrop-blur"
								>
									<CardContent className="p-4">
										<img
											src={product.image || "/placeholder.svg"}
											alt={product.name}
											className="w-full h-48 object-cover rounded-lg mb-4"
										/>
										<div className="space-y-2">
											<div className="flex items-start justify-between">
												<h3 className="font-semibold text-white text-sm">
													{product.name}
												</h3>
												<div className="flex flex-wrap gap-1">
													{product.forSale && (
														<Badge
															variant="secondary"
															className="text-xs bg-green-500/20 text-green-300"
														>
															Dijual
														</Badge>
													)}
													<Badge
														variant="secondary"
														className="text-xs bg-white/20 text-white"
													>
														{product.category}
													</Badge>
												</div>
											</div>
											<p className="text-gray-400 text-xs">
												{product.description}
											</p>
											<div className="flex items-center justify-between">
												{product.forSale ? (
													<div>
														<p className="text-white font-bold">
															Rp{" "}
															{product.salePrice?.toLocaleString()}{" "}
															<span className="text-xs">(jual)</span>
														</p>
														{product.price > 0 && (
															<p className="text-xs text-gray-400">
																Rp {product.price.toLocaleString()}/hari sewa
															</p>
														)}
													</div>
												) : (
													<p className="text-white font-bold">
														Rp {product.price.toLocaleString()}/hari
													</p>
												)}
												<Badge
													variant="default"
													className={
														(product.stockDetails?.available || 0) > 0
															? "bg-green-600"
															: "bg-red-600"
													}
												>
													{(product.stockDetails?.available || 0) > 0
														? `Tersedia: ${product.stockDetails?.available || 0}`
														: "Habis"}
												</Badge>
											</div>
											<Button
												onClick={() => addToCart(product)}
												disabled={(product.stockDetails?.available || 0) <= 0}
												className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-600"
											>
												{(product.stockDetails?.available || 0) > 0
													? product.forSale
														? "Beli"
														: "Sewa"
													: "Stok Habis"}
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{filteredProducts.length === 0 && (
							<div className="text-center py-12">
								<p className="text-gray-400 text-lg">Tidak ada produk yang ditemukan</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}

