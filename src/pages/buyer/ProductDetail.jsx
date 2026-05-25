import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiPackage, FiTag, FiTrendingUp, FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi'
import BackButton from '../../components/BackButton'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import PriceHistoryChart from '../../components/PriceHistoryChart'
import { DUMMY_PRODUCTS } from '../../data/dummyData'

const DUMMY_HISTORY = [
  { price: 850, event: 'Seller accepted', date: '2026-04-25T10:00:00.000Z' },
  { price: 920, event: 'Admin approved',  date: '2026-05-05T10:00:00.000Z' },
  { price: 977, event: 'Admin override',  date: '2026-05-20T10:00:00.000Z' },
]

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦',
}

function ProductDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [activeImg, setActiveImg] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const product = DUMMY_PRODUCTS.find(p => p.productId === parseInt(id)) || DUMMY_PRODUCTS[0]
  const emoji = categoryEmojis[product.category] || categoryEmojis.default
  const hasImages = product.imageUrls?.length > 0
  const multiImage = product.imageUrls?.length > 1

  const handlePrev = () => { setImgLoaded(false); setActiveImg(i => (i === 0 ? product.imageUrls.length - 1 : i - 1)) }
  const handleNext = () => { setImgLoaded(false); setActiveImg(i => (i === product.imageUrls.length - 1 ? 0 : i + 1)) }
  const handleThumb = (i) => { setImgLoaded(false); setActiveImg(i) }

  const handleBuyNow    = () => toast.success(`Order placed for ${product.name}!`)
  const handleAddToCart = () => toast.success(`${product.name} added to cart!`)
  const handleWishlist  = () => toast.success(`${product.name} saved to wishlist!`)

  const TABS = [
    { key: 'details', label: 'Product Details', icon: FiPackage },
    { key: 'history', label: 'Price History',   icon: FiTrendingUp },
    { key: 'specs',   label: 'Specifications',  icon: FiTag },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#E8E0D5] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <BackButton label="Back" />
          <p className="text-xs text-[#6B6560] truncate max-w-xs text-right">
            Products / {product.category?.replace(/_/g, ' ')} / {product.name}
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 mb-8">

          {/* ── LEFT — Image gallery ─────────────────────────── */}
          <div>
            {/* Main image */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden aspect-square relative">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {multiImage && (
              <div className="flex gap-2 mt-3">
                {product.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumb(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-colors ${
                      i === activeImg ? 'border-[#1C1F2E]' : 'border-[#E8E0D5] hover:border-[#C9A96E]'
                    }`}
                  >
                    <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Product info ─────────────────────────── */}
          <div className="flex flex-col">

            {/* Category + Brand badges */}
            <div className="flex gap-2 mb-3">
              <span className="bg-[#FAF8F5] border border-[#E8E0D5] text-[#C9A96E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {product.category?.replace(/_/g, ' ')}
              </span>
              <span className="bg-[#FAF8F5] border border-[#E8E0D5] text-[#6B6560] text-xs px-3 py-1 rounded-full">
                {product.brand}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1C1F2E] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price row */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-extrabold text-[#1C1F2E]">
                ${product.price?.toFixed(2)}
              </span>
              <span className="text-xs text-[#6B6560] bg-[#FAF8F5] border border-[#E8E0D5] px-2 py-0.5 rounded-full">
                Fair Price
              </span>
            </div>

            {/* Seller + Weight */}
            <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-[#E8E0D5]">
              <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                {product.sellerProfilePictureUrl ? (
                  <img src={product.sellerProfilePictureUrl} alt={product.sellerName} className="w-7 h-7 rounded-full object-cover border border-[#E8E0D5] shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold flex items-center justify-center shrink-0">
                    {product.sellerName?.[0]?.toUpperCase()}
                  </div>
                )}
                Sold by <span className="text-[#1C1F2E] font-medium ml-1">{product.sellerName}</span>
              </div>
              {product.weight && (
                <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                  <FiPackage className="w-4 h-4 text-[#C9A96E]" />
                  {product.weight}g
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[#6B6560] text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-4 rounded-2xl text-sm transition-colors"
              >
                <FiZap className="w-4 h-4" /> Buy Now
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white py-3.5 rounded-2xl font-semibold text-sm transition-colors"
                >
                  <FiShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1C1F2E] text-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white py-3.5 rounded-2xl font-semibold text-sm transition-all"
                >
                  <FiHeart className="w-4 h-4" /> Save
                </button>
              </div>
            </div>

            {/* AI Pricing info box */}
            <div className="mt-4 bg-[#FAF8F5] border border-[#E8E0D5] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiTrendingUp className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-sm font-bold text-[#1C1F2E]">AI-Verified Pricing</span>
              </div>
              <p className="text-xs text-[#6B6560]">
                This price was reviewed and verified by our AI engine to ensure it's fair and competitive.
              </p>
            </div>
          </div>
        </div>

        {/* ── TABS ────────────────────────────────────────────── */}
        <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden">

          {/* Tab headers */}
          <div className="flex border-b border-[#E8E0D5]">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold relative transition-colors ${
                  activeTab === tab.key ? 'text-[#1C1F2E]' : 'text-[#6B6560] hover:text-[#1C1F2E]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#C9A96E] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-8">

            {activeTab === 'details' && (
              <div className="space-y-1">
                {[
                  { label: 'Brand',    value: product.brand },
                  { label: 'Category', value: product.category?.replace(/_/g, ' ') },
                  { label: 'Weight',   value: product.weight ? `${product.weight}g` : 'N/A' },
                  { label: 'Seller',   value: product.sellerName },
                  { label: 'Price',    value: `$${product.price?.toFixed(2)}` },
                  { label: 'Pricing',  value: 'AI-Verified Fair Price' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#FAF8F5] last:border-0">
                    <span className="text-[#6B6560] text-sm">{item.label}</span>
                    <span className="text-[#1C1F2E] text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <PriceHistoryChart history={DUMMY_HISTORY} />
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Category',  value: product.category?.replace(/_/g, ' ') },
                  { label: 'Brand',     value: product.brand },
                  { label: 'Weight',    value: product.weight ? `${product.weight}g` : 'N/A' },
                  { label: 'Condition', value: 'New' },
                  { label: 'Seller',    value: product.sellerName },
                  { label: 'Photos',    value: product.photosQty ?? 0 },
                  { label: 'Listed',    value: product.createdAt ? format(new Date(product.createdAt), 'MMM d, yyyy') : 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#FAF8F5] rounded-2xl p-4">
                    <p className="text-[#6B6560] text-xs mb-1">{item.label}</p>
                    <p className="text-[#1C1F2E] font-bold text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
