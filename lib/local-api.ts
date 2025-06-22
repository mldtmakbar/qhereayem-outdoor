// lib/local-api.ts
// This is a localStorage-based API to replace Supabase API calls

import { Product, Booking, User, BookingItem } from './types';

// Helper to get stored products from localStorage
function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  
  const productsJson = localStorage.getItem('mountain_gear_products');
  if (!productsJson) return [];
  
  try {
    return JSON.parse(productsJson);
  } catch (e) {
    console.error('Failed to parse products from localStorage', e);
    return [];
  }
}

// Helper to save products to localStorage
function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mountain_gear_products', JSON.stringify(products));
}

// Helper to get stored bookings from localStorage
function getStoredBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  
  const bookingsJson = localStorage.getItem('mountain_gear_bookings');
  if (!bookingsJson) return [];
  
  try {
    return JSON.parse(bookingsJson);
  } catch (e) {
    console.error('Failed to parse bookings from localStorage', e);
    return [];
  }
}

// Helper to save bookings to localStorage
function saveStoredBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('mountain_gear_bookings', JSON.stringify(bookings));
}

// Initialize with sample data if empty
function initializeProducts() {
  const products = getStoredProducts();
  if (products.length === 0) {
    const sampleProducts: Product[] = [
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
        stock: 10,
        category: "Sleeping",
        image: "/placeholder.svg?height=200&width=200",
        description: "Sleeping bag nyaman untuk cuaca dingin",
        forSale: true,
        salePrice: 350000,
        stockDetails: {
          available: 8,
          rented: 2,
          cleaning: 0,
          maintenance: 0,
        },
        rentalCount: 25,
        salesCount: 3,
      }
    ];
    saveStoredProducts(sampleProducts);
    return sampleProducts;
  }
  return products;
}

// Products API
export const productsApi = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    try {
      return initializeProducts();
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },
  
  // Get products by multiple IDs
  getProductsByIds: async (ids: number[]): Promise<Product[]> => {
    try {
      const products = getStoredProducts();
      return products.filter(product => ids.includes(product.id));
    } catch (error) {
      console.error('Error getting products by ids:', error);
      return [];
    }
  },
  
  // Get a product by ID
  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const products = getStoredProducts();
      return products.find(product => product.id === id) || null;
    } catch (error) {
      console.error('Error getting product by id:', error);
      return null;
    }
  },
  
  // Add a new product (aliases for inventory page)
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const products = getStoredProducts();
      const newId = products.length > 0 
        ? Math.max(...products.map(p => p.id)) + 1 
        : 1;
      
      const newProduct = {
        ...product,
        id: newId
      };
      
      products.push(newProduct);
      saveStoredProducts(products);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  },
  
  // createProduct alias for inventory page
  createProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    return productsApi.addProduct(product);
  },
  
  // Update a product
  updateProduct: async (id: number, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const products = getStoredProducts();
      const index = products.findIndex(product => product.id === id);
      
      if (index === -1) {
        return null;
      }
      
      products[index] = { ...products[index], ...updates };
      saveStoredProducts(products);
      return products[index];
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  },
  
  // Delete a product
  deleteProduct: async (id: number): Promise<boolean> => {
    try {
      const products = getStoredProducts();
      const filteredProducts = products.filter(product => product.id !== id);
      
      if (filteredProducts.length === products.length) {
        return false;
      }
      
      saveStoredProducts(filteredProducts);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
};

// Bookings API
export const bookingsApi = {
  // Create a new booking
  createBooking: async (booking: Omit<Booking, 'id'>): Promise<Booking | null> => {
    try {
      const bookings = getStoredBookings();
      const newId = bookings.length > 0 
        ? Math.max(...bookings.map(b => b.id)) + 1 
        : 1;
      
      const newBooking = {
        ...booking,
        id: newId
      };
      
      // Update product availability
      const products = getStoredProducts();
      for (const item of newBooking.items) {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          products[productIndex].stockDetails.available -= item.quantity;
          products[productIndex].stockDetails.rented += item.quantity;
          products[productIndex].rentalCount = (products[productIndex].rentalCount || 0) + item.quantity;
        }
      }
      
      bookings.push(newBooking);
      saveStoredBookings(bookings);
      saveStoredProducts(products);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  },
  
  // Add items to a booking
  addBookingItems: async (items: Omit<BookingItem, 'id'>[]): Promise<boolean> => {
    try {
      if (items.length === 0) return true;
      
      const bookingId = items[0].bookingId;
      const bookings = getStoredBookings();
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        return false;
      }
      
      const newItems: BookingItem[] = items.map((item, index) => ({
        ...item,
        id: Date.now() + index // Generate simple unique IDs
      }));
      
      // Add items to booking
      bookings[bookingIndex].items = [
        ...bookings[bookingIndex].items,
        ...newItems
      ];
      
      saveStoredBookings(bookings);
      return true;
    } catch (error) {
      console.error('Error adding booking items:', error);
      return false;
    }
  },
  
  // Delete a booking
  deleteBooking: async (id: number): Promise<boolean> => {
    try {
      const bookings = getStoredBookings();
      const bookingIndex = bookings.findIndex(b => b.id === id);
      
      if (bookingIndex === -1) {
        return false;
      }
      
      // Restore product availability
      const products = getStoredProducts();
      for (const item of bookings[bookingIndex].items) {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          products[productIndex].stockDetails.available += item.quantity;
          products[productIndex].stockDetails.rented -= item.quantity;
          products[productIndex].rentalCount = Math.max(0, (products[productIndex].rentalCount || 0) - item.quantity);
        }
      }
      
      // Remove the booking
      bookings.splice(bookingIndex, 1);
      saveStoredBookings(bookings);
      saveStoredProducts(products);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  },
  
  // Get all bookings
  getBookings: async (): Promise<Booking[]> => {
    try {
      return getStoredBookings();
    } catch (error) {
      console.error('Error getting bookings:', error);
      return [];
    }
  },
  
  // Get bookings by user ID
  getBookingsByUserId: async (userId: string): Promise<Booking[]> => {
    try {
      const bookings = getStoredBookings();
      return bookings.filter(booking => booking.userId === userId);
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return [];
    }
  },
  
  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking | null> => {
    try {
      const bookings = getStoredBookings();
      return bookings.find(booking => booking.id === id) || null;
    } catch (error) {
      console.error('Error getting booking by id:', error);
      return null;
    }
  },
  
  // Update booking status
  updateBookingStatus: async (id: number, status: Booking['status']): Promise<Booking | null> => {
    try {
      const bookings = getStoredBookings();
      const index = bookings.findIndex(booking => booking.id === id);
      
      if (index === -1) {
        return null;
      }
      
      bookings[index].status = status;
      saveStoredBookings(bookings);
      return bookings[index];
    } catch (error) {
      console.error('Error updating booking status:', error);
      return null;
    }
  }
};

export default { productsApi, bookingsApi };
