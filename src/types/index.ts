export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'customer' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  brand: string
  images: string[]
  thumbnail: string
  inStock: boolean
  stockQuantity: number
  variants?: ProductVariant[]
  specifications?: Record<string, string>
  features?: string[]
  tags: string[]
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'material'
  value: string
  price?: number
  stockQuantity: number
  image?: string
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  variant?: ProductVariant
  addedAt: Date
}

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  variant?: ProductVariant
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  user: {
    name: string
    avatar?: string
  }
  rating: number
  title: string
  comment: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
  productCount: number
  isActive: boolean
  order: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
  isActive: boolean
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom: Date
  validTo: Date
  isActive: boolean
}

export interface SearchFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  isOnSale?: boolean
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  data: T
  pagination?: PaginationInfo
  message?: string
  success: boolean
}