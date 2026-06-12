import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiPackage, FiTag, FiTrendingUp, FiChevronLeft, FiChevronRight, FiCheckCircle, FiZap } from 'react-icons/fi'
import BackButton from '../../components/BackButton'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { format } from 'date-fns'
import PriceHistoryChart from '../../components/PriceHistoryChart'
import { getProductById, getPriceHistory } from '../../api/products'
import { placeOrder } from '../../api/orders'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦',
}

function ProductDetail() {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [buyModal, setBuyModal] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  const { user } = useAuth()
  const { isInCart, addItem: addToCartCtx } = useCart()
  const { isInWishlist, addItem: addToWishlistCtx, removeItem: removeFromWishlistCtx } = useWishlist()

  useEffect(() => {
    if (!id) return
    setPageLoading(true)
    Promise.all([
      getProductById(id),
      getPriceHistory(id)
    ])
      .then(([productRes, historyRes]) => {
        setProduct(productRes.data)
        setHistory(historyRes.data || [])
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setPageLoading(false))
  }, [id])

  if (pageLoading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!product) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <p className="text-[#6B6560]">Product not found</p>
    </div>
  )

  const emoji = categoryEmojis[product.category] || categoryEmojis.default
  const hasImages = product.imageUrls?.length > 0
  const multiImage = product.imageUrls?.length > 1

  const isBuyer = user?.role === 'BUYER'
  const inCart = isBuyer && isInCart(product.productId)
  const inWishlist = isBuyer && isInWishlist(product.productId)

  const handlePrev = () => { setImgLoaded(false); setActiveImg(i => (i === 0 ? product.imageUrls.length - 1 : i - 1)) }
  const handleNext = () => { setImgLoaded(false); setActiveImg(i => (i === product.imageUrls.length - 1 ? 0 : i + 1)) }
  const handleThumb = (i) => { setImgLoaded(false); setActiveImg(i) }

  const handleBuyNow = () => {
    if (!user) { toast.error('Please sign in to place an order'); return }
    setBuyModal(true)
  }

  const confirmBuyNow = async () => {
    setBuyLoading(true)
    try {
      const res = await placeOrder(product.productId)
      setOrderData(res.data)
      setOrderConfirmed(true)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to place order')
      closeBuyModal()
    } finally {
      setBuyLoading(false)
    }
  }

  const closeBuyModal = () => {
    setBuyModal(false)
    setOrderConfirmed(false)
    setOrderData(null)
  }

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in to add to cart'); return }
    if (inCart) { toast.info('Already in cart'); return }
    const result = await addToCartCtx(product.productId)
    if (result.success) {
      setCartAdded(true)
      toast.success(`${product.name} added to cart!`)
      setTimeout(() => setCartAdded(false), 2000)
    } else {
      toast.error(result.message || 'Failed to add to cart')
    }
  }

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in to save products'); return }
    if (inWishlist) {
      await removeFromWishlistCtx(product.productId)
      toast.success(`${product.name} removed from wishlist`)
    } else {
      const result = await addToWishlistCtx(product.productId)
      if (result.success) toast.success(`${product.name} saved to wishlist!`)
      else toast.error(result.message || 'Failed to save')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── BREADCRUMB ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <BackButton label="Back to Products" />
        <p className="text-xs text-[#9E9590] truncate max-w-xs text-right hidden sm:block">
          <span className="hover:text-[#C9A96E] cursor-pointer transition-colors">Products</span>
          <span className="mx-1.5">/</span>
          <span className="hover:text-[#C9A96E] cursor-pointer transition-colors capitalize">
            {product.category?.replace(/_/g, ' ')}
          </span>
          <span className="mx-1.5">/</span>
          <span className="text-[#1C1F2E] font-medium truncate">{product.name}</span>
        </p>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 mb-0 lg:items-stretch">

          {/* ── LEFT — Image gallery ─────────────────────────── */}
          <div>
            {/* Vertical thumbs on desktop, horizontal below on mobile */}
            <div className="flex flex-col lg:flex-row-reverse gap-3">

              {/* Main image */}
              <div
                className="flex-1 bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden relative"
                style={{ height: 'min(480px, 55vw)' }}
              >
                {hasImages ? (
                  <>
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
                    )}
                    <img
                      key={activeImg}
                      src={product.imageUrls[activeImg]}
                      alt={product.name}
                      onLoad={() => setImgLoaded(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-40 select-none">{emoji}</span>
                  </div>
                )}

                {multiImage && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip — vertical on desktop, horizontal on mobile */}
              {multiImage && (
                <div
                  className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible scrollbar-none"
                  style={{ maxHeight: 'min(480px, 55vw)' }}
                >
                  {product.imageUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleThumb(i)}
                      className={`shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                        i === activeImg
                          ? 'border-[#1C1F2E] shadow-md scale-105'
                          : 'border-[#E8E0D5] hover:border-[#C9A96E] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* ── RIGHT — Product info ─────────────────────────── */}
          <div className="flex flex-col h-full">

            {/* Top content group */}
            <div className="flex-1 flex flex-col">

              {/* Category + Brand badges */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category?.replace(/_/g, ' ')}
                </span>
                <span className="bg-[#1C1F2E]/5 border border-[#1C1F2E]/10 text-[#1C1F2E] text-xs font-medium px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  In Stock
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1C1F2E] leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-4xl font-extrabold text-[#1C1F2E]">
                    ${product.price?.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#C9A96E] font-semibold bg-[#C9A96E]/10 px-2.5 py-1 rounded-lg border border-[#C9A96E]/20">
                    AI Optimized
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 bg-[#C9A96E]/10 border border-[#C9A96E]/25 text-[#C9A96E] text-xs font-bold px-3 py-1 rounded-full">
                    ✦ AI Verified Price
                  </span>
                  <span className="text-[#9E9590] text-xs">· Updated dynamically</span>
                </div>
              </div>

              {/* Seller + Weight + Condition + Listed */}
              <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-[#E8E0D5]">
                <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                  {product.sellerProfilePictureUrl ? (
                    <img src={product.sellerProfilePictureUrl} alt={product.sellerName}
                      className="w-7 h-7 rounded-full object-cover border-2 border-[#E8E0D5] shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold flex items-center justify-center shrink-0 border-2 border-[#C9A96E]/20">
                      {product.sellerName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span>Sold by</span>
                  <span className="text-[#1C1F2E] font-semibold">{product.sellerName}</span>
                </div>
                {product.weight && (
                  <div className="flex items-center gap-1.5 text-sm text-[#6B6560] bg-[#FAF8F5] border border-[#E8E0D5] px-3 py-1 rounded-full">
                    <FiPackage className="w-3.5 h-3.5 text-[#C9A96E]" />
                    <span>{product.weight}g</span>
                  </div>
                )}
                {product.condition && (
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                    product.condition === 'NEW'
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : product.condition === 'USED'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : product.condition === 'REFURBISHED'
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      product.condition === 'NEW' ? 'bg-green-500'
                      : product.condition === 'USED' ? 'bg-amber-500'
                      : product.condition === 'REFURBISHED' ? 'bg-blue-500'
                      : 'bg-gray-400'
                    }`} />
                    {product.condition.charAt(0) + product.condition.slice(1).toLowerCase()}
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6560] bg-[#FAF8F5] border border-[#E8E0D5] px-3 py-1 rounded-full">
                    <FiTag className="w-3 h-3 text-[#C9A96E]" />
                    <span>Listed {format(new Date(product.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-4">
                <p className="text-xs font-bold text-[#C9A96E] uppercase tracking-widest mb-2">About this product</p>
                <p className="text-[#6B6560] text-sm leading-relaxed">{product.description}</p>
              </div>

            </div>

            {/* Bottom group — buttons always anchored to bottom */}
            <div className="flex flex-col gap-3 mt-auto pt-4">

              {/* Action buttons */}
              {isBuyer && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-sm transition-all shadow-lg"
                >
                  Buy Now — ${product.price?.toFixed(2)}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.98] text-white py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                      inCart || cartAdded
                        ? 'bg-[#1C1F2E]'
                        : 'bg-[#1C1F2E] hover:bg-[#2E3452]'
                    }`}
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    {inCart || cartAdded ? 'In Cart ✓' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.98] py-3.5 rounded-2xl font-semibold text-sm transition-all border-2 ${
                      inWishlist
                        ? 'border-[#C9A96E] text-[#C9A96E] bg-[#C9A96E]/10'
                        : 'border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E]/10'
                    }`}
                  >
                    <FiHeart className={`w-4 h-4 ${inWishlist ? 'fill-[#C9A96E]' : ''}`} />
                    {inWishlist ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
              )}

            </div>
          </div>
        </div>

        {/* ── PRICE HISTORY SECTION ───────────────────────────── */}
        <div className="mt-8 bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-[#E8E0D5]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#C9A96E]/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-[#C9A96E]" />
              </div>
              <div>
                <h2 className="text-[#1C1F2E] font-extrabold text-lg">Price History</h2>
                <p className="text-[#9E9590] text-xs">How this price was determined by the AI engine</p>
              </div>
            </div>
            {history.length > 0 && (
              <span className="text-xs text-[#6B6560] bg-[#FAF8F5] border border-[#E8E0D5] px-3 py-1.5 rounded-full hidden sm:block">
                Last updated {format(new Date(history[history.length - 1].date), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {/* Chart */}
          <div className="p-8">
            <PriceHistoryChart history={history} />
          </div>
        </div>
      </div>

      {/* ── BUY NOW MODAL ───────────────────────────────────── */}
      {buyModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => !buyLoading && closeBuyModal()}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {!orderConfirmed ? (
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto mb-3">
                    <FiZap className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <h3 className="text-[#1C1F2E] font-extrabold text-lg">Confirm Order</h3>
                  <p className="text-[#9CA3AF] text-xs mt-0.5">Review your order before placing</p>
                </div>

                {/* Product preview */}
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-[#E8E0D5] flex items-center justify-center">
                    {product.imageUrls?.[0]
                      ? <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                      : <span className="text-2xl">{emoji}</span>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#1C1F2E] font-bold text-sm truncate">{product.name}</p>
                    <p className="text-[#9CA3AF] text-xs mt-0.5">{product.brand} · {product.sellerName}</p>
                    <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[9px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-1.5 py-0.5 rounded-full mt-1">
                      ✦ AI Verified
                    </span>
                  </div>
                </div>

                {/* Order summary */}
                <div className="space-y-2 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B6560]">Item price</span>
                    <span className="font-semibold text-[#1C1F2E]">${product.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B6560]">AI Verified</span>
                    <span className="text-[#C9A96E] font-semibold">✦ Fair Price</span>
                  </div>
                  <div className="h-px bg-[#E8E0D5]" />
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-[#1C1F2E]">Total</span>
                    <span className="text-[#1C1F2E]">${product.price?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Email note */}
                <p className="text-[#9CA3AF] text-xs text-center">
                  Order confirmation will be sent to your email
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={closeBuyModal}
                    disabled={buyLoading}
                    className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-xl transition-all text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBuyNow}
                    disabled={buyLoading}
                    className="flex-1 bg-[#C9A96E] hover:bg-[#b8935a] disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {buyLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing...</>
                      : 'Confirm Order'
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 flex flex-col items-center text-center space-y-5">
                {/* Success icon */}
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                  <FiCheckCircle className="w-8 h-8 text-green-500" />
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-xl font-extrabold text-[#1C1F2E]">Order Confirmed!</h2>
                  <p className="text-[#9E9590] text-xs mt-1">{orderData?.message}</p>
                </div>

                {/* Product card */}
                <div className="w-full flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl text-left">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-[#E8E0D5]">
                    {orderData?.imageUrls?.[0]
                      ? <img src={orderData.imageUrls[0]} alt={orderData.productName} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">{emoji}</div>
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[#1C1F2E] font-bold text-sm truncate">{orderData?.productName}</p>
                    <p className="text-[#9E9590] text-xs mt-0.5 capitalize">{orderData?.category?.replace(/_/g, ' ')} · {orderData?.brand}</p>
                  </div>
                </div>

                {/* Order details grid */}
                <div className="w-full grid grid-cols-3 gap-2">
                  <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                    <p className="text-[#9E9590] text-[10px] font-semibold uppercase tracking-wider mb-1">Order No.</p>
                    <p className="text-[#1C1F2E] font-bold text-xs truncate">{orderData?.orderId}</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                    <p className="text-[#9E9590] text-[10px] font-semibold uppercase tracking-wider mb-1">Paid</p>
                    <p className="text-[#1C1F2E] font-bold text-xs">${orderData?.price?.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                    <p className="text-[#9E9590] text-[10px] font-semibold uppercase tracking-wider mb-1">Seller</p>
                    <p className="text-[#1C1F2E] font-bold text-xs truncate">{orderData?.sellerName}</p>
                  </div>
                </div>

                {/* Email note */}
                <p className="text-[#9CA3AF] text-xs">
                  A confirmation has been sent to your email
                </p>

                {/* Action buttons */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={closeBuyModal}
                    className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    to="/orders"
                    onClick={closeBuyModal}
                    className="flex-1 bg-[#1C1F2E] hover:bg-[#2E3452] text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center"
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

export default ProductDetail
