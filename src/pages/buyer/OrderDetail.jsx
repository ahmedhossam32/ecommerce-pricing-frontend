import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiCheck, FiPackage, FiTrendingUp, FiTag, FiUser, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns'
import BackButton from '../../components/BackButton'
import { DUMMY_ORDERS } from '../../data/dummyData'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', default: '📦',
}

function OrderDetail() {
  const { orderId } = useParams()
  const [imgLoaded, setImgLoaded] = useState(false)

  // Dummy: find order by orderId match
  // When connecting backend: replace with useEffect calling GET /api/orders/:orderId
  const order = DUMMY_ORDERS.find(o => String(o.orderId) === String(orderId)) || DUMMY_ORDERS[0]

  const emoji = categoryEmojis[order.category] || categoryEmojis.default
  const hasImage = order.imageUrls?.length > 0

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6">
          <div>
            <BackButton label="Back to Orders" />
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl font-extrabold text-white">Order Details</h1>
            </div>
          </div>
          <span className="bg-green-500/15 text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FiCheck className="w-3.5 h-3.5" />
            Purchased
          </span>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT — Image ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Main image */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden relative"
              style={{ height: 'min(420px, 50vw)' }}>
              {hasImage ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
                  )}
                  <img
                    src={order.imageUrls[0]}
                    alt={order.productName}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-40 select-none">{emoji}</span>
                </div>
              )}

              {/* Category badge over image */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#1C1F2E]/80 backdrop-blur-sm text-[#C9A96E] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {order.category?.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Purchased badge over image */}
              <div className="absolute top-4 right-4">
                <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <FiCheck className="w-3 h-3" />
                  Purchased
                </span>
              </div>
            </div>

            {/* Thumbnail strip if multiple images */}
            {order.imageUrls?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {order.imageUrls.map((url, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#E8E0D5] shrink-0">
                    <img src={url} alt={`${order.productName} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* View Product button — under image on desktop */}
            <Link
              to={`/products/${order.productId}`}
              className="hidden lg:flex items-center justify-center gap-2 border-2 border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-2xl text-sm transition-all"
            >
              <FiPackage className="w-4 h-4" />
              View Product Page
            </Link>
          </div>

          {/* ── RIGHT — Details ──────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Product name + brand */}
            <div>
              <h2 className="text-[#1C1F2E] font-extrabold text-2xl leading-tight">
                {order.productName}
              </h2>
              {order.brand && (
                <p className="text-[#6B6560] text-sm mt-1">{order.brand}</p>
              )}
            </div>

            {/* Price snapshot — hero element */}
            <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-2xl p-5">
              <p className="text-[#9E9590] text-xs mb-2">Price at time of purchase</p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[#1C1F2E] font-extrabold text-4xl">
                  ${order.price?.toFixed(2)}
                </span>
                <span className="inline-flex items-center gap-1 text-[#C9A96E] text-xs font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2.5 py-1 rounded-full">
                  ✦ AI Verified
                </span>
              </div>
              <p className="text-[#9E9590] text-xs leading-relaxed">
                Permanently locked — reflects the AI-verified fair price at purchase time.
              </p>
            </div>

            {/* Order info rows */}
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5">
              <h3 className="text-[#1C1F2E] font-bold text-sm mb-4">Order Information</h3>
              <div className="space-y-3">
                {[
                  { icon: FiTag, label: 'Order ID', value: `#${order.orderId}`, mono: true },
                  { icon: FiCalendar, label: 'Purchase Date', value: order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy · h:mm a') : 'N/A' },
                  { icon: FiUser, label: 'Purchased by', value: order.buyerName },
                  { icon: FiTrendingUp, label: 'Pricing Method', value: 'AI-Verified Dynamic Price', gold: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#FAF8F5] last:border-0">
                    <div className="flex items-center gap-2 text-[#6B6560]">
                      <item.icon className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <span className={`text-xs font-semibold ${item.mono ? 'font-mono text-[#9E9590]' : ''} ${item.gold ? 'text-[#C9A96E]' : 'text-[#1C1F2E]'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller */}
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5">
              <h3 className="text-[#1C1F2E] font-bold text-sm mb-3">Seller</h3>
              <div className="flex items-center gap-3">
                {order.sellerProfilePictureUrl ? (
                  <img
                    src={order.sellerProfilePictureUrl}
                    alt={order.sellerName}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-[#E8E0D5]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#1C1F2E] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">
                      {order.sellerName?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-[#1C1F2E] font-bold text-sm">{order.sellerName}</p>
                  <p className="text-[#9E9590] text-xs">Verified DynaMart Seller</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Link
                to="/orders"
                className="flex-1 flex items-center justify-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
              >
                Back to Orders
              </Link>
              <Link
                to="/products"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3.5 rounded-2xl text-sm transition-all"
              >
                Shop More
              </Link>
            </div>

            {/* View Product — mobile only */}
            <Link
              to={`/products/${order.productId}`}
              className="lg:hidden flex items-center justify-center gap-2 border-2 border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-2xl text-sm transition-all"
            >
              <FiPackage className="w-4 h-4" />
              View Product Page
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
