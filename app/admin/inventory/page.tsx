"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Mountain, ArrowLeft, Search, Plus, Edit, Trash2, Package, Loader2 } from "lucide-react"
import Link from "next/link"
import { Product } from "@/lib/types"
import { productsApi } from "@/lib/local-api"

const initialProducts = [
	{
		id: 1,
		name: "Tenda Dome 4 Orang",
		price: 75000,
		price15Days: 110000,
		price2Days: 140000,
		stock: 5,
		category: "Tenda",
		image: "/placeholder.svg?height=200&width=200",
		description: "Tenda berkualitas untuk 4 orang",
		forSale: false,
		stockDetails: {
			available: 3,
			rented: 2,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 18,
		salesCount: 0,
	},
	{
		id: 2,
		name: "Carrier 60L",
		price: 50000,
		price15Days: 70000,
		price2Days: 90000,
		stock: 8,
		category: "Tas",
		image: "/placeholder.svg?height=200&width=200",
		description: "Tas carrier kapasitas 60 liter",
		forSale: false,
		stockDetails: {
			available: 7,
			rented: 1,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 12,
		salesCount: 0,
	},
	{
		id: 3,
		name: "Sleeping Bag",
		price: 25000,
		price15Days: 35000,
		price2Days: 45000,
		stock: 12,
		category: "Sleeping",
		image: "/placeholder.svg?height=200&width=200",
		description: "Sleeping bag hangat dan nyaman",
		forSale: false,
		stockDetails: {
			available: 9,
			rented: 3,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 24,
		salesCount: 0,
	},
	{
		id: 4,
		name: "Sepatu Tracking",
		price: 30000,
		price15Days: 40000,
		price2Days: 50000,
		stock: 10,
		category: "Sepatu",
		image: "/placeholder.svg?height=200&width=200",
		description: "Sepatu untuk medan pegunungan",
		forSale: false,
		stockDetails: {
			available: 8,
			rented: 2,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 15,
		salesCount: 0,
	},
	{
		id: 5,
		name: "Matras",
		price: 15000,
		price15Days: 20000,
		price2Days: 25000,
		stock: 15,
		category: "Sleeping",
		image: "/placeholder.svg?height=200&width=200",
		description: "Matras untuk tidur di tenda",
		forSale: false,
		stockDetails: {
			available: 12,
			rented: 3,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 28,
		salesCount: 0,
	},
	{
		id: 6,
		name: "Kompor Portable",
		price: 20000,
		price15Days: 27000,
		price2Days: 35000,
		stock: 8,
		category: "Cooking",
		image: "/placeholder.svg?height=200&width=200",
		description: "Kompor portable untuk masak di gunung",
		forSale: false,
		stockDetails: {
			available: 7,
			rented: 1,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 14,
		salesCount: 0,
	},
	{
		id: 7,
		name: "Headlamp",
		price: 15000,
		price15Days: 20000,
		price2Days: 25000,
		stock: 20,
		category: "Lighting",
		image: "/placeholder.svg?height=200&width=200",
		description: "Headlamp untuk penerangan",
		forSale: true,
		salePrice: 75000,
		stockDetails: {
			available: 18,
			rented: 2,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 10,
		salesCount: 5,
	},
	{
		id: 8,
		name: "Hiking Socks",
		price: 0,
		price15Days: 0,
		price2Days: 0,
		stock: 25,
		category: "Accessories",
		image: "/placeholder.svg?height=200&width=200",
		description: "Kaos kaki hiking tebal dan anti air",
		forSale: true,
		salePrice: 15000,
		stockDetails: {
			available: 25,
			rented: 0,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 0,
		salesCount: 12,
	},
	{
		id: 9,
		name: "Trekking Pole",
		price: 0,
		price15Days: 0,
		price2Days: 0,
		stock: 15,
		category: "Accessories",
		image: "/placeholder.svg?height=200&width=200",
		description: "Tongkat trekking untuk pendakian",
		forSale: true,
		salePrice: 25000,
		stockDetails: {
			available: 15,
			rented: 0,
			cleaning: 0,
			maintenance: 0,
		},
		rentalCount: 0,
		salesCount: 8,
	},
]

export default function AdminInventoryPage() {
	const [products, setProducts] = useState<Product[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("Semua")
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [formData, setFormData] = useState({
		name: "",
		price: "",
		price15Days: "",
		price2Days: "",
		stock: "",
		category: "",
		description: "",
		image: "",
		forSale: false,
		salePrice: "",
		stockDetails: {
			available: 0,
			rented: 0,
			cleaning: 0,
			maintenance: 0,
		},
	})
	// Fetch products from local API on component mount
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setIsLoading(true)
				const productsData = await productsApi.getProducts()
				
				// If there are no products in localStorage yet, use initial data for demo
				if (productsData.length === 0) {
					setProducts(initialProducts)
					// Save initial products to localStorage for first-time setup
					initialProducts.forEach(async (product) => {
						try {
							await productsApi.createProduct(product)
						} catch (error) {
							console.error("Error seeding product:", error)
						}
					})
				} else {
					setProducts(productsData)
				}
			} catch (error) {
				console.error("Error loading products:", error)
				// Fallback to initial data if localStorage fails
				setProducts(initialProducts)
			} finally {
				setIsLoading(false)
			}
		}

		loadProducts()
	}, [])

	const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))]

	const filteredProducts = products.filter((product) => {
		const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory
		return matchesSearch && matchesCategory
	})	// Function to add a new product
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()
	
	const handleAddProduct = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setIsSubmitting(true)
			
			const product = {
				name: formData.name,
				price: parseFloat(formData.price) || 0,
				price15Days: parseFloat(formData.price15Days) || 0,
				price2Days: parseFloat(formData.price2Days) || 0,
				stock: parseInt(formData.stock) || 0,
				category: formData.category,
				image: formData.image || "/placeholder.svg?height=200&width=200",
				description: formData.description,
				forSale: formData.forSale,
				salePrice: formData.forSale ? parseFloat(formData.salePrice) || 0 : undefined,
				stockDetails: {
					available: parseInt(formData.stock) || 0,
					rented: 0,
					cleaning: 0,
					maintenance: 0,
				},
				rentalCount: 0,
				salesCount: 0,
			}
			
			const newProduct = await productsApi.addProduct(product)
			if (newProduct) {
				toast({
					title: "Success",
					description: "Product added successfully",
				})
				setProducts([...products, newProduct])
			} else {
				toast({
					title: "Error",
					description: "Failed to add product",
					variant: "destructive"
				})
			}
		} catch (error) {
			console.error("Error adding product:", error)
			toast({
				title: "Error",
				description: "An error occurred while adding the product",
				variant: "destructive"
			})
		} finally {
			setIsSubmitting(false)
			setIsAddDialogOpen(false)
		}
	};
	
	const handleDeleteProduct = async (id: number) => {
		if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
			return
		}
		
		setIsLoading(true)
		
		try {
			// Delete from local storage
			await productsApi.deleteProduct(id)
			
			// Update local state
			const updatedProducts = products.filter((product) => product.id !== id)
			setProducts(updatedProducts)
			
			toast({
				title: "Success",
				description: "Produk berhasil dihapus",
			})
		} catch (error) {
			console.error("Error deleting product:", error)
			toast({
				title: "Error",
				description: "Gagal menghapus produk. Silakan coba lagi.",
				variant: "destructive"
			})
		} finally {
			setIsLoading(false)
		}

		// Reset form and editing state
		setFormData({ 
			name: "", 
			price: "",
			price15Days: "",
			price2Days: "",
			stock: "", 
			category: "", 
			description: "", 
			image: "",
			forSale: false,
			salePrice: "",
			stockDetails: {
				available: 0,
				rented: 0,
				cleaning: 0,
				maintenance: 0,
			},
		});
		setEditingProduct(null)
	}
	
	const openEditDialog = (product: Product) => {
		setEditingProduct(product)
		setFormData({
			name: product.name,			price: product.price.toString(),
			price15Days: product.price15Days.toString(),
			price2Days: product.price2Days.toString(),
			salePrice: product.salePrice ? product.salePrice.toString() : "",
			stock: product.stock.toString(),
			category: product.category,
			description: product.description,
			image: product.image,
			forSale: product.forSale,
			stockDetails: product.stockDetails || {
				available: product.stock,
				rented: 0,
				cleaning: 0,
				maintenance: 0,
			},
		})
	};
	
	const handleSaveEditedProduct = async () => {
		if (!editingProduct) {
			toast({
				title: "Error",
				description: "No product selected for editing",
				variant: "destructive"
			})
			return
		}

		if (!formData.name || !formData.price || !formData.stock || !formData.category) {
			toast({
				title: "Error",
				description: "Mohon lengkapi semua field",
				variant: "destructive"
			})
			return
		}

		setIsLoading(true)
		
		try {
			const updatedProductData = {
				name: formData.name,
				price: Number.parseInt(formData.price),
				price15Days: Number.parseInt(formData.price15Days || "0"),
				price2Days: Number.parseInt(formData.price2Days || "0"),
				salePrice: formData.forSale ? Number.parseInt(formData.salePrice || "0") : undefined,
				stock: Number.parseInt(formData.stock),
				category: formData.category,
				description: formData.description,
				image: formData.image || editingProduct.image,
				forSale: formData.forSale,
			}

			// Update in local storage
			const updatedProduct = await productsApi.updateProduct(editingProduct.id, updatedProductData)
			
			// Update local state
			if (updatedProduct) {
				const updatedProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p) as Product[]
				setProducts(updatedProducts)
				
				// Reset form and editing state
				setFormData({ 
					name: "", 
					price: "",
					price15Days: "",
					price2Days: "",
					stock: "", 
					category: "", 
					description: "", 
					image: "",
					forSale: false,
					salePrice: "",
					stockDetails: {
						available: 0,
						rented: 0,
						cleaning: 0,
						maintenance: 0,
					},
				})
				setEditingProduct(null)
				
				toast({
					title: "Success",
					description: "Produk berhasil diperbarui"
				})
			} else {
				toast({
					title: "Error",
					description: "Failed to update product",
					variant: "destructive"
				})
			}
		} catch (error) {
			console.error("Error updating product:", error)
			alert("Gagal memperbarui produk. Silakan coba lagi.")
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Loading indicator */}
			{isLoading && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
					<div className="bg-black/90 p-6 rounded-lg border border-white/10 flex flex-col items-center">
						<Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
						<p className="text-white">Memproses...</p>
					</div>
				</div>
			)}
			
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
							<span className="text-lg font-bold">Kelola Inventori</span>
							<p className="text-xs text-gray-400 font-normal">®QHERE AYEM OUTDOOR</p>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8">
				{/* Search, Filter, and Add Button */}
				<div className="mb-6 flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Cari produk..."
							className="pl-8 bg-white/5 border-white/20 text-white"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<div className="flex gap-4">
						<select
							className="bg-white/5 border border-white/20 rounded-md text-white px-3 py-2 min-w-[150px]"
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							{categories.map((category) => (
								<option key={category} value={category}>{category}</option>
							))}
						</select>
						<Button
							className="bg-white hover:bg-white/90 text-black"
							onClick={() => setIsAddDialogOpen(true)}
						>
							<Plus className="h-4 w-4 mr-1" />
							Tambah Produk
						</Button>
					</div>
				</div>

				{/* Product Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredProducts.map((product) => (
						<Card key={product.id} className="bg-white/5 border-white/20">
							<CardContent className="p-4">
								<div className="flex flex-col gap-3">
									<div className="relative aspect-video w-full overflow-hidden rounded-md">
										<img
											src={product.image}
											alt={product.name}
											className="object-cover object-center w-full h-full"
										/>
										{product.forSale && (
											<Badge className="absolute top-2 right-2 bg-purple-500 hover:bg-purple-600">For Sale</Badge>
										)}
									</div>
									<div>
										<h3 className="text-lg font-semibold">{product.name}</h3>
										<Badge className="bg-gray-700 text-white">{product.category}</Badge>
									</div>
									<div className="text-sm text-gray-300">{product.description}</div>
									
									{!product.forSale ? (
										<div className="space-y-1 mt-1">
											<p className="text-sm flex justify-between">
												<span className="text-gray-400">Harga 1 hari:</span>
												<span className="font-semibold">Rp {product.price.toLocaleString()}</span>
											</p>
											<p className="text-sm flex justify-between">
												<span className="text-gray-400">Harga 1.5 hari:</span>
												<span className="font-semibold">Rp {(product.price15Days || Math.round(product.price * 1.5)).toLocaleString()}</span>
											</p>
											<p className="text-sm flex justify-between">
												<span className="text-gray-400">Harga 2 hari:</span>
												<span className="font-semibold">Rp {(product.price2Days || (product.price * 2)).toLocaleString()}</span>
											</p>
										</div>
									) : (
										<p className="text-sm flex justify-between mt-1">
											<span className="text-gray-400">Harga jual:</span>
											<span className="font-semibold">Rp {product.salePrice?.toLocaleString()}</span>
										</p>
									)}
									
									<div className="mt-1 space-y-1">
										<p className="text-sm flex justify-between">
											<span className="text-gray-400">Stok Total:</span>
											<span className="font-semibold">{product.stock}</span>
										</p>
										{!product.forSale && (
											<>
												<p className="text-sm flex justify-between">
													<span className="text-gray-400">Tersedia:</span>
													<span className="font-semibold">{product.stockDetails.available}</span>
												</p>
												<p className="text-sm flex justify-between">
													<span className="text-gray-400">Sedang Disewa:</span>
													<span className="font-semibold">{product.stockDetails.rented}</span>
												</p>
											</>
										)}
									</div>

									<div className="flex gap-2 mt-2">
										<Button
											onClick={() => openEditDialog(product)}
											variant="outline"
											size="sm"
											className="flex-1 border-white/20 text-white hover:bg-white/10"
										>
											<Edit className="h-4 w-4 mr-1" />
											Edit
										</Button>
										<Button
											onClick={() => handleDeleteProduct(product.id)}
											variant="outline"
											size="sm"
											className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{filteredProducts.length === 0 && (
					<div className="text-center py-12">
						<Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-400 text-lg">Tidak ada produk ditemukan</p>
					</div>
				)}

				{/* Edit Dialog */}
				<Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
					<DialogContent className="bg-black border-white/20 text-white">
						<DialogHeader>
							<DialogTitle>Edit Produk</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="edit-name">Nama Produk</Label>
								<Input
									id="edit-name"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>
							
							{/* Switch between rental or for-sale item */}
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="edit-forSale"
									checked={formData.forSale}
									onChange={(e) => setFormData({ ...formData, forSale: e.target.checked })}
									className="w-4 h-4"
								/>
								<Label htmlFor="edit-forSale">Item Dijual (Bukan Disewakan)</Label>
							</div>
							
							{!formData.forSale ? (
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="edit-price">Harga 1 Hari</Label>
										<Input
											id="edit-price"
											type="number"
											value={formData.price}
											onChange={(e) => setFormData({ ...formData, price: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 2 hari 1 malam</p>
									</div>
									<div>
										<Label htmlFor="edit-price15Days">Harga 1,5 Hari</Label>
										<Input
											id="edit-price15Days"
											type="number"
											value={formData.price15Days}
											onChange={(e) => setFormData({ ...formData, price15Days: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 3 hari 2 malam</p>
									</div>
									<div>
										<Label htmlFor="edit-price2Days">Harga 2 Hari</Label>
										<Input
											id="edit-price2Days"
											type="number"
											value={formData.price2Days}
											onChange={(e) => setFormData({ ...formData, price2Days: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 4 hari 3 malam</p>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="edit-price">Harga Sewa/Hari</Label>
										<Input
											id="edit-price"
											type="number"
											value={formData.price}
											onChange={(e) => setFormData({ ...formData, price: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
									<div>
										<Label htmlFor="edit-salePrice">Harga Jual</Label>
										<Input
											id="edit-salePrice"
											type="number"
											value={formData.salePrice}
											onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
								</div>
							)}
							
							<div>
								<Label htmlFor="edit-category">Kategori</Label>
								<Input
									id="edit-category"
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>
							
							<div>
								<Label htmlFor="edit-image">URL Gambar</Label>
								<Input
									id="edit-image"
									value={formData.image}
									onChange={(e) => setFormData({ ...formData, image: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
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
								<Label htmlFor="edit-stock">Stok</Label>
								<Input
									id="edit-stock"
									type="number"
									value={formData.stock}
									onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>
							
							{!formData.forSale && (
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="edit-available">Tersedia</Label>
										<Input
											id="edit-available"
											type="number"
											value={formData.stockDetails.available}
											onChange={(e) =>
												setFormData({
													...formData,
													stockDetails: { ...formData.stockDetails, available: Number(e.target.value) },
												})
											}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
									<div>
										<Label htmlFor="edit-rented">Sedang Disewa</Label>
										<Input
											id="edit-rented"
											type="number"
											value={formData.stockDetails.rented}
											onChange={(e) =>
												setFormData({
													...formData,
													stockDetails: { ...formData.stockDetails, rented: Number(e.target.value) },
												})
											}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
									<div>
										<Label htmlFor="edit-maintenance">Maintenance</Label>
										<Input
											id="edit-maintenance"
											type="number"
											value={formData.stockDetails.maintenance}
											onChange={(e) =>
												setFormData({
													...formData,
													stockDetails: { ...formData.stockDetails, maintenance: Number(e.target.value) },
												})
											}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
								</div>
							)}

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setEditingProduct(null)}
									className="border-white/20 text-white hover:bg-white/10"
								>
									Batal
								</Button>
								<Button
									onClick={handleSaveEditedProduct}
									className="bg-white text-black hover:bg-white/90"
								>
									Simpan
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>

				{/* Add Product Dialog */}
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogContent className="bg-black border-white/20 text-white max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Tambah Produk</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="name">Nama Produk</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>
							
							{/* Switch between rental or for-sale item */}
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									id="forSale"
									checked={formData.forSale}
									onChange={(e) => setFormData({ ...formData, forSale: e.target.checked })}
									className="w-4 h-4"
								/>
								<Label htmlFor="forSale">Item Dijual (Bukan Disewakan)</Label>
							</div>
							
							{!formData.forSale ? (
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="price">Harga 1 Hari</Label>
										<Input
											id="price"
											type="number"
											value={formData.price}
											onChange={(e) => setFormData({ ...formData, price: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 2 hari 1 malam</p>
									</div>
									<div>
										<Label htmlFor="price15Days">Harga 1,5 Hari</Label>
										<Input
											id="price15Days"
											type="number"
											value={formData.price15Days}
											onChange={(e) => setFormData({ ...formData, price15Days: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 3 hari 2 malam</p>
									</div>
									<div>
										<Label htmlFor="price2Days">Harga 2 Hari</Label>
										<Input
											id="price2Days"
											type="number"
											value={formData.price2Days}
											onChange={(e) => setFormData({ ...formData, price2Days: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
										<p className="text-xs text-gray-400 mt-1">Tarif untuk 4 hari 3 malam</p>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="price">Harga Sewa/Hari</Label>
										<Input
											id="price"
											type="number"
											value={formData.price}
											onChange={(e) => setFormData({ ...formData, price: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
									<div>
										<Label htmlFor="salePrice">Harga Jual</Label>
										<Input
											id="salePrice"
											type="number"
											value={formData.salePrice}
											onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
											className="bg-white/5 border-white/20 text-white"
										/>
									</div>
								</div>
							)}
							
							<div>
								<Label htmlFor="category">Kategori</Label>
								<Input
									id="category"
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>
							
							<div>
								<Label htmlFor="image">URL Gambar</Label>
								<Input
									id="image"
									value={formData.image}
									onChange={(e) => setFormData({ ...formData, image: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
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
								<Label htmlFor="stock">Stok</Label>
								<Input
									id="stock"
									type="number"
									value={formData.stock}
									onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
									className="bg-white/5 border-white/20 text-white"
								/>
							</div>

							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									onClick={() => setIsAddDialogOpen(false)}
									className="border-white/20 text-white hover:bg-white/10"
								>
									Batal
								</Button>								<Button
									onClick={(e) => handleAddProduct(e)}
									className="bg-white text-black hover:bg-white/90"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Processing
										</>
									) : (
										"Tambah Produk"
									)}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
