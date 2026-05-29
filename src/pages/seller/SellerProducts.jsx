import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiPackage, FiAlertCircle, FiArrowRight, FiChevronLeft, FiChevronRight, FiTag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { getSellerProducts } from '../../api/seller'
import SellerProductRow from '../../components/seller/SellerProductRow'

const FILTER_STYLES = {
  ALL:            { active: 'bg-[#1C1F2E] text-white',  inactive: 'hover:border-[#1C1F2E]'  },
  LIVE:           { active: 'bg-green-600 text-white',   inactive: 'hover:border-green-400'  },
  DRAFT:          { active: 'bg-[#1C1F2E] text-white',  inactive: 'hover:border-[#1C1F2E]'  },
  PENDING_REVIEW: { active: 'bg-[#C9A96E] text-[#1C1F2E]', inactive: 'hover:border-[#C9A96E]'  },
  REJECTED:       { active: 'bg-red-700 text-white',     inactive: 'hover:border-red-400'    },
}

const ITEMS_PER_PAGE = 5

function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getSellerProducts()
      .then(res => setProducts(res.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const FILTERS = [
    { key: 'ALL',            label: 'All',            count: products.length },
    { key: 'LIVE',           label: 'Live',           count: products.filter(p => p.status === 'LIVE').length },
    { key: 'DRAFT',          label: 'Action Needed',  count: products.filter(p => p.status === 'DRAFT').length },
    { key: 'PENDING_REVIEW', label: 'Pending Review', count: products.filter(p => p.status === 'PENDING_REVIEW').length },
    { key: 'REJECTED',       label: 'Rejected',       count: products.filter(p => p.status === 'REJECTED').length },
  ]

  const draftCount = products.filter(p => p.status === 'DRAFT').length

  const filtered = activeFilter === 'ALL' ? products : products.filter(p => p.status === activeFilter)

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleFilterChange = (key) => {
    setActiveFilter(key)
    setCurrentPage(1)
  }

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
              className="inline-flex items-center gap-1.5 bg-[#1C1F2E] hover:bg-[#2E3452] text-white border border-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <FiPlus className="w-3.5 h-3.5" /> List New Product
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Products</h1>
          <p className="text-[#C9A96E] text-sm mt-1">
            {activeFilter === 'ALL'
              ? `${products.length} total listings`
              : `${filtered.length} ${FILTERS.find(f => f.key === activeFilter)?.label} listings`}
          </p>
        </div>
      </div>

      {/* ── FILTER TABS ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ key, label, count }) => {
            const isActive = activeFilter === key
            const styles   = FILTER_STYLES[key]
            return (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center shadow-sm ${
                  isActive
                    ? styles.active
                    : `bg-white border border-[#E8E0D5] text-[#6B6560] ${styles.inactive}`
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#6B6560]'
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
            <p className="text-lg font-bold text-[#1C1F2E]">No {FILTERS.find(f => f.key === activeFilter)?.label} products</p>
            {activeFilter === 'DRAFT' && (
              <p className="text-[#6B6560] text-sm mt-1">All caught up! No pending decisions.</p>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {paginated.map(product => (
                <SellerProductRow key={product.productId} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E8E0D5]">
                <p className="text-xs text-[#6B6560]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-[#E8E0D5] flex items-center justify-center text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-[#1C1F2E] text-white'
                          : 'border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded-lg border border-[#E8E0D5] flex items-center justify-center text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── BOTTOM BANNER ─────────────────────────────────── */}
      {draftCount > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-[#1C1F2E] border border-[#C9A96E]/20 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center">
                  <FiTag className="text-[#C9A96E]" size={18} />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C9A96E] rounded-full animate-ping opacity-75" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C9A96E] rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {draftCount} product{draftCount > 1 ? 's' : ''} waiting for your pricing decision
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  Review AI-suggested prices and accept or dispute to get your products live.
                </p>
              </div>
            </div>
            <button
              onClick={() => { handleFilterChange('DRAFT') }}
              className="shrink-0 flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#1C1F2E] font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-[0_4px_16px_rgba(201,169,110,0.35)]"
            >
              Review Now <FiArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default SellerProducts
