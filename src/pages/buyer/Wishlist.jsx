import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import BackButton from '../../components/BackButton'
import { DUMMY_PRODUCTS } from '../../data/dummyData'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', default: '📦',
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
  default: 'from-[#FAF8F5] via-[#F5F0EA] to-[#EDE5D8]',
}

function WishlistCard({ item, onRemove }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const emoji = categoryEmojis[item.category] || categoryEmojis.default
  const gradient = categoryGradients[item.category] || categoryGradients.default
  const hasImage = item.imageUrls?.length > 0

  return (
    <Link to={`/products/${item.productId}`} className="block">
      <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#C9A96E]/50 transition-shadow duration-200 flex flex-col">

        {/* Image area */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`} style={{ aspectRatio: '1 / 1' }}>
          {hasImage ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
              )}
              <img
                src={item.imageUrls[0]}
                alt={item.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
              <span className="text-6xl select-none drop-shadow-sm">{emoji}</span>
            </div>
          )}

          {/* Remove button */}
          <div className="absolute top-3 right-3 group/remove">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(item.savedId) }}
              className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-md border border-[#E8E0D5] hover:border-[#1C1F2E] hover:bg-[#1C1F2E] text-[#9E9590] hover:text-white transition-all"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
            <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/remove:opacity-100 transition-opacity shadow-xl">
              Remove from Wishlist
            </span>
          </div>

          {/* Saved badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-[#C9A96E]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Saved
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[#C9A96E] text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
            {item.category?.replace(/_/g, ' ')}
          </p>
          <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug mb-1.5 line-clamp-2 flex-1">
            {item.name}
          </h3>

          {/* Brand + seller row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9E9590] text-xs">{item.brand}</span>
            <div className="flex items-center gap-1">
              {item.sellerProfilePictureUrl ? (
                <img src={item.sellerProfilePictureUrl} alt={item.sellerName} className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <div className="w-4 h-4 bg-[#1C1F2E] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-bold leading-none">
                    {item.sellerName?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-[#C9A96E]/70 text-[10px]">{item.sellerName}</span>
            </div>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE3]">
            <span className="text-[#1C1F2E] font-extrabold text-lg">${item.price?.toFixed(2)}</span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.success(`${item.name} added to cart!`) }}
              className="bg-[#1C1F2E] hover:bg-[#C9A96E] text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <FiShoppingCart className="w-3 h-3" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => [
    { savedId: 1, ...DUMMY_PRODUCTS[0] },
    { savedId: 2, ...DUMMY_PRODUCTS[3] },
    { savedId: 3, ...DUMMY_PRODUCTS[8] },
    { savedId: 4, ...DUMMY_PRODUCTS[7] },
  ])

  const handleRemove = (savedId) => setWishlistItems(prev => prev.filter(i => i.savedId !== savedId))

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton label="Continue Shopping" />
          <h1 className="text-3xl font-extrabold text-white mt-4">My Wishlist</h1>
          <p className="text-[#C9A96E] mt-1">{wishlistItems.length} saved items</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {wishlistItems.length === 0 ? (

          /* Empty state */
          <div className="text-center py-20">
            <FiHeart className="w-16 h-16 text-[#E8E0D5] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#1C1F2E]">Your wishlist is empty</p>
            <p className="text-[#6B6560] text-sm mt-2">Save items you love and come back to them later.</p>
            <Link
              to="/products"
              className="bg-[#1C1F2E] text-white px-6 py-3 rounded-full font-semibold mt-6 inline-block hover:bg-[#2E3452] transition-colors"
            >
              Browse Products
            </Link>
          </div>

        ) : (

          /* Items */
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-[#1C1F2E]">{wishlistItems.length} items</span>
              <button
                onClick={() => setWishlistItems([])}
                className="flex items-center gap-2 text-xs text-[#6B6560] hover:text-[#1C1F2E] border border-[#E8E0D5] hover:border-[#1C1F2E] px-4 py-2 rounded-full transition-all font-medium"
              >
                <FiTrash2 className="w-3.5 h-3.5" /> Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistItems.map(item => (
                <WishlistCard key={item.savedId} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
