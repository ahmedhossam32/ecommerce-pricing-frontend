import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getWishlist, saveToWishlist, removeFromWishlist, clearWishlist } from '../api/wishlist'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!user || user.role !== 'BUYER') {
      setWishlistItems([]); setWishlistIds(new Set()); setWishlistCount(0); return
    }
    try {
      setLoading(true)
      const res = await getWishlist()
      const items = res.data || []
      setWishlistItems(items)
      setWishlistIds(new Set(items.map(i => i.productId)))
      setWishlistCount(items.length)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  const addItem = useCallback(async (productId) => {
    // Optimistic update first
    setWishlistIds(prev => new Set([...prev, productId]))
    setWishlistCount(prev => prev + 1)
    try {
      const res = await saveToWishlist(productId)
      if (res?.data) {
        setWishlistItems(prev => [...prev, res.data])
      }
    } catch {
      // API not connected yet — optimistic state stays
    }
    return { success: true }
  }, [])

  const removeItem = useCallback(async (productId) => {
    // Optimistic update first
    setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s })
    setWishlistCount(prev => Math.max(0, prev - 1))
    setWishlistItems(prev => prev.filter(i => i.productId !== productId))
    try {
      await removeFromWishlist(productId)
    } catch {
      // API not connected yet — optimistic state stays
    }
    return { success: true }
  }, [])

  const clearAll = useCallback(async () => {
    setWishlistItems([])
    setWishlistIds(new Set())
    setWishlistCount(0)
    try {
      await clearWishlist()
    } catch {
    }
    return { success: true }
  }, [])

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds])

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount, wishlistIds, loading, isInWishlist, addItem, removeItem, clearAll, refetch: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
