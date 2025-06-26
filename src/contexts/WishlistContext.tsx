import React, { createContext, useContext, useEffect, useState } from 'react'
import { WishlistItem, Product } from '@/types'
import { useAuth } from './AuthContext'
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  // Load wishlist from localStorage for guest users or Firestore for authenticated users
  useEffect(() => {
    if (currentUser) {
      // Load wishlist from Firestore for authenticated users
      const wishlistRef = collection(db, 'users', currentUser.uid, 'wishlist')
      const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
        const wishlistItems: WishlistItem[] = []
        snapshot.forEach((doc) => {
          wishlistItems.push({ id: doc.id, ...doc.data() } as WishlistItem)
        })
        setItems(wishlistItems.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()))
      })

      return unsubscribe
    } else {
      // Load wishlist from localStorage for guest users
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist)
          setItems(parsedWishlist.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          })))
        } catch (error) {
          console.error('Error parsing wishlist from localStorage:', error)
          localStorage.removeItem('wishlist')
        }
      }
    }
  }, [currentUser])

  // Save wishlist to localStorage for guest users
  useEffect(() => {
    if (!currentUser && items.length > 0) {
      localStorage.setItem('wishlist', JSON.stringify(items))
    }
  }, [items, currentUser])

  const addToWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      toast.error('Item already in wishlist')
      return
    }

    setLoading(true)
    try {
      const newItem: WishlistItem = {
        id: product.id,
        productId: product.id,
        product,
        addedAt: new Date()
      }

      if (currentUser) {
        // Save to Firestore for authenticated users
        const wishlistItemRef = doc(db, 'users', currentUser.uid, 'wishlist', product.id)
        await setDoc(wishlistItemRef, newItem)
      } else {
        // Save to state for guest users (localStorage handled by useEffect)
        setItems(prev => [newItem, ...prev])
      }

      toast.success(`${product.name} added to wishlist!`)
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add item to wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    setLoading(true)
    try {
      if (currentUser) {
        // Remove from Firestore for authenticated users
        const wishlistItemRef = doc(db, 'users', currentUser.uid, 'wishlist', productId)
        await deleteDoc(wishlistItemRef)
      } else {
        // Remove from state for guest users
        setItems(prev => prev.filter(item => item.productId !== productId))
      }

      toast.success('Item removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item from wishlist')
    } finally {
      setLoading(false)
    }
  }

  const clearWishlist = async () => {
    setLoading(true)
    try {
      if (currentUser) {
        // Clear from Firestore for authenticated users
        const batch = items.map(item => {
          const wishlistItemRef = doc(db, 'users', currentUser.uid, 'wishlist', item.id)
          return deleteDoc(wishlistItemRef)
        })
        await Promise.all(batch)
      } else {
        // Clear from state and localStorage for guest users
        setItems([])
        localStorage.removeItem('wishlist')
      }

      toast.success('Wishlist cleared')
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
    } finally {
      setLoading(false)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId)
  }

  const value: WishlistContextType = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}