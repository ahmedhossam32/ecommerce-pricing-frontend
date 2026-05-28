import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getWishlist, saveToWishlist, removeFromWishlist } from '../api/wishlist'
import { DUMMY_PRODUCTS } from '../data/dummyData'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([
    { savedId: 1, productId: DUMMY_PRODUCTS[0].productId, ...DUMMY_PRODUCTS[0], savedAt: new Date().toISOString() },
    { savedId: 2, productId: DUMMY_PRODUCTS[3].productId, ...DUMMY_PRODUCTS[3], savedAt: new Date().toISOString() },
    { savedId: 3, productId: DUMMY_PRODUCTS[8].productId, ...DUMMY_PRODUCTS[8], savedAt: new Date().toISOString() },
    { savedId: 4, productId: DUMMY_PRODUCTS[7].productId, ...DUMMY_PRODUCTS[7], savedAt: new Date().toISOString() },
  ])
  const [wishlistIds, setWishlistIds] = useState(new Set([
    DUMMY_PRODUCTS[0].productId,
    DUMMY_PRODUCTS[3].productId,
    DUMMY_PRODUCTS[8].productId,
    DUMMY_PRODUCTS[7].productId,
  ]))
  const [wishlistCount, setWishlistCount] = useState(4)
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

  const clearAll = useCallback(() => {
    setWishlistItems([])
    setWishlistIds(new Set())
    setWishlistCount(0)
  }, [])

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds])

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistCount, wishlistIds, loading, isInWishlist, addItem, removeItem, clearAll, refetch: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
