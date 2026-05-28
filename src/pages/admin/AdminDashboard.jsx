import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiShield, FiPackage, FiCheckCircle, FiClock, FiXCircle,
  FiUsers, FiUser, FiShoppingBag, FiZap, FiList,
  FiRefreshCw, FiArrowRight,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import AdminRequestRow from '../../components/admin/AdminRequestRow'
import { DUMMY_REQUESTS } from '../../data/adminDummyData'

const DUMMY_STATS = {
  totalProducts: 47,
  liveProducts: 31,
  pendingReview: 6,
  rejectedProducts: 5,
  totalSellers: 12,
  totalApprovedDecisions: 24,
  totalBuyers: 89,
  totalOrders: 143,
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const name = localStorage.getItem('name') || 'Admin'

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: uncomment fetch when API is ready
      // const token = localStorage.getItem('accessToken')
      // const res = await fetch('/api/admin/stats', {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // if (!res.ok) throw new Error('Failed to load stats')
      // setStats(await res.json())

      await new Promise(r => setTimeout(r, 700))
      setStats(DUMMY_STATS)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'text-[#1C1F2E]', bg: 'bg-[#1C1F2E]/5', hero: false, hoverBorder: 'hover:border-[#1C1F2E]/30', hoverShadow: 'hover:shadow-[#1C1F2E]/10', navigateTo: '/admin/products', accentColor: '#1C1F2E' },
    { label: 'Live Products', value: stats.liveProducts, icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50', hero: false, hoverBorder: 'hover:border-green-300', hoverShadow: 'hover:shadow-green-100', navigateTo: '/admin/products?tab=LIVE', accentColor: '#22c55e' },
    { label: 'Pending Review', value: stats.pendingReview, icon: FiClock, color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/10', hero: true, hoverBorder: 'hover:border-[#C9A96E]', hoverShadow: 'hover:shadow-[#C9A96E]/20', navigateTo: '/admin/requests', accentColor: '#C9A96E' },
    { label: 'Rejected Products', value: stats.rejectedProducts, icon: FiXCircle, color: 'text-red-400', bg: 'bg-red-50', hero: false, hoverBorder: 'hover:border-red-300', hoverShadow: 'hover:shadow-red-100', navigateTo: '/admin/products?tab=REJECTED', accentColor: '#ef4444' },
    { label: 'Total Sellers', value: stats.totalSellers, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50', hero: false, hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-blue-100', navigateTo: null, accentColor: '#3b82f6' },
    { label: 'Total Buyers', value: stats.totalBuyers, icon: FiUser, color: 'text-purple-500', bg: 'bg-purple-50', hero: false, hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-purple-100', navigateTo: null, accentColor: '#a855f7' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'text-teal-500', bg: 'bg-teal-50', hero: false, hoverBorder: 'hover:border-teal-300', hoverShadow: 'hover:shadow-teal-100', navigateTo: null, accentColor: '#14b8a6' },
    { label: 'Approved Decisions', value: stats.totalApprovedDecisions, icon: FiZap, color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/10', hero: false, hoverBorder: 'hover:border-[#C9A96E]', hoverShadow: 'hover:shadow-[#C9A96E]/20', navigateTo: null, accentColor: '#C9A96E' },
  ] : []

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes adminHeaderFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-header-content { animation: adminHeaderFadeIn 0.4s ease both; }
        @keyframes actionCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-action-card { animation: actionCardIn 0.35s ease both; }
        .admin-action-card:nth-child(1) { animation-delay: 0.05s; }
        .admin-action-card:nth-child(2) { animation-delay: 0.12s; }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card { animation: cardReveal 0.4s ease both; }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.10s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.20s; }
        .stat-card:nth-child(5) { animation-delay: 0.25s; }
        .stat-card:nth-child(6) { animation-delay: 0.30s; }
        .stat-card:nth-child(7) { animation-delay: 0.35s; }
        .stat-card:nth-child(8) { animation-delay: 0.40s; }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-8 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute left-0 top-0 w-96 h-full bg-[#C9A96E]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-start justify-between gap-6 admin-header-content">

            {/* Left — breadcrumb + avatar + name + pills */}
            <div>
              <nav className="flex items-center gap-2 text-xs text-white/40 mb-5">
                <span>Admin Panel</span>
                <span>/</span>
                <span className="text-white/70 font-semibold">Dashboard</span>
              </nav>

              <div className="flex items-center gap-4">
                {/* Avatar with gold ring + online dot */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/5 flex items-center justify-center ring-2 ring-[#C9A96E]/30">
                    <FiShield className="text-[#C9A96E]" size={24} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#1C1F2E]" />
                </div>

                <div>
                  <p className="text-[#C9A96E] text-sm font-medium">Welcome back,</p>
                  <h1 className="text-white text-3xl font-extrabold">{name}</h1>
                  <p className="text-white/50 text-sm mt-0.5">Platform overview — monitor and manage DynaMart</p>
                </div>
              </div>

              {/* Quick-stat pills */}
              {stats && (
                <div className="flex gap-3 mt-5 flex-wrap">
                  <span className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-white/80 text-xs px-4 py-2 rounded-xl border border-white/[0.08] transition-all">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                    <FiClock className="text-amber-400" size={13} />
                    {stats.pendingReview} pending review
                  </span>
                  <span className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-white/80 text-xs px-4 py-2 rounded-xl border border-white/[0.08] transition-all">
                    <FiCheckCircle className="text-green-400" size={13} />
                    {stats.liveProducts} live products
                  </span>
                  <span className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.10] text-white/80 text-xs px-4 py-2 rounded-xl border border-white/[0.08] transition-all">
                    <FiUsers className="text-blue-400" size={13} />
                    {stats.totalSellers} sellers
                  </span>
                </div>
              )}
            </div>

            {/* Right — CTA */}
            <Link
              to="/admin/requests"
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#1C1F2E] font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)] shrink-0 mt-9"
            >
              <FiClock size={15} />
              Review Pending Requests
              {stats && stats.pendingReview > 0 && (
                <span className="bg-[#1C1F2E]/20 text-[#1C1F2E] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {stats.pendingReview}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-10">

        {/* ── STATS GRID ─────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E0D5] rounded-2xl p-5 animate-pulse h-[140px]">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4" />
                <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mb-3" />
                <div className="h-7 bg-gray-100 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
              <FiXCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">Failed to load stats</p>
              <p className="text-[#6B6560] text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-2 bg-[#1C1F2E] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#2E3452] transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg, hero, hoverBorder, hoverShadow, navigateTo, accentColor }) => (
              <div
                key={label}
                onClick={() => navigateTo && navigate(navigateTo)}
                className={`stat-card relative bg-white rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg ${navigateTo ? 'cursor-pointer' : 'cursor-default'} ${hero
                    ? 'border-2 border-[#C9A96E]/50 hover:border-[#C9A96E] hover:shadow-[#C9A96E]/20'
                    : `border border-[#E8E0D5] ${hoverBorder} ${hoverShadow}`
                  }`}
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ background: accentColor }}
                />

                {/* Hero gold gradient overlay */}
                {hero && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A96E]/[0.04] to-transparent pointer-events-none rounded-2xl" />
                )}

                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0`}>
                  <Icon className={`${color} w-6 h-6`} />
                </div>

                <div>
                  <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wide">{label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`${color} font-extrabold text-3xl leading-none`}>{value}</p>
                    {hero && value > 0 && (
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C9A96E]" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow on hover for clickable cards */}
                {navigateTo && (
                  <FiArrowRight
                    size={14}
                    className="absolute bottom-4 right-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <hr className="border-[#E8E0D5]" />

        {/* ── PENDING REQUESTS ───────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#C9A96E] rounded-full" />
              <div>
                <h2 className="text-[#1C1F2E] font-bold text-xl">Pending Requests</h2>
                <p className="text-[#6B6560] text-sm mt-0.5">Products waiting for your decision</p>
              </div>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs text-[#6B6560] hover:text-[#C9A96E] border border-[#E8E0D5] hover:border-[#C9A96E]/50 px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-1.5"
            >
              View All <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {DUMMY_REQUESTS.map(req => (
              <AdminRequestRow key={req.requestId} request={req} />
            ))}
          </div>
        </section>

        {/* ── QUICK ACTIONS ──────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#C9A96E] rounded-full" />
            <h2 className="text-[#1C1F2E] font-bold text-xl">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Link
              to="/admin/requests"
              className="admin-action-card relative flex items-center gap-4 p-5 rounded-2xl bg-[#1C1F2E] border border-[#1C1F2E] hover:bg-[#252942] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(28,31,46,0.25)] group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent" />
              <div className="w-11 h-11 rounded-xl bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
                <FiClock className="text-[#C9A96E] group-hover:scale-110 transition-transform duration-200" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Review Pending Requests</p>
                <p className="text-white/50 text-xs mt-0.5">Approve or reject seller pricing disputes</p>
              </div>
              <FiArrowRight className="text-[#C9A96E] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" size={16} />
            </Link>

            <Link
              to="/admin/products"
              className="admin-action-card relative flex items-center gap-4 p-5 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#C9A96E]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E8E0D5] group-hover:bg-[#C9A96E]/10 group-hover:border-[#C9A96E]/30 transition-all duration-300 flex items-center justify-center shrink-0">
                <FiList className="text-[#C9A96E] group-hover:scale-110 transition-transform duration-200" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[#1C1F2E] font-bold text-sm">View All Products</p>
                <p className="text-[#6B6560] text-xs mt-0.5">Browse the full product catalog</p>
              </div>
              <FiArrowRight className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" size={16} />
            </Link>

          </div>
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard
