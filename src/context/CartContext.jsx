import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { addToCart, getCart, removeFromCart, clearCart } from '../api/cart'
import { DUMMY_PRODUCTS } from '../data/dummyData'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([
    { cartItemId: 1, productId: DUMMY_PRODUCTS[0].productId, ...DUMMY_PRODUCTS[0], addedAt: new Date().toISOString() },
    { cartItemId: 2, productId: DUMMY_PRODUCTS[1].productId, ...DUMMY_PRODUCTS[1], addedAt: new Date().toISOString() },
    { cartItemId: 3, productId: DUMMY_PRODUCTS[5].productId, ...DUMMY_PRODUCTS[5], addedAt: new Date().toISOString() },
    { cartItemId: 4, productId: DUMMY_PRODUCTS[2].productId, ...DUMMY_PRODUCTS[2], addedAt: new Date().toISOString() },
  ])
  const [cartIds, setCartIds] = useState(new Set([
    DUMMY_PRODUCTS[0].productId,
    DUMMY_PRODUCTS[1].productId,
    DUMMY_PRODUCTS[5].productId,
    DUMMY_PRODUCTS[2].productId,
  ]))
  const [cartCount, setCartCount] = useState(4)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'BUYER') {
      setCartItems([]); setCartIds(new Set()); setCartCount(0); return
    }
    try {
      setLoading(true)
      const res = await getCart()
      const items = res.data || []
      setCartItems(items)
      setCartIds(new Set(items.map(i => i.productId)))
      setCartCount(items.length)
    } catch {
      // silently fail — user may not be logged in
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addItem = useCallback(async (productId) => {
    // Optimistic update first — works without backend
    setCartIds(prev => new Set([...prev, productId]))
    setCartCount(prev => prev + 1)
    try {
      const res = await addToCart(productId)
      if (res?.data) {
        setCartItems(prev => [...prev, res.data])
      }
    } catch {
      // API not connected yet — optimistic state stays
    }
    return { success: true }
  }, [])

  const removeItem = useCallback(async (productId) => {
    // Optimistic update first
    setCartIds(prev => { const s = new Set(prev); s.delete(productId); return s })
    setCartCount(prev => Math.max(0, prev - 1))
    setCartItems(prev => prev.filter(i => i.productId !== productId))
    try {
      await removeFromCart(productId)
    } catch {
      // API not connected yet — optimistic state stays
    }
    return { success: true }
  }, [])

  const clearAll = useCallback(async () => {
    setCartItems([]); setCartIds(new Set()); setCartCount(0)
    try { await clearCart() } catch {}
  }, [])

  const isInCart = useCallback((productId) => cartIds.has(productId), [cartIds])

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartIds, loading, isInCart, addItem, removeItem, clearAll, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
