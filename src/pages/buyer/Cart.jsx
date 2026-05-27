import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiTrash2, FiHeart, FiTrendingUp, FiZap } from 'react-icons/fi'
import BackButton from '../../components/BackButton'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { DUMMY_PRODUCTS } from '../../data/dummyData'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦',
}

function Cart() {
  const [cartItems, setCartItems] = useState(() => [
    { cartItemId: 1, ...DUMMY_PRODUCTS[0] },
    { cartItemId: 2, ...DUMMY_PRODUCTS[1] },
    { cartItemId: 3, ...DUMMY_PRODUCTS[5] },
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <BackButton label="Continue Shopping" />
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl font-extrabold text-white">My Cart</h1>
              {cartItems.length > 0 && (
                <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold px-2.5 py-1 rounded-full border border-[#C9A96E]/30">
                  {cartItems.length} items
                </span>
              )}
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={() => setCartItems([])}
              className="flex items-center gap-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full transition-all font-medium"
            >
              <FiTrash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* ── LEFT — Cart items ─────────────────────────────── */}
          <div>
            {cartItems.length === 0 ? (

              /* Empty state */
              <div className="text-center py-20">
                <FiShoppingCart className="w-16 h-16 text-[#E8E0D5] mx-auto mb-4" />
                <p className="text-xl font-bold text-[#1C1F2E]">Your cart is empty</p>
                <p className="text-[#6B6560] text-sm mt-2">Looks like you haven't added anything yet.</p>
                <Link
                  to="/products"
                  className="bg-[#1C1F2E] text-white px-6 py-3 rounded-full font-semibold mt-6 inline-block hover:bg-[#2E3452] transition-colors"
                >
                  Browse Products
                </Link>
              </div>

            ) : (

              /* Items list */
              <div>
                <div className="flex flex-col gap-4">
                  {cartItems.map(item => {
                    const emoji = categoryEmojis[item.category] || categoryEmojis.default
                    const hasImage = item.imageUrls?.length > 0

                    return (
                      <div
                        key={item.cartItemId}
                        className="bg-white border border-[#E8E0D5] rounded-2xl p-4 flex gap-4 items-start hover:border-[#C9A96E]/30 transition-colors"
                      >
                        <Link to={`/products/${item.productId}`} className="flex gap-4 items-start flex-1 hover:opacity-80 transition-opacity">
                          {/* Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 flex items-center justify-center">
                            {hasImage ? (
                              <img
                                src={item.imageUrls[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-3xl select-none">{emoji}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-widest mb-0.5">
                              {item.category?.replace(/_/g, ' ')}
                            </p>
                            <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug line-clamp-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="w-4 h-4 bg-[#1C1F2E] rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white text-[8px] font-bold leading-none">
                                  {item.sellerName?.[0]?.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[#9E9590] text-xs">
                                {item.brand}
                                {item.sellerName && <span className="text-[#C9A96E]/70"> · {item.sellerName}</span>}
                              </p>
                            </div>
                            <p className="text-[#9E9590] text-[10px] mt-1">
                              {item.addedAt
                                ? format(new Date(item.addedAt), 'MMM d, yyyy')
                                : 'Just now'}
                            </p>
                          </div>
                        </Link>

                        {/* Price + Remove */}
                        <div className="shrink-0 text-right">
                          <p className="text-[#1C1F2E] font-extrabold text-lg leading-none">
                            ${item.price?.toFixed(2)}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[9px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-full mt-1">
                            ✦ AI Verified
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            {/* Move to Wishlist */}
                            <div className="relative group/move">
                              <button
                                onClick={() => toast.success(`${item.name} saved to wishlist!`)}
                                className="w-7 h-7 rounded-full border border-[#E8E0D5] hover:border-[#C9A96E] hover:bg-[#C9A96E] text-[#9E9590] hover:text-white flex items-center justify-center transition-all"
                              >
                                <FiHeart className="w-3.5 h-3.5" />
                              </button>
                              <span className="pointer-events-none absolute -top-8 left-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/move:opacity-100 transition-opacity shadow-xl">
                                Move to Wishlist
                              </span>
                            </div>
                            {/* Remove */}
                            <div className="relative group/remove">
                              <button
                                onClick={() => setCartItems(prev => prev.filter(i => i.cartItemId !== item.cartItemId))}
                                className="w-7 h-7 rounded-full border border-[#E8E0D5] hover:border-[#1C1F2E] hover:bg-[#1C1F2E] text-[#9E9590] hover:text-white flex items-center justify-center transition-all"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="pointer-events-none absolute -top-8 left-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity shadow-xl">
                                Remove from Cart
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT — Order Summary ──────────────────────────── */}
          <div className="sticky top-24 self-start">
            <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden">

              {/* Summary header */}
              <div className="bg-[#1C1F2E] px-6 py-4">
                <h2 className="text-white font-extrabold text-base">Order Summary</h2>
                <p className="text-gray-400 text-xs mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
              </div>

              <div className="p-6">
                {/* Per-item list */}
                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item.cartItemId} className="flex justify-between text-sm py-1.5">
                      <span className="text-[#6B6560] truncate max-w-[160px] text-xs">{item.name}</span>
                      <span className="text-[#1C1F2E] font-bold ml-2 shrink-0 text-xs">${item.price?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-[#C9A96E]/30 via-[#E8E0D5] to-transparent mb-4" />

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1C1F2E] font-bold text-sm">Subtotal</span>
                  <span className="text-[#1C1F2E] font-extrabold text-xl">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#9E9590] mb-4">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                {/* AI pricing note */}
                <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3 flex gap-2 mb-5">
                  <FiTrendingUp className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#6B6560]">
                    All prices are AI-verified to be fair. What you see is what you pay.
                  </span>
                </div>

                {/* Checkout button */}
                <button
                  onClick={() => toast.success('Order placed! (dummy)')}
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#C9A96E] hover:bg-[#b8935a] active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-[#C9A96E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiZap className="w-4 h-4" />
                  Checkout — ${subtotal.toFixed(2)}
                </button>

                <p className="text-center text-xs text-[#9E9590] mt-3 leading-relaxed">
                  🔒 Secure checkout · AI-fair pricing guaranteed
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart
