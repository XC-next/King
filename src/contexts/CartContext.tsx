import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem, Product, ProductVariant } from '@/types'
import { useAuth } from './AuthContext'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getCartItemsCount: () => number
  isInCart: (productId: string, variantId?: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  // Load cart from localStorage for guest users or Firestore for authenticated users
  useEffect(() => {
    if (currentUser) {
      // Load cart from Firestore for authenticated users
      const cartRef = collection(db, 'users', currentUser.uid, 'cart')
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const cartItems: CartItem[] = []
        snapshot.forEach((doc) => {
          cartItems.push({ id: doc.id, ...doc.data() } as CartItem)
        })
        setItems(cartItems.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()))
      })

      return unsubscribe
    } else {
      // Load cart from localStorage for guest users
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setItems(parsedCart.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })))
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error)
          localStorage.removeItem('cart')
        }
      }
    }
  }, [currentUser])

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!currentUser && items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, currentUser])

  const addToCart = async (product: Product, quantity = 1, variant?: ProductVariant) => {
    setLoading(true)
    try {
      const itemId = variant ? `${product.id}-${variant.id}` : product.id
      const existingItem = items.find(item => 
        item.productId === product.id && 
        item.variant?.id === variant?.id
      )

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          product,
          quantity,
          variant,
          addedAt: new Date()
        }

        if (currentUser) {
          // Save to Firestore for authenticated users
          const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', itemId)
          await setDoc(cartItemRef, newItem)
        } else {
          // Save to state for guest users (localStorage handled by useEffect)
          setItems(prev => [newItem, ...prev])
        }

        toast.success(`${product.name} added to cart!`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    setLoading(true)
    try {
      if (currentUser) {
        // Remove from Firestore for authenticated users
        const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', itemId)
        await deleteDoc(cartItemRef)
      } else {
        // Remove from state for guest users
        setItems(prev => prev.filter(item => item.id !== itemId))
      }

      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    setLoading(true)
    try {
      if (currentUser) {
        // Update in Firestore for authenticated users
        const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', itemId)
        await updateDoc(cartItemRef, { quantity })
      } else {
        // Update in state for guest users
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        ))
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    setLoading(true)
    try {
      if (currentUser) {
        // Clear from Firestore for authenticated users
        const batch = items.map(item => {
          const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', item.id)
          return deleteDoc(cartItemRef)
        })
        await Promise.all(batch)
      } else {
        // Clear from state and localStorage for guest users
        setItems([])
        localStorage.removeItem('cart')
      }

      toast.success('Cart cleared')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    } finally {
      setLoading(false)
    }
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const price = item.variant?.price || item.product.price
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (productId: string, variantId?: string) => {
    return items.some(item => 
      item.productId === productId && 
      item.variant?.id === variantId
    )
  }

  const value: CartContextType = {
    items,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}