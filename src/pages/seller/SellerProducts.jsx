import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiPackage, FiAlertCircle } from 'react-icons/fi'
import { DUMMY_PRODUCTS } from '../../data/dummyData'
import SellerProductRow from '../../components/seller/SellerProductRow'

const SELLER_PRODUCTS = [
  { ...DUMMY_PRODUCTS[0], status: 'LIVE',           price: 977,  suggestedPrice: 950  },
  { ...DUMMY_PRODUCTS[1], status: 'LIVE',           price: 280,  suggestedPrice: 275  },
  { ...DUMMY_PRODUCTS[2], status: 'PENDING_REVIEW', price: null, suggestedPrice: 1999 },
  { ...DUMMY_PRODUCTS[3], status: 'DRAFT',          price: null, suggestedPrice: 7500 },
  { ...DUMMY_PRODUCTS[4], status: 'REJECTED',       price: null, suggestedPrice: 120  },
  { ...DUMMY_PRODUCTS[5], status: 'LIVE',           price: 499,  suggestedPrice: 480  },
  { ...DUMMY_PRODUCTS[6], status: 'DRAFT',          price: null, suggestedPrice: 850  },
  { ...DUMMY_PRODUCTS[7], status: 'PENDING_REVIEW', price: null, suggestedPrice: 399  },
]


const FILTERS = [
  { key: 'ALL',            label: 'All',            count: SELLER_PRODUCTS.length },
  { key: 'LIVE',           label: 'Live',           count: SELLER_PRODUCTS.filter(p => p.status === 'LIVE').length },
  { key: 'DRAFT',          label: 'Action Needed',  count: SELLER_PRODUCTS.filter(p => p.status === 'DRAFT').length },
  { key: 'PENDING_REVIEW', label: 'Pending Review', count: SELLER_PRODUCTS.filter(p => p.status === 'PENDING_REVIEW').length },
  { key: 'REJECTED',       label: 'Rejected',       count: SELLER_PRODUCTS.filter(p => p.status === 'REJECTED').length },
]

const draftCount = SELLER_PRODUCTS.filter(p => p.status === 'DRAFT').length


function SellerProducts() {
  const [activeFilter, setActiveFilter] = useState('ALL')

  const filtered = activeFilter === 'ALL'
    ? SELLER_PRODUCTS
    : SELLER_PRODUCTS.filter(p => p.status === activeFilter)

  const activeFilterLabel = FILTERS.find(f => f.key === activeFilter)?.label || 'All'

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-xs text-white/40">
              <Link to="/seller/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-white/70 font-semibold">My Products</span>
            </nav>
            <Link
              to="/seller/products/new"
              className="inline-flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <FiPlus className="w-3.5 h-3.5" /> List New Product
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Products</h1>
          <p className="text-[#C9A96E] text-sm mt-1">{SELLER_PRODUCTS.length} total listings</p>
        </div>
      </div>

      {/* ── FILTER TABS ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ key, label, count }) => {
            const isActive = activeFilter === key
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center ${
                  isActive
                    ? 'bg-[#1C1F2E] text-white shadow-md'
                    : 'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#1C1F2E]'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-[#FAF8F5]'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── PRODUCTS LIST ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FiPackage className="w-12 h-12 text-[#E8E0D5] mx-auto mb-3" />
            <p className="text-lg font-bold text-[#1C1F2E]">No {activeFilterLabel} products</p>
            {activeFilter === 'DRAFT' && (
              <p className="text-[#6B6560] text-sm mt-1">All caught up! No pending decisions.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(product => (
              <SellerProductRow key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* ── BOTTOM BANNER ─────────────────────────────────── */}
      {draftCount > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-blue-500 w-5 h-5 shrink-0" />
              <div>
                <p className="text-blue-700 font-semibold text-sm">
                  You have {draftCount} product(s) waiting for your decision
                </p>
                <p className="text-blue-500 text-xs mt-0.5">
                  Review the suggested prices and accept or dispute them to get your products live.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveFilter('DRAFT')}
              className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors shrink-0"
            >
              Review Now →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default SellerProducts
