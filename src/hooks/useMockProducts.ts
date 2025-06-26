import { useState, useEffect } from 'react'
import { Product, SearchFilters } from '@/types'

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'electronics',
    subcategory: 'audio',
    brand: 'AudioTech',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 25,
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years'
    },
    features: ['Noise Cancellation', 'Wireless Charging', 'Voice Assistant'],
    tags: ['wireless', 'headphones', 'audio', 'premium'],
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring and GPS.',
    price: 299.99,
    originalPrice: 349.99,
    category: 'electronics',
    subcategory: 'wearables',
    brand: 'FitTech',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 15,
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart Rate, GPS, Accelerometer'
    },
    features: ['GPS Tracking', 'Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant'],
    tags: ['smartwatch', 'fitness', 'health', 'gps'],
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Designer Leather Jacket',
    description: 'Premium genuine leather jacket with modern design and superior craftsmanship.',
    price: 449.99,
    originalPrice: 599.99,
    category: 'fashion',
    subcategory: 'outerwear',
    brand: 'StyleCraft',
    images: [
      'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 8,
    variants: [
      { id: 'size-s', name: 'Size', type: 'size', value: 'S', stockQuantity: 2 },
      { id: 'size-m', name: 'Size', type: 'size', value: 'M', stockQuantity: 3 },
      { id: 'size-l', name: 'Size', type: 'size', value: 'L', stockQuantity: 3 }
    ],
    specifications: {
      'Material': '100% Genuine Leather',
      'Lining': 'Polyester',
      'Care': 'Professional Clean Only',
      'Origin': 'Italy'
    },
    features: ['Genuine Leather', 'YKK Zippers', 'Interior Pockets', 'Adjustable Cuffs'],
    tags: ['leather', 'jacket', 'fashion', 'designer'],
    rating: 4.9,
    reviewCount: 67,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    description: '85mm f/1.4 professional portrait lens with exceptional image quality.',
    price: 1299.99,
    category: 'electronics',
    subcategory: 'cameras',
    brand: 'LensMaster',
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 5,
    specifications: {
      'Focal Length': '85mm',
      'Maximum Aperture': 'f/1.4',
      'Minimum Focus': '0.85m',
      'Weight': '1050g'
    },
    features: ['Weather Sealed', 'Ultra-Fast Autofocus', 'Image Stabilization'],
    tags: ['camera', 'lens', 'photography', 'professional'],
    rating: 4.7,
    reviewCount: 34,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    description: 'Premium ergonomic office chair with lumbar support and adjustable features.',
    price: 399.99,
    originalPrice: 499.99,
    category: 'home',
    subcategory: 'furniture',
    brand: 'ComfortSeating',
    images: [
      'https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 12,
    specifications: {
      'Material': 'Mesh and Fabric',
      'Weight Capacity': '300 lbs',
      'Dimensions': '26" W x 26" D x 40-44" H',
      'Warranty': '5 years'
    },
    features: ['Lumbar Support', 'Adjustable Height', 'Breathable Mesh', '360° Swivel'],
    tags: ['office', 'chair', 'ergonomic', 'furniture'],
    rating: 4.5,
    reviewCount: 156,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '6',
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical gaming keyboard with customizable keys.',
    price: 149.99,
    originalPrice: 199.99,
    category: 'electronics',
    subcategory: 'gaming',
    brand: 'GameTech',
    images: [
      'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800',
    inStock: true,
    stockQuantity: 30,
    specifications: {
      'Switch Type': 'Mechanical Blue',
      'Backlight': 'RGB',
      'Connectivity': 'USB-C',
      'Layout': 'Full Size'
    },
    features: ['RGB Lighting', 'Mechanical Switches', 'Programmable Keys', 'Anti-Ghosting'],
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    rating: 4.4,
    reviewCount: 203,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'electronics',
    subcategory: 'accessories',
    brand: 'ChargeTech',
    images: [
      'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 50,
    specifications: {
      'Output': '15W Fast Charging',
      'Compatibility': 'Qi-enabled devices',
      'Dimensions': '4" x 4" x 0.4"',
      'Cable': 'USB-C included'
    },
    features: ['Fast Charging', 'LED Indicator', 'Non-Slip Base', 'Overcharge Protection'],
    tags: ['wireless', 'charging', 'pad', 'qi'],
    rating: 4.3,
    reviewCount: 87,
    isNew: true,
    isFeatured: false,
    isOnSale: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '8',
    name: 'Luxury Silk Scarf',
    description: 'Hand-crafted silk scarf with elegant patterns and premium quality.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'fashion',
    subcategory: 'accessories',
    brand: 'SilkLux',
    images: [
      'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    thumbnail: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=400',
    inStock: true,
    stockQuantity: 20,
    variants: [
      { id: 'color-blue', name: 'Color', type: 'color', value: 'Blue', stockQuantity: 7 },
      { id: 'color-red', name: 'Color', type: 'color', value: 'Red', stockQuantity: 6 },
      { id: 'color-gold', name: 'Color', type: 'color', value: 'Gold', stockQuantity: 7 }
    ],
    specifications: {
      'Material': '100% Mulberry Silk',
      'Dimensions': '35" x 35"',
      'Care': 'Dry Clean Only',
      'Origin': 'France'
    },
    features: ['Hand-Rolled Edges', 'Colorfast Dyes', 'Gift Box Included'],
    tags: ['silk', 'scarf', 'luxury', 'accessories'],
    rating: 4.8,
    reviewCount: 45,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-14')
  }
]

interface UseMockProductsOptions extends SearchFilters {
  limit?: number
  page?: number
}

export const useMockProducts = (options: UseMockProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredProducts = [...mockProducts]

      // Apply filters
      if (options.category) {
        filteredProducts = filteredProducts.filter(p => p.category === options.category)
      }

      if (options.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand === options.brand)
      }

      if (options.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= options.minPrice!)
      }

      if (options.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= options.maxPrice!)
      }

      if (options.rating !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.rating >= options.rating!)
      }

      if (options.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.inStock === options.inStock)
      }

      if (options.isOnSale !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isOnSale === options.isOnSale)
      }

      if ('isFeatured' in options && options.isFeatured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isFeatured === options.isFeatured)
      }

      // Apply sorting
      if (options.sortBy) {
        filteredProducts.sort((a, b) => {
          let aValue: any, bValue: any

          switch (options.sortBy) {
            case 'name':
              aValue = a.name.toLowerCase()
              bValue = b.name.toLowerCase()
              break
            case 'price':
              aValue = a.price
              bValue = b.price
              break
            case 'rating':
              aValue = a.rating
              bValue = b.rating
              break
            case 'newest':
              aValue = a.createdAt.getTime()
              bValue = b.createdAt.getTime()
              break
            case 'popularity':
              aValue = a.reviewCount
              bValue = b.reviewCount
              break
            default:
              return 0
          }

          if (options.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      setTotal(filteredProducts.length)

      // Apply pagination
      const page = options.page || 1
      const limit = options.limit || 12
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      setProducts(filteredProducts.slice(startIndex, endIndex))
      setLoading(false)
    }

    fetchProducts()
  }, [
    options.category,
    options.brand,
    options.minPrice,
    options.maxPrice,
    options.rating,
    options.inStock,
    options.isOnSale,
    options.sortBy,
    options.sortOrder,
    options.limit,
    options.page,
    'isFeatured' in options ? options.isFeatured : undefined
  ])

  return { products, loading, total }
}

export const useMockProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const foundProduct = mockProducts.find(p => p.id === id)
      setProduct(foundProduct || null)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  return { product, loading }
}