import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { addToCart, getCart, removeFromCart, clearCart } from '../api/cart'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartIds, setCartIds] = useState(new Set())
  const [cartCount, setCartCount] = useState(0)
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
    setCartIds(prev => new Set([...prev, productId]))
    setCartCount(prev => prev + 1)
    try {
      const res = await addToCart(productId)
      if (res?.data) {
        setCartItems(prev => [...prev, res.data])
      }
    } catch {
      setCartIds(prev => { const s = new Set(prev); s.delete(productId); return s })
      setCartCount(prev => Math.max(0, prev - 1))
      return { success: false, message: 'Failed to add item' }
    }
    return { success: true }
  }, [])

  const removeItem = useCallback(async (productId) => {
    let removedItem = null
    setCartIds(prev => { const s = new Set(prev); s.delete(productId); return s })
    setCartCount(prev => Math.max(0, prev - 1))
    setCartItems(prev => {
      removedItem = prev.find(i => i.productId === productId) ?? null
      return prev.filter(i => i.productId !== productId)
    })
    try {
      await removeFromCart(productId)
    } catch {
      setCartIds(prev => new Set([...prev, productId]))
      setCartCount(prev => prev + 1)
      if (removedItem) setCartItems(prev => [...prev, removedItem])
      return { success: false, message: 'Failed to remove item' }
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
