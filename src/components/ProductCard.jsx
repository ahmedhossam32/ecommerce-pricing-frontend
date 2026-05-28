import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiArrowRight, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦'
}

const categoryGradients = {
  telephony: 'from-blue-50 via-indigo-50 to-slate-100',
  audio: 'from-purple-50 via-fuchsia-50 to-pink-50',
  computers: 'from-slate-50 via-gray-50 to-zinc-100',
  watches_gifts: 'from-amber-50 via-yellow-50 to-orange-50',
  fashion_shoes: 'from-orange-50 via-red-50 to-rose-50',
  fashion_bags_accessories: 'from-rose-50 via-pink-50 to-fuchsia-50',
  consoles_games: 'from-green-50 via-emerald-50 to-teal-50',
  health_beauty: 'from-pink-50 via-rose-50 to-red-50',
  sports_leisure: 'from-lime-50 via-green-50 to-emerald-50',
  furniture_decor: 'from-stone-50 via-amber-50 to-yellow-50',
  default: 'from-[#FAF8F5] via-[#F5F0EA] to-[#EDE5D8]',
}

function ProductCard({ product, confidence = 'HIGH' }) {
  const { productId, name, category, brand, price, sellerName, createdAt, imageUrls, sellerProfilePictureUrl } = product
  const [imgIndex, setImgIndex] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)

  const { user } = useAuth()
  const { isInCart, addItem: addToCartCtx } = useCart()
  const { isInWishlist, addItem: addToWishlistCtx, removeItem: removeFromWishlistCtx } = useWishlist()

  const isBuyer = user?.role === 'BUYER'
  const inCart = isBuyer && isInCart(productId)
  const inWishlist = isBuyer && isInWishlist(productId)

  const emoji = categoryEmojis[category] || categoryEmojis.default
  const gradient = categoryGradients[category] || categoryGradients.default
  const isNew = createdAt && new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const multiImage = imageUrls?.length > 1

  useEffect(() => {
    if (!imageUrls?.[imgIndex]) return
    setImgLoaded(false)
    setImgError(false)
    const img = new Image()
    img.src = imageUrls[imgIndex]
    img.onload = () => setImgLoaded(true)
    img.onerror = () => setImgError(true)
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [imgIndex, imageUrls])

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { toast.error('Please sign in to add to cart'); return }
    if (inCart) { toast.info('Already in cart'); return }
    const result = await addToCartCtx(productId)
    if (result.success) {
      setCartAdded(true)
      toast.success(`${name} added to cart!`)
      setTimeout(() => setCartAdded(false), 2000)
    } else {
      toast.error(result.message || 'Failed to add to cart')
    }
  }, [user, inCart, productId, name, addToCartCtx])

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { toast.error('Please sign in to save products'); return }
    if (inWishlist) {
      await removeFromWishlistCtx(productId)
      toast.success(`${name} removed from wishlist`)
    } else {
      const result = await addToWishlistCtx(productId)
      if (result.success) toast.success(`${name} saved to wishlist!`)
      else toast.error(result.message || 'Failed to save')
    }
  }, [user, inWishlist, productId, name, addToWishlistCtx, removeFromWishlistCtx])

  return (
    <Link to={`/products/${productId}`} className="block">
    <div className="group bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#C9A96E]/50 hover:border-l-[#C9A96E] hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 flex flex-col cursor-pointer">

      {/* ── IMAGE AREA ─────────────────────────────────────── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`} style={{ aspectRatio: '1 / 1' }}>

        {/* Product image or emoji fallback */}
        <div className="relative w-full h-full">
          {imageUrls?.[imgIndex] && !imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
          )}
          {imgLoaded && !imgError && imageUrls?.[imgIndex] && (
            <img
              src={imageUrls[imgIndex]}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
          {(imgError || !imageUrls?.[imgIndex]) && (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
              <span className="text-6xl select-none drop-shadow-sm">{emoji}</span>
            </div>
          )}
        </div>

        {/* Carousel arrows + dots (multi-image only) */}
        {multiImage && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgError(false); setImgIndex(i => i === 0 ? imageUrls.length - 1 : i - 1) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FiChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgError(false); setImgIndex(i => i === imageUrls.length - 1 ? 0 : i + 1) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FiChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {imageUrls.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* New badge + Confidence pill (stacked top-left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="self-start bg-[#1C1F2E] text-[#C9A96E] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              New
            </span>
          )}
          <span className={`self-start inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/40 shadow-sm ${
            confidence === 'HIGH' ? 'text-green-700' :
            confidence === 'MEDIUM' ? 'text-yellow-700' :
            'text-blue-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              confidence === 'HIGH' ? 'bg-green-500' :
              confidence === 'MEDIUM' ? 'bg-yellow-400' :
              'bg-blue-500'
            }`} />
            {confidence === 'LOW' ? 'Admin Set' : 'AI Priced'}
          </span>
        </div>

        {/* Wishlist button */}
        <div className="absolute top-3 right-3 group/wish">
          <button
            onClick={handleWishlist}
            className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 translate-y-1 group-hover:translate-y-0 ${
              inWishlist
                ? 'bg-[#C9A96E]/20 text-[#C9A96E] opacity-100 translate-y-0 border border-[#C9A96E]/40'
                : 'bg-white/95 text-gray-400 hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 opacity-0 group-hover:opacity-100'
            }`}
          >
            <FiHeart className={`w-3.5 h-3.5 transition-all ${inWishlist ? 'fill-[#C9A96E] text-[#C9A96E]' : ''}`} />
          </button>
          <span className="pointer-events-none absolute top-full right-0 mt-2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover/wish:opacity-100 transition-opacity duration-150 shadow-xl">
            Add to Wishlist
          </span>
        </div>

        {/* Slide-up Add to Cart overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out px-4 pb-3">
          <button
            onClick={handleAddToCart}
            className={`mx-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-xl transition-all duration-200 backdrop-blur-sm tracking-wide
              ${inCart || cartAdded
                ? 'bg-[#1C1F2E] text-white'
                : 'bg-white/95 text-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white border border-[#E8E0D5]'
              }`}
          >
            {inCart || cartAdded
              ? <><FiCheckCircle className="w-3.5 h-3.5" /> In Cart</>
              : <><FiShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>
            }
          </button>
        </div>

        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>

      {/* ── INFO ───────────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-1 min-h-[180px]">

        {/* Category label */}
        <p className="text-[#C9A96E] text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
          {category?.replace(/_/g, ' ')}
        </p>

        {/* Name */}
        <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug mb-2 line-clamp-2 flex-1 group-hover:text-[#2E3452] transition-colors">
          {name}
        </h3>

        {/* Brand + Seller (two lines) */}
        <div className="mb-3 space-y-1">
          <p className="text-[#6B6560] text-[11px] font-medium truncate">{brand}</p>
          <div className="flex items-center gap-1.5">
            {sellerProfilePictureUrl ? (
              <img src={sellerProfilePictureUrl} alt={sellerName} className="w-4 h-4 rounded-full object-cover border border-[#E8E0D5] shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] text-[8px] font-bold flex items-center justify-center shrink-0">
                {sellerName?.[0]?.toUpperCase()}
              </div>
            )}
            <p className="text-[#9E9590] text-[10px] truncate">{sellerName}</p>
          </div>
        </div>

        {/* Price + View button */}
        <div className="pt-3 border-t border-[#F0EBE3]">
          {/* AI engine hint — visible on hover */}
          <p className="text-[#9E9590] text-[9px] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Price set by AI engine
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1C1F2E] font-extrabold text-base sm:text-lg leading-none">
                ${price?.toFixed(2)}
              </p>
              <span className="inline-flex items-center gap-1 bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1">
                ✦ AI Verified
              </span>
            </div>

            <div className="relative group/view">
              <button className="w-8 h-8 bg-[#FAF8F5] hover:bg-[#1C1F2E] text-[#6B6560] hover:text-white rounded-full flex items-center justify-center transition-all duration-200 border border-[#E8E0D5] hover:border-[#1C1F2E] group-hover/view:shadow-md">
                <FiArrowRight className="w-3.5 h-3.5 group-hover/view:translate-x-0.5 transition-transform" />
              </button>
              <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover/view:opacity-100 transition-opacity duration-150 shadow-xl">
                View details
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default React.memo(ProductCard)
