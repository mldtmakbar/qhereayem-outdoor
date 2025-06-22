import { NextResponse } from 'next/server';
import type { Product, ApiResponse, PaginatedResult } from '@/lib/types';

// Sample data - in a real app, this would come from a database
const products: Product[] = [
  {
    id: 1,
    name: "Tenda Dome 4 Orang",
    price: 75000,
    stock: 5,
    category: "Tenda",
    image: "/placeholder.svg?height=200&width=200",
    description: "Tenda berkualitas untuk 4 orang",
    forSale: false,
    stockDetails: {
      available: 3,
      rented: 2,
      cleaning: 0,
      maintenance: 0
    },
    rentalCount: 18,
    salesCount: 0
  },  {
    id: 2,
    name: "Carrier 60L",
    price: 50000,
    stock: 8,
    category: "Tas",
    image: "/placeholder.svg?height=200&width=200",
    description: "Tas carrier kapasitas 60 liter",
    forSale: false,
    stockDetails: {
      available: 7,
      rented: 1,
      cleaning: 0,
      maintenance: 0
    },
    rentalCount: 12,
    salesCount: 0
  },
  // Add more products as needed
];

export async function GET(request: Request) {
  // Get URL parameters
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  // Filter products based on query parameters
  let filteredProducts = [...products];
  
  if (category && category !== 'Semua') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Calculate pagination
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Create response using our types
  const response: ApiResponse<PaginatedResult<Product>> = {
    status: 'success',
    data: {
      data: paginatedProducts,
      total,
      currentPage: page,
      totalPages,
      limit
    }
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate that the body matches our Product type
    // In a real app, you would do more thorough validation
    const requiredFields = ['name', 'price', 'stock', 'category', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          status: 'error',
          message: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }    // Add a new product (in a real app, this would save to a database)
    const newProduct: Product = {
      id: products.length + 1,
      name: body.name,
      price: body.price,
      stock: body.stock,
      category: body.category,
      image: body.image || "/placeholder.svg?height=200&width=200",
      description: body.description,
      forSale: body.forSale || false,
      stockDetails: body.stockDetails || {
        available: body.stock,
        rented: 0,
        cleaning: 0,
        maintenance: 0
      },
      rentalCount: 0,
      salesCount: 0
    };

    // Add to products array (simulating database insert)
    products.push(newProduct);

    // Return success response
    const response: ApiResponse<Product> = {
      status: 'success',
      data: newProduct,
      message: 'Product added successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to add product'
    }, { status: 500 });
  }
}
