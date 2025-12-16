export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: "men" | "women" | "kids"
  subcategory?: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  rating: number
  reviews: number
  reviewsList?: Review[]
  inStock: boolean
  featured?: boolean
  bestSeller?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface User {
  id: string
  username: string
  name: string
  email: string
  phone?: string
  avatar?: string
  address?: Address
  isVerified: boolean
}

export interface Address {
  fullName: string
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  subtotal: number
  shipping: number
  taxes: number
  paymentMethod: "credit-card" | "wallet" | "cash-on-delivery"
  shippingAddress: Address
  phone: string
  createdAt: string
  estimatedDelivery: string
  statusHistory: { status: string; date: string }[]
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  text: string
  createdAt: string
}
