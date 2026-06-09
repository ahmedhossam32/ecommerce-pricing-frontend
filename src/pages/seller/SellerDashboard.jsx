import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPackage, FiCheckCircle, FiClock, FiFileText,
  FiXCircle, FiDollarSign, FiPlus, FiList, FiUser, FiTrendingUp, FiChevronRight, FiArrowRight, FiShoppingBag,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { getSellerDashboard, getSellerProducts } from '../../api/seller'
import SellerProductRow from '../../components/seller/SellerProductRow'


function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function SellerDashboard() {
  const { user } = useAuth()

  const [stats, setStats] = useState(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSellerDashboard(), getSellerProducts()])
      .then(([dashRes, productsRes]) => {
        setStats(dashRes.data)
        setRecentProducts((productsRes.data || []).slice(0, 5))
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts,  icon: FiPackage,     color: 'text-[#1C1F2E]',  bg: 'bg-[#1C1F2E]/[0.06]', accent: '#1C1F2E' },
    { label: 'Live',           value: stats.liveProducts,   icon: FiCheckCircle, color: 'text-green-500',   bg: 'bg-green-50',          accent: '#22c55e' },
    { label: 'Pending Review', value: stats.pendingReview,  icon: FiClock,       color: 'text-[#C9A96E]',   bg: 'bg-[#C9A96E]/10',      accent: '#C9A96E', isPending: true },
    { label: 'Drafts',         value: stats.draft,          icon: FiFileText,    color: 'text-gray-400',    bg: 'bg-[#1C1F2E]/[0.06]', accent: '#9CA3AF' },
    { label: 'Rejected',       value: stats.rejected,       icon: FiXCircle,     color: 'text-red-400',     bg: 'bg-red-50',            accent: '#ef4444' },
    { label: 'Total Orders',   value: stats.totalOrders || 0, icon: FiShoppingBag, color: 'text-[#1C1F2E]', bg: 'bg-[#1C1F2E]/[0.06]', accent: '#1C1F2E' },
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: FiDollarSign, color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/10', accent: '#C9A96E', isRevenue: true },
  ] : []

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <style>{`
        @keyframes sellerFadeLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sellerFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sellerPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(1.5); }
        }
        .seller-header-fade  { animation: sellerFadeLeft 0.4s ease both; }
        .seller-pill-1       { animation: sellerFadeUp 0.35s 0.10s ease both; }
        .seller-pill-2       { animation: sellerFadeUp 0.35s 0.20s ease both; }
        .seller-pill-3       { animation: sellerFadeUp 0.35s 0.30s ease both; }
        .seller-online-dot   { animation: sellerPulseDot 2s ease-in-out infinite; }
        .seller-pending-dot  { animation: sellerPulseDot 1.4s ease-in-out infinite; }

        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .product-row              { animation: rowSlideIn 0.3s ease both; }
        .product-row:nth-child(1) { animation-delay: 0.05s; }
        .product-row:nth-child(2) { animation-delay: 0.10s; }
        .product-row:nth-child(3) { animation-delay: 0.15s; }
        .product-row:nth-child(4) { animation-delay: 0.20s; }
        .product-row:nth-child(5) { animation-delay: 0.25s; }

        @keyframes actionCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .action-card              { animation: actionCardIn 0.35s ease both; }
        .action-card:nth-child(1) { animation-delay: 0.05s; }
        .action-card:nth-child(2) { animation-delay: 0.12s; }
        .action-card:nth-child(3) { animation-delay: 0.19s; }

        @keyframes softPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .pending-icon-pulse { animation: softPulse 2s ease infinite; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card               { animation: cardReveal 0.4s ease both; }
        .stat-card:nth-child(1)  { animation-delay: 0.05s; }
        .stat-card:nth-child(2)  { animation-delay: 0.10s; }
        .stat-card:nth-child(3)  { animation-delay: 0.15s; }
        .stat-card:nth-child(4)  { animation-delay: 0.20s; }
        .stat-card:nth-child(5)  { animation-delay: 0.25s; }
        .stat-card:nth-child(6)  { animation-delay: 0.30s; }
      `}</style>

      {/* ── HERO HEADER ─────────────────────────────────── */}
      <div className="relative bg-[#1C1F2E] py-10 px-8 overflow-hidden">
        {/* Radial gold glow from left */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 90% at -5% 50%, rgba(201,169,110,0.13) 0%, transparent 70%)' }}
        />
        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <div className="relative seller-header-fade">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-6">
            <span className="text-white/40">Seller Center</span>
            <FiChevronRight size={12} className="text-white/25" />
            <span className="text-white/90 font-bold">Dashboard</span>
          </nav>

          {/* Avatar + name + CTA row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/5 ring-2 ring-[#C9A96E]/40 flex items-center justify-center overflow-hidden">
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} className="w-full h-full object-cover" alt={user?.name} />
                  ) : (
                    <span className="text-white text-xl font-bold">{initials}</span>
                  )}
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1C1F2E] seller-online-dot" />
              </div>

              {/* Text */}
              <div>
                <p className="text-[#C9A96E] text-sm font-medium">{getGreeting()},</p>
                <h1 className="text-white text-3xl font-extrabold leading-tight mt-0.5">{user?.name}</h1>
                <p className="text-white/50 text-sm mt-1">Here's what's happening with your store.</p>
              </div>
            </div>

            {/* CTA button */}
            <Link
              to="/seller/products/new"
              className="shrink-0 inline-flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all border border-white/20"
            >
              <FiPlus size={16} />
              List New Product
            </Link>
          </div>

          {/* Quick-stat pills */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="seller-pill-1 flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] border-l-2 border-l-green-400 hover:bg-white/[0.10] hover:border-white/[0.15] px-4 py-2 rounded-xl transition-all cursor-default">
              <FiCheckCircle size={14} className="text-green-400 shrink-0" />
              <span className="text-white/80 text-xs font-medium">{stats?.liveProducts ?? '—'} Live listings</span>
            </div>
            <div className="seller-pill-2 flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] border-l-2 border-l-[#C9A96E] hover:bg-white/[0.10] hover:border-white/[0.15] px-4 py-2 rounded-xl transition-all cursor-default">
              <FiTrendingUp size={14} className="text-[#C9A96E] shrink-0" />
              <span className="text-white/80 text-xs font-medium">${(stats?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} earned</span>
            </div>
            <div className="seller-pill-3 flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] border-l-2 border-l-amber-400 hover:bg-white/[0.10] hover:border-white/[0.15] px-4 py-2 rounded-xl transition-all cursor-default">
              <span className="relative flex shrink-0">
                <FiClock size={14} className="text-amber-400" />
                {(stats?.pendingReview ?? 0) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full seller-pending-dot" />
                )}
              </span>
              <span className="text-white/80 text-xs font-medium">{stats?.pendingReview ?? '—'} pending review</span>
            </div>
          </div>
        </div>
      </div>

        {/* ── MAIN CONTENT ────────────────────────────────── */}
        <div className="px-8 py-8 space-y-8 flex-1">

          {/* Stats grid — 6 equal columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg, accent, isPending, isRevenue }) => (
              <div
                key={label}
                className="stat-card relative overflow-hidden bg-white border border-[#E8E0D5] rounded-2xl p-5 flex flex-col gap-3 cursor-default transition-all duration-300 hover:border-[#C9A96E]/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ backgroundColor: accent }} />

                {/* Revenue card gold tint overlay */}
                {isRevenue && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A96E]/[0.07] to-transparent" />
                )}

                {/* Icon */}
                <div className={`relative w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0${isPending ? ' pending-icon-pulse' : ''}`}>
                  <Icon className={color} size={18} />
                </div>

                {/* Label + value */}
                <div className="relative">
                  <p className="text-[#6B6560] text-xs font-medium uppercase tracking-wide">{label}</p>
                  <p className={`font-extrabold text-2xl mt-1 leading-none${isRevenue ? ' text-[#C9A96E]' : ' text-[#1C1F2E]'}`}>{value}</p>
                  {isRevenue && (
                    <p className="text-[#C9A96E]/60 text-xs mt-1.5">↑ All time revenue</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#1C1F2E] font-bold text-lg">Recent Products</h2>
              <Link
                to="/seller/products"
                className="text-xs text-[#6B6560] hover:text-[#C9A96E] border border-[#E8E0D5] hover:border-[#C9A96E] font-medium px-4 py-1.5 rounded-xl transition-all duration-200"
              >
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {recentProducts.length > 0 ? (
                recentProducts.map(product => (
                  <SellerProductRow
                    key={product.productId}
                    product={product}
                    onDelete={(id) => setRecentProducts(prev => prev.filter(p => p.productId !== id))}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 flex items-center justify-center mb-4">
                    <FiPackage size={24} className="text-[#C9A96E]" />
                  </div>
                  <p className="text-[#1C1F2E] font-bold text-base">No products yet</p>
                  <p className="text-[#9E9590] text-sm mt-1">List your first product to get started</p>
                  <Link
                    to="/seller/products/new"
                    className="mt-4 inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#1C1F2E] font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    <FiPlus size={15} />
                    List New Product
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-[#C9A96E] rounded-full" />
              <h2 className="text-lg font-bold text-[#1C1F2E]">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Hero: List a Product */}
              <Link to="/seller/products/new"
                className="action-card relative flex items-center gap-4 p-5 rounded-2xl bg-[#1C1F2E] border border-[#1C1F2E] hover:bg-[#252942] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(28,31,46,0.25)] group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />
                <div className="w-11 h-11 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
                  <FiPlus className="text-[#C9A96E] group-hover:scale-110 transition-transform duration-200" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">List a Product</p>
                  <p className="text-white/50 text-xs mt-0.5">Add a new item to your store</p>
                </div>
                <FiArrowRight className="text-[#C9A96E] shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" size={16} />
              </Link>

              {/* Secondary: My Products */}
              <Link to="/seller/products"
                className="action-card relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#C9A96E]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent rounded-t-2xl" />
                <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E8E0D5] group-hover:bg-[#C9A96E]/10 group-hover:border-[#C9A96E]/30 transition-all duration-300 flex items-center justify-center shrink-0">
                  <FiList className="text-[#C9A96E] group-hover:scale-110 transition-transform duration-200" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1C1F2E] font-bold text-sm">My Products</p>
                  <p className="text-[#6B6560] text-xs mt-0.5">Manage your listings</p>
                </div>
                <FiArrowRight className="text-[#9CA3AF] shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" size={16} />
              </Link>

              {/* Secondary: Profile */}
              <Link to="/profile"
                className="action-card relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#C9A96E]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent rounded-t-2xl" />
                <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E8E0D5] group-hover:bg-[#C9A96E]/10 group-hover:border-[#C9A96E]/30 transition-all duration-300 flex items-center justify-center shrink-0">
                  <FiUser className="text-[#C9A96E] group-hover:scale-110 transition-transform duration-200" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1C1F2E] font-bold text-sm">Profile</p>
                  <p className="text-[#6B6560] text-xs mt-0.5">Update your store info</p>
                </div>
                <FiArrowRight className="text-[#9CA3AF] shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" size={16} />
              </Link>

            </div>
          </div>

        </div>
    </div>
  )
}

export default SellerDashboard
