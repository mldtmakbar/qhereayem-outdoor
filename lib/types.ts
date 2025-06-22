// Define the product interface
export interface Product {
  id: number;
  name: string;
  price: number; // Base price for 1 day
  price15Days: number; // Price for 1.5 days
  price2Days: number; // Price for 2 days
  stock: number;
  category: string;
  image: string;
  description: string;
  // New fields for sales/rental logic
  forSale: boolean; // Whether the item is for sale (not just rental)
  salePrice?: number; // Price if being sold (could be different than rental price)
  stockDetails: {
    available: number; // Items ready to be rented
    rented: number; // Items currently being rented
    cleaning: number; // Items returned but not yet ready
    maintenance: number; // Items under repair or maintenance
  };
  salesCount?: number; // How many times the item has been sold
  rentalCount?: number; // How many times the item has been rented
}

// Define user types - Modified to remove Supabase dependencies
export interface User {
  id: string; // Changed from number to string for local storage compatibility
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'staff';
  avatar?: string | null;
  phone?: string;
  address?: string;
  createdAt?: Date | string; // Made optional and added string type for JSON storage
  joinDate?: Date | string; // Made optional and added string type for JSON storage
}

// Define booking and rental types - Modified to remove Supabase dependencies
export interface Booking {
  id: number;
  userId: string; // Changed from number to string to match User.id type
  user?: User;
  items: BookingItem[];
  startDate: Date | string; // Added string type for JSON storage
  endDate: Date | string; // Added string type for JSON storage
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date | string; // Added string type for JSON storage
  updatedAt: Date | string; // Added string type for JSON storage
  // Custom fields for UI display and special app requirements
  customFields?: {
    totalDays?: number;
    totalNights?: number;
    pickupTime?: string;
    returnTime?: string;
    notes?: string;
    [key: string]: any; // Allow additional custom fields
  };
}

export interface BookingItem {
  id: number;
  bookingId: number;
  productId: number;
  product?: Product;
  quantity: number;
  priceAtBooking: number;
}

// Define package types
export interface RentalPackage {
  id: number;
  name: string;
  description: string;
  products: Product[];
  price: number;
  discountPercentage: number;
  imageUrl?: string;
  isAvailable: boolean;
  category: string;
}

// Define cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export type Cart = CartItem[];

// Define transaction types
export interface Transaction {
  id: number;
  amount: number;
  timestamp: Date | string;
  method: string;
  notes?: string;
  type: 'income' | 'expense';
  bookingId?: number;
  customerName?: string;
  customerPhone?: string;
  items?: any[];
  days?: number | string; // Allow flexible rental periods like "1", "1.5", or "2" days
  discount?: number;
  transactionType?: 'online' | 'manual' | 'expense';
  category?: string;
}

export interface Expense {
  id: number;
  amount: number;
  date: Date | string;
  category: string;
  description: string;
  paymentMethod: string;
  receipt?: string;
  approved: boolean;
  createdBy?: number; // User ID who created the expense
  approvedBy?: number; // User ID who approved the expense
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
}

// Default expense categories
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 1, name: 'Inventory Restock', description: 'Purchases of new inventory items' },
  { id: 2, name: 'Equipment Maintenance', description: 'Repairs and maintenance of rental equipment' },
  { id: 3, name: 'Office Supplies', description: 'Office supplies and stationery' },
  { id: 4, name: 'Utilities', description: 'Electricity, water, internet, etc.' },
  { id: 5, name: 'Rent', description: 'Store/office rent payments' },
  { id: 6, name: 'Salaries', description: 'Employee salaries' },
  { id: 7, name: 'Marketing', description: 'Advertising and promotional expenses' },
  { id: 8, name: 'Transport', description: 'Transportation costs' },
  { id: 9, name: 'Others', description: 'Other miscellaneous expenses' }
];

// Define analytics types
export interface SalesData {
  date: string;
  rentalRevenue: number; // Revenue from rentals
  salesRevenue: number; // Revenue from sales
  totalRevenue: number; // Combined revenue
  bookings: number;
  sales: number; // Number of sales transactions
}

export interface InventoryStatus {
  category: string;
  totalItems: number;
  availableItems: number;
  rentedItems: number;
  cleaningItems: number; // Items returned but being cleaned
  maintenanceItems: number; // Items under repair
}

export interface PopularProduct extends Product {
  rentCount: number;
  salesCount: number; // For sold items
  totalRevenue: number; // Combined revenue from rental and sales
}

// Define API response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Define pagination type
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

// Define sale item interface - used for purchases rather than rentals
export interface SaleItem {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  price: number;
  timestamp: Date;
  customerId?: number;
  transactionId: number;
}

// Define sales analytics types
export interface BestSellerProduct {
  id: number;
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
  averageRating?: number;  // if you implement ratings
  inStock: number;
}

export interface SalesByCategoryData {
  category: string;
  salesCount: number;
  revenue: number;
  percentageOfTotal: number;
}

export interface SalesTrend {
  period: string;  // can be a date, month, quarter, etc.
  salesCount: number;
  revenue: number;
  averageOrderValue: number;
  comparisonToPrevious?: number;  // percentage change from previous period
}

export interface SalesPerformance {
  totalSales: number;
  totalRevenue: number;
  averageSaleValue: number;
  bestSellingProducts: BestSellerProduct[];
  salesByCategory: SalesByCategoryData[];
  trends: SalesTrend[];
  comparisonToRental?: {
    salesPercentage: number;
    rentalPercentage: number;
    totalRevenue: number;
  }
}
