import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiTrash2, FiHeart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import BackButton from '../../components/BackButton'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦',
}

function Cart() {
  const { user } = useAuth()
  const { cartItems, removeItem, clearAll } = useCart()
  const { addItem: addToWishlistCtx, isInWishlist } = useWishlist()

  const [clearModal, setClearModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemOrderModal, setItemOrderModal] = useState(false)
  const [itemOrderConfirmed, setItemOrderConfirmed] = useState(false)
  const [itemOrderData, setItemOrderData] = useState(null)
  const [itemOrderLoading, setItemOrderLoading] = useState(false)

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  const confirmItemOrder = async () => {
    setItemOrderLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const dummyOrder = {
      orderId: Math.floor(Math.random() * 90000) + 10000,
      productName: selectedItem?.name || selectedItem?.productName,
      price: selectedItem?.price,
      sellerName: selectedItem?.sellerName,
      category: selectedItem?.category,
      brand: selectedItem?.brand,
      imageUrls: selectedItem?.imageUrls,
    }
    setItemOrderData(dummyOrder)
    setItemOrderConfirmed(true)
    setItemOrderLoading(false)
    removeItem(selectedItem.productId)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes cartRowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .cart-row { animation: cartRowIn 0.3s ease both; }
        .cart-row:nth-child(1) { animation-delay: 0.05s; }
        .cart-row:nth-child(2) { animation-delay: 0.10s; }
        .cart-row:nth-child(3) { animation-delay: 0.15s; }
        .cart-row:nth-child(4) { animation-delay: 0.20s; }
        .cart-row:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
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
              onClick={() => setClearModal(true)}
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
              <div className="flex flex-col gap-4">
                {cartItems.map(item => {
                  const itemName = item.name || item.productName
                  const emoji = categoryEmojis[item.category] || categoryEmojis.default
                  const hasImage = item.imageUrls?.length > 0

                  return (
                    <div
                      key={item.cartItemId || item.productId}
                      className="cart-row relative bg-white border border-[#E8E0D5] rounded-2xl p-4 flex gap-4 items-center hover:border-[#C9A96E]/40 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Left accent bar */}
                      <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#C9A96E]/40 rounded-r-full group-hover:bg-[#C9A96E] transition-colors" />

                      <Link to={`/products/${item.productId}`} className="flex gap-4 items-center flex-1 min-w-0 hover:opacity-80 transition-opacity">
                        {/* Image */}
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 flex items-center justify-center border border-[#E8E0D5] group-hover:border-[#C9A96E]/30 transition-colors">
                          {hasImage ? (
                            <img src={item.imageUrls[0]} alt={itemName} className="w-full h-full object-cover" />
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
                            {itemName}
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

                      {/* Price + Actions */}
                      <div className="shrink-0 text-right flex flex-col items-end gap-2">
                        <p className="text-[#1C1F2E] font-extrabold text-lg leading-none">
                          ${item.price?.toFixed(2)}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[9px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-full">
                          ✦ AI Verified
                        </span>

                        {/* Place Order button */}
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setItemOrderModal(true)
                          }}
                          className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all mt-1"
                        >
                          Place Order →
                        </button>

                        {/* Wishlist + Remove */}
                        <div className="flex items-center gap-2">
                          {/* Move to Wishlist */}
                          <div className="relative group/move">
                            <button
                              onClick={async () => {
                                if (!isInWishlist(item.productId)) {
                                  await addToWishlistCtx(item.productId)
                                  toast.success('Moved to wishlist!')
                                } else {
                                  toast.info('Already in wishlist')
                                }
                              }}
                              className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                                isInWishlist(item.productId)
                                  ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]'
                                  : 'border-[#E8E0D5] hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 text-[#9E9590] hover:text-[#C9A96E]'
                              }`}
                            >
                              <FiHeart className={`w-3.5 h-3.5 transition-all ${isInWishlist(item.productId) ? 'fill-[#C9A96E]' : ''}`} />
                            </button>
                            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/move:opacity-100 transition-opacity shadow-xl z-10">
                              Move to Wishlist
                            </span>
                          </div>
                          {/* Remove */}
                          <div className="relative group/remove">
                            <button
                              onClick={() => {
                                removeItem(item.productId)
                                toast.success(`${itemName} removed from cart`)
                              }}
                              className="w-7 h-7 rounded-full border border-[#E8E0D5] hover:border-[#1C1F2E] hover:bg-[#1C1F2E] text-[#9E9590] hover:text-white flex items-center justify-center transition-all"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity shadow-xl z-10">
                              Remove from Cart
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT — Order Summary ──────────────────────────── */}
          {cartItems.length > 0 && <div className="sticky top-24 self-start">
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
                    <div key={item.cartItemId || item.productId} className="flex justify-between text-sm py-1.5">
                      <span className="text-[#6B6560] truncate max-w-[180px] text-xs" title={item.name || item.productName}>
                        {item.name || item.productName}
                      </span>
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

                {/* Info note */}
                <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3 flex gap-2 mb-4">
                  <FiShoppingCart className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#6B6560]">
                    Each item is ordered separately from its seller. Click <span className="font-bold text-[#1C1F2E]">Place Order</span> on any item to purchase it.
                  </span>
                </div>

                {/* AI pricing note */}
                <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3 flex gap-2">
                  <FiTrendingUp className="w-3.5 h-3.5 text-[#C9A96E] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#6B6560]">
                    All prices are AI-verified to be fair. What you see is what you pay.
                  </span>
                </div>

                <p className="text-center text-xs text-[#9E9590] mt-3">
                  🔒 Secure checkout · AI-fair pricing guaranteed
                </p>
              </div>
            </div>
          </div>}

        </div>
      </div>

      {/* ── CLEAR CART MODAL ────────────────────────────────── */}
      {clearModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setClearModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto">
              <FiTrash2 className="w-7 h-7 text-[#C9A96E]" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[#1C1F2E] font-extrabold text-lg">Clear your cart?</p>
              <p className="text-[#6B6560] text-sm">
                This will remove all {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} from your cart.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setClearModal(false)}
                className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-xl text-sm transition-all"
              >
                Keep Items
              </button>
              <button
                onClick={() => { clearAll(); toast.success('Cart cleared'); setClearModal(false) }}
                className="flex-1 bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PER-ITEM ORDER MODAL ────────────────────────────── */}
      {itemOrderModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => !itemOrderLoading && !itemOrderConfirmed && setItemOrderModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            {!itemOrderConfirmed ? (
              <>
                {/* Header */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-3">
                    <FiShoppingCart className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <h3 className="text-[#1C1F2E] font-extrabold text-lg">Confirm Order</h3>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">Review before placing</p>
                </div>

                {/* Product preview */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-[#E8E0D5] flex items-center justify-center">
                    {selectedItem.imageUrls?.[0]
                      ? <img src={selectedItem.imageUrls[0]} alt={selectedItem.name || selectedItem.productName} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{categoryEmojis[selectedItem.category] || '📦'}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#1C1F2E] font-bold text-sm truncate">{selectedItem.name || selectedItem.productName}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">{selectedItem.brand} · {selectedItem.sellerName}</p>
                    <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[9px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-1.5 py-0.5 rounded-full mt-1">
                      ✦ AI Verified
                    </span>
                  </div>
                </div>

                {/* Price summary */}
                <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B6560]">Item price</span>
                    <span className="font-semibold text-[#1C1F2E]">${selectedItem.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B6560]">AI Verified</span>
                    <span className="text-[#C9A96E] font-semibold">✦ Fair Price</span>
                  </div>
                  <div className="h-px bg-[#E8E0D5]" />
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-[#1C1F2E]">Total</span>
                    <span className="text-[#1C1F2E]">${selectedItem.price?.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[#9CA3AF] text-xs text-center">
                  Order confirmation will be sent to your email
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setItemOrderModal(false)}
                    disabled={itemOrderLoading}
                    className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmItemOrder}
                    disabled={itemOrderLoading}
                    className="flex-1 bg-[#C9A96E] hover:bg-[#b8935a] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {itemOrderLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing...</>
                      : 'Confirm Order'
                    }
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-3">
                    <FiCheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-[#1C1F2E] font-extrabold text-xl">Order Confirmed!</h3>
                  <p className="text-[#9CA3AF] text-xs mt-1">Order #{itemOrderData?.orderId}</p>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-[#E8E0D5] flex items-center justify-center">
                    {itemOrderData?.imageUrls?.[0]
                      ? <img src={itemOrderData.imageUrls[0]} alt={itemOrderData.productName} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{categoryEmojis[itemOrderData?.category] || '📦'}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#1C1F2E] font-bold text-sm truncate">{itemOrderData?.productName}</p>
                    <p className="text-[#9CA3AF] text-xs">{itemOrderData?.brand} · {itemOrderData?.sellerName}</p>
                  </div>
                  <p className="text-[#1C1F2E] font-extrabold text-sm">${itemOrderData?.price?.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-2.5 text-center">
                    <p className="text-[#9CA3AF] text-[9px] uppercase tracking-wide mb-1">Order No.</p>
                    <p className="text-[#1C1F2E] font-bold text-xs">#{itemOrderData?.orderId}</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-2.5 text-center">
                    <p className="text-[#9CA3AF] text-[9px] uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-[#C9A96E] font-bold text-xs">${itemOrderData?.price?.toFixed(2)}</p>
                  </div>
                </div>

                <p className="text-[#9CA3AF] text-xs text-center">📧 Confirmation sent to your email</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setItemOrderModal(false); setItemOrderConfirmed(false); setItemOrderData(null); setSelectedItem(null) }}
                    className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] font-bold py-3 rounded-xl text-sm transition-all"
                  >
                    Continue
                  </button>
                  <Link
                    to="/orders"
                    onClick={() => { setItemOrderModal(false); setItemOrderConfirmed(false); setItemOrderData(null); setSelectedItem(null) }}
                    className="flex-1 bg-[#1C1F2E] hover:bg-[#2E3452] text-white font-bold py-3 rounded-xl text-sm transition-colors text-center flex items-center justify-center"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
