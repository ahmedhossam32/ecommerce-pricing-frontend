import { useState, useEffect } from 'react'
import { FiClock, FiRefreshCw, FiSearch, FiX, FiXCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { toast } from 'react-toastify'
import AdminRequestRow from '../../components/admin/AdminRequestRow'
import api from '../../api/axiosInstance'

const FILTERS = [
  { key: 'ALL',         label: 'All'          },
  { key: 'NEW_LISTING', label: 'New Listings'  },
  { key: 'DISPUTE',     label: 'Disputes'      },
]

const FILTER_ACTIVE = {
  ALL:         'bg-[#1C1F2E] text-white shadow-md',
  NEW_LISTING: 'bg-[#1C1F2E] text-white shadow-md',
  DISPUTE:     'bg-[#C9A96E] text-[#1C1F2E] shadow-md',
}

const FILTER_INACTIVE = {
  ALL:         'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E]',
  NEW_LISTING: 'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E]',
  DISPUTE:     'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E]',
}

function AdminRequests() {
  const [requests, setRequests]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [search, setSearch]       = useState('')
  const [currentPage, setCurrentPage]   = useState(1)
  const ITEMS_PER_PAGE = 5

  const handleFilterChange = (key) => { setActiveFilter(key); setCurrentPage(1) }
  const handleSearchChange = (val)  => { setSearch(val);      setCurrentPage(1) }

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/admin/requests')
      setRequests(res.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load requests')
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const q = search.trim().toLowerCase()
  const filtered = requests
    .filter(r => activeFilter === 'ALL' || r.requestType === activeFilter)
    .filter(r => !q || [r.productName, r.sellerName, r.brand].some(f => f?.toLowerCase().includes(q)))

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const tabCount = (key) =>
    key === 'ALL' ? requests.length : requests.filter(r => r.requestType === key).length

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .request-row { animation: rowSlideIn 0.3s ease both; }
        .request-row:nth-child(1) { animation-delay: 0.03s; }
        .request-row:nth-child(2) { animation-delay: 0.06s; }
        .request-row:nth-child(3) { animation-delay: 0.09s; }
        .request-row:nth-child(4) { animation-delay: 0.12s; }
        .request-row:nth-child(5) { animation-delay: 0.15s; }
        .request-row:nth-child(6) { animation-delay: 0.18s; }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <span>Admin Panel</span>
            <span>/</span>
            <span className="text-white/70 font-semibold">Requests</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                <FiClock className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-extrabold text-white">Pending Requests</p>
                  {!loading && !error && (
                    <span className="bg-[#C9A96E] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {requests.length}
                    </span>
                  )}
                </div>
                <p className="text-[#9CA3AF] text-sm mt-1">Review and decide on seller pricing submissions</p>
              </div>
            </div>
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="flex items-center gap-2 border border-[#E8E0D5]/20 hover:border-white/30 text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* ── FILTER BAR ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap mb-2">

          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeFilter === key ? FILTER_ACTIVE[key] : FILTER_INACTIVE[key]
                }`}
              >
                {label}
                {!loading && !error && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeFilter === key
                      ? key === 'DISPUTE' ? 'bg-[#1C1F2E]/20 text-[#1C1F2E]' : 'bg-white/20 text-white'
                      : 'bg-[#FAF8F5] text-[#6B6560]'
                  }`}>
                    {tabCount(key)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-7 bg-[#E8E0D5]" />

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" size={15} />
            <input
              type="text"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search product, seller, brand..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1C1F2E] transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── REQUESTS LIST ──────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col gap-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E0D5] rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded-full w-2/5" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                  <div className="h-4 bg-gray-100 rounded-full w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-24 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
              <FiXCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">Failed to load requests</p>
              <p className="text-[#6B6560] text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchRequests}
              className="inline-flex items-center gap-2 bg-[#1C1F2E] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#2E3452] transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center gap-3 mt-4">
            <div className="w-14 h-14 bg-[#FAF8F5] border border-[#E8E0D5] rounded-2xl flex items-center justify-center">
              <FiClock className="text-[#C9A96E]" size={24} />
            </div>
            <p className="text-[#1C1F2E] font-bold">No requests found</p>
            <p className="text-[#6B6560] text-sm">
              {search ? `No results for "${search}"` : 'No pending requests at this time'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-[#C9A96E] text-sm font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center gap-2 mt-4 mb-3">
              <div className="w-1 h-4 bg-[#C9A96E] rounded-full" />
              <p className="text-[#6B6560] text-sm">
                <span className="font-bold text-[#1C1F2E]">{filtered.length}</span> request{filtered.length !== 1 ? 's' : ''}
                {activeFilter !== 'ALL' && (
                  <span className="text-[#9CA3AF]"> · filtered by {activeFilter === 'DISPUTE' ? 'Disputes' : 'New Listings'}</span>
                )}
                {search && (
                  <span className="text-[#9CA3AF]"> · matching "{search}"</span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {paginated.map(req => (
                <div key={req.requestId} className="request-row">
                  <AdminRequestRow request={req} />
                </div>
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
    </div>
  )
}

export default AdminRequests
