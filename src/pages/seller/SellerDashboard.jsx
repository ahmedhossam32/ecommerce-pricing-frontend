import { Link } from 'react-router-dom'
import {
  FiPackage, FiCheckCircle, FiClock, FiFileText,
  FiXCircle, FiDollarSign, FiPlus, FiList, FiUser, FiTrendingUp,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { DUMMY_PRODUCTS } from '../../data/dummyData'
import SellerProductRow from '../../components/seller/SellerProductRow'

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
  status: ['LIVE', 'LIVE', 'PENDING_REVIEW', 'REJECTED', 'LIVE'][i],
}))


const statCards = [
  { label: 'Total Products', value: DUMMY_STATS.total,    icon: FiPackage,     color: 'text-[#C9A96E]',  bg: 'bg-[#C9A96E]/10' },
  { label: 'Live',           value: DUMMY_STATS.live,     icon: FiCheckCircle, color: 'text-green-500',   bg: 'bg-green-50'     },
  { label: 'Pending Review', value: DUMMY_STATS.pending,  icon: FiClock,       color: 'text-yellow-500',  bg: 'bg-yellow-50'    },
  { label: 'Drafts',         value: DUMMY_STATS.draft,    icon: FiFileText,    color: 'text-gray-400',    bg: 'bg-gray-50'      },
  { label: 'Rejected',       value: DUMMY_STATS.rejected, icon: FiXCircle,     color: 'text-red-400',     bg: 'bg-red-50'       },
  {
    label: 'Total Revenue',
    value: `$${DUMMY_STATS.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    icon: FiDollarSign,
    color: 'text-[#C9A96E]',
    bg: 'bg-[#C9A96E]/10',
  },
]


function SellerDashboard() {
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">

        {/* ── HERO HEADER ─────────────────────────────────── */}
        <div className="bg-[#1C1F2E] py-10 px-8">
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-xs text-white/40">
              <span>Seller Center</span>
              <span>/</span>
              <span className="text-white/70 font-semibold">Dashboard</span>
            </nav>
            <Link
              to="/seller/products/new"
              className="inline-flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <FiPlus className="w-3.5 h-3.5" />
              List New Product
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center shrink-0">
              {user?.profilePicture ? (
                <img src={user.profilePicture} className="w-full h-full object-cover" alt={user?.name} />
              ) : (
                <span className="text-white text-xl font-bold">{initials}</span>
              )}
            </div>
            <div>
              <p className="text-[#C9A96E] text-sm font-medium">Welcome back,</p>
              <p className="text-3xl font-extrabold text-white mt-1">{user?.name}</p>
              <p className="text-gray-400 text-sm mt-1">Here's what's happening with your store.</p>
            </div>
          </div>

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

        {/* ── MAIN CONTENT ────────────────────────────────── */}
        <div className="px-8 py-8 space-y-8 flex-1">

          {/* Stats grid — 6 equal columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white border border-[#E8E0D5] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#C9A96E]/40 hover:shadow-sm transition-all"
              >
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={color} style={{ width: 18, height: 18 }} />
                </div>
                <div>
                  <p className="text-[#9E9590] text-xs font-medium">{label}</p>
                  <p className="text-[#1C1F2E] font-extrabold text-xl mt-0.5 leading-none">{value}</p>
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
                className="text-xs text-[#6B6560] hover:text-[#1C1F2E] border border-[#E8E0D5] hover:border-[#1C1F2E] px-3 py-1.5 rounded-full transition-all font-medium"
              >
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {RECENT_PRODUCTS.map(product => (
                <SellerProductRow key={product.productId} product={product} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-[#1C1F2E] font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Link to="/seller/products/new"
                className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E] hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group">
                <div className="w-11 h-11 bg-[#FAF0E0] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C9A96E] transition-colors">
                  <FiPlus className="w-5 h-5 text-[#C9A96E] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[#1C1F2E] font-bold text-sm">List a Product</p>
                  <p className="text-[#9E9590] text-xs mt-0.5">Add a new item to your store</p>
                </div>
              </Link>

              <Link to="/seller/products"
                className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E] hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group">
                <div className="w-11 h-11 bg-[#FAF0E0] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C9A96E] transition-colors">
                  <FiList className="w-5 h-5 text-[#C9A96E] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[#1C1F2E] font-bold text-sm">My Products</p>
                  <p className="text-[#9E9590] text-xs mt-0.5">Manage your listings</p>
                </div>
              </Link>

              <Link to="/profile"
                className="bg-white border border-[#E8E0D5] hover:border-[#C9A96E] hover:shadow-sm rounded-2xl p-6 flex items-center gap-4 transition-all group">
                <div className="w-11 h-11 bg-[#FAF0E0] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C9A96E] transition-colors">
                  <FiUser className="w-5 h-5 text-[#C9A96E] group-hover:text-white transition-colors" />
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
