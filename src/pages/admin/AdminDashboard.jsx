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
    { label: 'Total Products',     value: stats.totalProducts,          icon: FiPackage,     color: 'text-[#1C1F2E]',  bg: 'bg-[#1C1F2E]/5',  hero: false, hoverBorder: 'hover:border-[#1C1F2E]/30', hoverShadow: 'hover:shadow-[#1C1F2E]/10', navigateTo: '/admin/products'             },
    { label: 'Live Products',      value: stats.liveProducts,           icon: FiCheckCircle, color: 'text-green-500',   bg: 'bg-green-50',     hero: false, hoverBorder: 'hover:border-green-300',    hoverShadow: 'hover:shadow-green-100',    navigateTo: '/admin/products?tab=LIVE'    },
    { label: 'Pending Review',     value: stats.pendingReview,          icon: FiClock,       color: 'text-[#C9A96E]',  bg: 'bg-[#C9A96E]/10', hero: true,  hoverBorder: 'hover:border-[#C9A96E]',    hoverShadow: 'hover:shadow-[#C9A96E]/20', navigateTo: '/admin/requests'             },
    { label: 'Rejected Products',  value: stats.rejectedProducts,       icon: FiXCircle,     color: 'text-red-400',     bg: 'bg-red-50',       hero: false, hoverBorder: 'hover:border-red-300',      hoverShadow: 'hover:shadow-red-100',      navigateTo: '/admin/products?tab=REJECTED'},
    { label: 'Total Sellers',      value: stats.totalSellers,           icon: FiUsers,       color: 'text-blue-500',    bg: 'bg-blue-50',      hero: false, hoverBorder: 'hover:border-blue-300',     hoverShadow: 'hover:shadow-blue-100',     navigateTo: null               },
    { label: 'Total Buyers',       value: stats.totalBuyers,            icon: FiUser,        color: 'text-purple-500',  bg: 'bg-purple-50',    hero: false, hoverBorder: 'hover:border-purple-300',   hoverShadow: 'hover:shadow-purple-100',   navigateTo: null               },
    { label: 'Total Orders',       value: stats.totalOrders,            icon: FiShoppingBag, color: 'text-teal-500',    bg: 'bg-teal-50',      hero: false, hoverBorder: 'hover:border-teal-300',     hoverShadow: 'hover:shadow-teal-100',     navigateTo: null               },
    { label: 'Approved Decisions', value: stats.totalApprovedDecisions, icon: FiZap,         color: 'text-[#C9A96E]',  bg: 'bg-[#C9A96E]/10', hero: false, hoverBorder: 'hover:border-[#C9A96E]',    hoverShadow: 'hover:shadow-[#C9A96E]/20', navigateTo: null               },
  ] : []

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-xs text-white/40">
              <span>Admin Panel</span>
              <span>/</span>
              <span className="text-white/70 font-semibold">Dashboard</span>
            </nav>
            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <FiClock className="w-3.5 h-3.5" /> Review Pending Requests
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
              <FiShield className="w-7 h-7 text-[#C9A96E]" />
            </div>
            <div>
              <p className="text-[#C9A96E] text-sm font-medium">Welcome back,</p>
              <p className="text-3xl font-extrabold text-white mt-1">{name}</p>
              <p className="text-[#9CA3AF] text-sm mt-1">Platform overview — monitor and manage DynaMart</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-10">

        {/* ── STATS GRID ─────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E0D5] rounded-2xl p-5 animate-pulse">
                <div className="w-9 h-9 bg-gray-100 rounded-xl mb-4" />
                <div className="h-3 bg-gray-100 rounded-full w-2/3 mb-3" />
                <div className="h-6 bg-gray-100 rounded-full w-1/2" />
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
            {statCards.map(({ label, value, icon: Icon, color, bg, hero, hoverBorder, hoverShadow, navigateTo }) => (
              <div
                key={label}
                onClick={() => navigateTo && navigate(navigateTo)}
                className={`bg-white rounded-2xl p-5 flex flex-col gap-3 group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${navigateTo ? 'cursor-pointer' : 'cursor-default'} ${
                  hero
                    ? 'border-2 border-[#C9A96E]/50 hover:border-[#C9A96E] hover:shadow-[#C9A96E]/20'
                    : `border border-[#E8E0D5] ${hoverBorder} ${hoverShadow}`
                }`}
              >
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`${color} w-6 h-6`} />
                </div>
                <div>
                  <p className="text-[#9E9590] text-xs font-medium">{label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className={`${color} font-extrabold text-3xl leading-none`}>{value}</p>
                    {hero && value > 0 && (
                      <span className="w-2 h-2 rounded-full bg-[#C9A96E] animate-pulse shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="border-[#E8E0D5]" />

        {/* ── PENDING REQUESTS ───────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[#1C1F2E] font-bold text-xl">Pending Requests</h2>
              <p className="text-[#6B6560] text-sm mt-0.5">Products waiting for your decision</p>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs text-[#6B6560] hover:text-[#1C1F2E] border border-[#E8E0D5] hover:border-[#1C1F2E] px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1.5"
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
          <h2 className="text-[#1C1F2E] font-bold text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Link
              to="/admin/requests"
              className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E] hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group"
            >
              <div className="w-11 h-11 bg-[#FAF0E0] group-hover:bg-[#C9A96E] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <FiClock className="w-5 h-5 text-[#C9A96E] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[#1C1F2E] font-bold text-sm">Review Pending Requests</p>
                <p className="text-[#9E9590] text-xs mt-0.5">Approve or reject seller pricing disputes</p>
              </div>
            </Link>

            <button
              onClick={() => toast.info('All products view coming soon!')}
              className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E] hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group text-left"
            >
              <div className="w-11 h-11 bg-[#FAF0E0] group-hover:bg-[#C9A96E] rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <FiList className="w-5 h-5 text-[#C9A96E] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[#1C1F2E] font-bold text-sm">View All Products</p>
                <p className="text-[#9E9590] text-xs mt-0.5">Browse the full product catalog</p>
              </div>
            </button>

          </div>
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard
