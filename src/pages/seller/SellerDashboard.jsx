import { Link } from 'react-router-dom'
import {
  FiPackage, FiCheckCircle, FiClock, FiFileText,
  FiXCircle, FiDollarSign, FiPlus, FiList, FiUser, FiTrendingUp,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { DUMMY_PRODUCTS } from '../../data/dummyData'

const DUMMY_STATS = {
  total: 12,
  live: 7,
  pending: 2,
  draft: 1,
  rejected: 2,
  revenue: 14820.50,
}

const RECENT_PRODUCTS = DUMMY_PRODUCTS.slice(0, 5).map((p, i) => ({
  ...p,
  status: ['LIVE', 'LIVE', 'PENDING', 'REJECTED', 'LIVE'][i],
}))

const statusConfig = {
  LIVE:     { label: 'Live',     cls: 'bg-green-50 text-green-600 border-green-200' },
  PENDING:  { label: 'Pending',  cls: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  DRAFT:    { label: 'Draft',    cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-50 text-red-500 border-red-200' },
}

const statCards = [
  { label: 'Total Products', value: DUMMY_STATS.total,    icon: FiPackage,     color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/10' },
  { label: 'Live',           value: DUMMY_STATS.live,     icon: FiCheckCircle, color: 'text-green-500',  bg: 'bg-green-50' },
  { label: 'Pending Review', value: DUMMY_STATS.pending,  icon: FiClock,       color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: 'Drafts',         value: DUMMY_STATS.draft,    icon: FiFileText,    color: 'text-gray-400',   bg: 'bg-gray-50' },
  { label: 'Rejected',       value: DUMMY_STATS.rejected, icon: FiXCircle,     color: 'text-red-400',    bg: 'bg-red-50' },
  { label: 'Total Revenue',  value: `$${DUMMY_STATS.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: FiDollarSign, color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/10', wide: true },
]

function SellerDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── STICKY SELLER TOP BAR ──────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E8E0D5] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-[#9E9590]">
            <span>Seller Center</span>
            <span>/</span>
            <span className="text-[#1C1F2E] font-semibold">Dashboard</span>
          </nav>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
          >
            <FiPlus className="w-3.5 h-3.5" />
            List New Product
          </Link>
        </div>
      </div>

      {/* ── DARK HEADER ───────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center shrink-0">
              {user?.profilePicture ? (
                <img src={user.profilePicture} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                <span className="text-white text-xl font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
            </div>
            {/* Welcome text */}
            <div>
              <p className="text-[#C9A96E] text-sm font-medium">Welcome back,</p>
              <p className="text-3xl font-extrabold text-white mt-1">{user?.name}</p>
              <p className="text-gray-400 text-sm mt-1">Here's what's happening with your store.</p>
            </div>
          </div>

          {/* Quick store pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <FiCheckCircle className="w-3.5 h-3.5 text-green-400" />
              {DUMMY_STATS.live} Live listings
            </span>
            <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <FiTrendingUp className="w-3.5 h-3.5 text-[#C9A96E]" />
              ${DUMMY_STATS.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} earned
            </span>
            <span className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-yellow-400" />
              {DUMMY_STATS.pending} pending review
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── STATS CARDS ───────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="bg-white border border-[#E8E0D5] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#C9A96E]/40 hover:shadow-sm transition-all col-span-1 last:col-span-2 last:sm:col-span-1"
            >
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <p className="text-[#9E9590] text-xs font-medium">{label}</p>
                <p className="text-[#1C1F2E] font-extrabold text-xl mt-0.5 leading-none">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── RECENT PRODUCTS ───────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1C1F2E] font-bold text-lg">Recent Products</h2>
            <Link
              to="/seller/products"
              className="text-xs text-[#6B6560] hover:text-[#1C1F2E] border border-[#E8E0D5] hover:border-[#1C1F2E] px-3 py-1.5 rounded-full transition-all font-medium"
            >
              View All
            </Link>
          </div>

          <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
            {RECENT_PRODUCTS.map((product, idx) => {
              const hasImage = product.imageUrls?.length > 0
              const cfg = statusConfig[product.status] || statusConfig.DRAFT

              return (
                <div
                  key={product.productId}
                  className={`flex items-center gap-4 px-5 py-4 hover:bg-[#FAF8F5] transition-colors ${idx !== RECENT_PRODUCTS.length - 1 ? 'border-b border-[#E8E0D5]' : ''}`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E8E0D5] shrink-0 flex items-center justify-center">
                    {hasImage ? (
                      <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiPackage className="w-5 h-5 text-[#C9A96E]" />
                    )}
                  </div>

                  {/* Name + category */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#1C1F2E] font-semibold text-sm leading-snug truncate">{product.name}</p>
                    <p className="text-[#9E9590] text-xs mt-0.5">{product.brand} · {product.category?.replace(/_/g, ' ')}</p>
                  </div>

                  {/* Price */}
                  <p className="text-[#1C1F2E] font-bold text-sm shrink-0">${product.price?.toFixed(2)}</p>

                  {/* Status badge */}
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── QUICK ACTIONS ─────────────────────────────── */}
        <div>
          <h2 className="text-[#1C1F2E] font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Link
              to="/seller/products/new"
              className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white rounded-2xl p-6 flex items-center gap-4 transition-colors group"
            >
              <div className="w-11 h-11 bg-[#C9A96E] rounded-xl flex items-center justify-center shrink-0">
                <FiPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">List a Product</p>
                <p className="text-white/60 text-xs mt-0.5">Add a new item to your store</p>
              </div>
            </Link>

            <Link
              to="/seller/products"
              className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E]/50 hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group"
            >
              <div className="w-11 h-11 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl flex items-center justify-center shrink-0">
                <FiList className="w-5 h-5 text-[#C9A96E]" />
              </div>
              <div>
                <p className="text-[#1C1F2E] font-bold text-sm">My Products</p>
                <p className="text-[#9E9590] text-xs mt-0.5">Manage your listings</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E]/50 hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group"
            >
              <div className="w-11 h-11 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl flex items-center justify-center shrink-0">
                <FiUser className="w-5 h-5 text-[#C9A96E]" />
              </div>
              <div>
                <p className="text-[#1C1F2E] font-bold text-sm">Profile</p>
                <p className="text-[#9E9590] text-xs mt-0.5">Update your store info</p>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}

export default SellerDashboard
