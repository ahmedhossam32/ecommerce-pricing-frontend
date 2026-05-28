import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiCheck, FiTrendingUp } from 'react-icons/fi'
import { format } from 'date-fns'
import BackButton from '../../components/BackButton'
import { DUMMY_ORDERS } from '../../data/dummyData'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', default: '📦',
}

const totalSpent = DUMMY_ORDERS.reduce((sum, o) => sum + o.price, 0)

function OrderCard({ order }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const emoji = categoryEmojis[order.category] || categoryEmojis.default
  const hasImage = order.imageUrls?.length > 0

  return (
    <Link to={`/orders/${order.orderId}`} className="block">
      <div className="order-row relative overflow-hidden bg-white border border-[#E8E0D5] rounded-2xl p-4 hover:border-[#C9A96E]/40 hover:shadow-md transition-all duration-200 group">
        {/* Left accent bar */}
        <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#C9A96E]/30 rounded-r-full group-hover:bg-[#C9A96E] transition-colors" />
        <div className="flex gap-4 items-center">

          {/* Image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 relative flex items-center justify-center border border-[#E8E0D5] group-hover:border-[#C9A96E]/30 transition-colors">
            {hasImage ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
                )}
                <img
                  src={order.imageUrls[0]}
                  alt={order.productName}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <span className="text-2xl select-none">{emoji}</span>
            )}
          </div>

          {/* Middle — product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[#9E9590] text-[10px] font-mono tracking-wider">
                ORD-{String(order.orderId).padStart(5, '0')}
              </span>
              <span className="bg-[#FAF8F5] border border-[#E8E0D5] text-[#C9A96E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {order.category?.replace(/_/g, ' ')}
              </span>
            </div>
            <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug line-clamp-1">
              {order.productName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              {order.sellerProfilePictureUrl ? (
                <img
                  src={order.sellerProfilePictureUrl}
                  alt={order.sellerName}
                  className="w-4 h-4 rounded-full object-cover border border-[#E8E0D5] shrink-0"
                />
              ) : (
                <div className="w-4 h-4 bg-[#1C1F2E] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-bold leading-none">
                    {order.sellerName?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-[#9E9590] text-xs">
                {order.brand && <span className="text-[#6B6560]">{order.brand} · </span>}
                Sold by {order.sellerName}
              </span>
            </div>
          </div>

          {/* Right — price + AI badge + date + status */}
          <div className="shrink-0 text-right flex flex-col items-end gap-1">
            <p className="text-[#1C1F2E] font-extrabold text-lg leading-none">
              ${order.price?.toFixed(2)}
            </p>
            <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[9px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-full">
              ✦ AI Verified
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#9E9590] text-[10px]">
                {format(new Date(order.createdAt), 'MMM d, yyyy')}
              </span>
              <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
                <FiCheck className="w-2.5 h-2.5" />
                Purchased
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}

function Orders() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes orderRowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .order-row { animation: orderRowIn 0.3s ease both; }
        .order-row:nth-child(1) { animation-delay: 0.05s; }
        .order-row:nth-child(2) { animation-delay: 0.10s; }
        .order-row:nth-child(3) { animation-delay: 0.15s; }
        .order-row:nth-child(4) { animation-delay: 0.20s; }
        .order-row:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <BackButton label="Back to Shopping" />
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl font-extrabold text-white">My Orders</h1>
              <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-xs font-bold px-2.5 py-1 rounded-full border border-[#C9A96E]/30">
                {DUMMY_ORDERS.length} orders
              </span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white/40 text-xs">Total Spent</p>
            <p className="text-[#C9A96E] font-extrabold text-xl">${totalSpent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {DUMMY_ORDERS.length === 0 ? (

          /* Empty state */
          <div className="text-center py-20">
            <FiPackage className="w-16 h-16 text-[#E8E0D5] mx-auto mb-4" />
            <p className="text-xl font-bold text-[#1C1F2E]">No orders yet</p>
            <p className="text-[#6B6560] text-sm mt-2">Your purchase history will appear here.</p>
            <Link
              to="/products"
              className="bg-[#1C1F2E] text-white px-6 py-3 rounded-full font-semibold mt-6 inline-block hover:bg-[#2E3452] transition-colors"
            >
              Start Shopping
            </Link>
          </div>

        ) : (
          <>
            {/* Orders list */}
            <div className="flex flex-col gap-4">
              {DUMMY_ORDERS.map(order => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>

            {/* Summary bar */}
            <div className="mt-6 bg-[#1C1F2E] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#C9A96E]/20 rounded-xl flex items-center justify-center shrink-0">
                  <FiTrendingUp className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">AI-Verified Purchase History</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Price snapshots are locked at time of purchase — permanently recorded
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">{DUMMY_ORDERS.length} purchases</p>
                <p className="text-[#C9A96E] font-extrabold text-2xl">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Orders
