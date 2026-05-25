import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiCheck, FiTrendingUp } from 'react-icons/fi'
import { format } from 'date-fns'
import BackButton from '../../components/BackButton'
import { DUMMY_PRODUCTS } from '../../data/dummyData'

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', default: '📦',
}

const DUMMY_ORDERS = [
  { orderId: 'ORD-001', ...DUMMY_PRODUCTS[0], buyerName: 'Ahmed', sellerName: DUMMY_PRODUCTS[0].sellerName, price: DUMMY_PRODUCTS[0].price, createdAt: '2026-05-20T10:00:00.000Z', message: 'Order placed successfully' },
  { orderId: 'ORD-002', ...DUMMY_PRODUCTS[1], buyerName: 'Ahmed', sellerName: DUMMY_PRODUCTS[1].sellerName, price: DUMMY_PRODUCTS[1].price, createdAt: '2026-05-18T14:00:00.000Z', message: 'Order placed successfully' },
  { orderId: 'ORD-003', ...DUMMY_PRODUCTS[5], buyerName: 'Ahmed', sellerName: DUMMY_PRODUCTS[5].sellerName, price: DUMMY_PRODUCTS[5].price, createdAt: '2026-05-15T09:00:00.000Z', message: 'Order placed successfully' },
  { orderId: 'ORD-004', ...DUMMY_PRODUCTS[3], buyerName: 'Ahmed', sellerName: DUMMY_PRODUCTS[3].sellerName, price: DUMMY_PRODUCTS[3].price, createdAt: '2026-05-10T16:00:00.000Z', message: 'Order placed successfully' },
]

const totalSpent = DUMMY_ORDERS.reduce((sum, o) => sum + o.price, 0)

function OrderCard({ order }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const emoji = categoryEmojis[order.category] || categoryEmojis.default
  const hasImage = order.imageUrls?.length > 0

  return (
    <Link to={`/products/${order.productId}`} className="block">
      <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5 hover:border-[#C9A96E]/40 hover:shadow-md transition-all duration-200">
        <div className="flex gap-5 items-start">

          {/* Image */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 relative flex items-center justify-center">
            {hasImage ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
                )}
                <img
                  src={order.imageUrls[0]}
                  alt={order.name}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (
              <span className="text-3xl select-none">{emoji}</span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">

            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[#9E9590] text-[10px] font-mono mb-1">#{order.orderId}</p>
                <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug line-clamp-2">{order.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#FAF8F5] border border-[#E8E0D5] text-[#C9A96E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {order.category?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[#9E9590] text-xs">{order.brand}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[#1C1F2E] font-extrabold text-lg leading-none">${order.price?.toFixed(2)}</p>
                <p className="text-[#9E9590] text-[10px] mt-0.5">Fair Price</p>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#FAF8F5]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#1C1F2E] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-[8px] font-bold leading-none">
                    {order.sellerName?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </div>
                <span className="text-[#6B6560] text-xs">Sold by {order.sellerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#9E9590] text-xs">
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </span>
                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <FiCheck className="w-3 h-3" />
                  Purchased
                </span>
              </div>
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

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton label="Back" />
          <h1 className="text-3xl font-extrabold text-white mt-4">My Orders</h1>
          <p className="text-[#C9A96E] mt-1">{DUMMY_ORDERS.length} orders</p>
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
            <div className="mt-8 bg-white border border-[#E8E0D5] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-[#6B6560] text-sm">Total Spent</p>
                <p className="text-[#1C1F2E] font-extrabold text-2xl mt-1">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[#6B6560] text-sm">{DUMMY_ORDERS.length} purchases</p>
                <p className="text-[#9E9590] text-xs mt-1 flex items-center gap-1 justify-end">
                  <FiTrendingUp className="w-3 h-3 text-[#C9A96E]" />
                  All prices AI-verified
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Orders
