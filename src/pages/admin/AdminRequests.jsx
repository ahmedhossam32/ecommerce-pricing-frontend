import { useState, useEffect } from 'react'
import { FiClock, FiRefreshCw, FiSearch, FiX, FiXCircle, FiInbox } from 'react-icons/fi'
import { toast } from 'react-toastify'
import AdminRequestRow from '../../components/admin/AdminRequestRow'
import { DUMMY_REQUESTS } from '../../data/adminDummyData'

const TABS = [
  { key: 'ALL',         label: 'All'         },
  { key: 'NEW_LISTING', label: 'New Listings' },
  { key: 'DISPUTE',     label: 'Disputes'     },
]

function AdminRequests() {
  const [requests, setRequests]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [activeTab, setActiveTab]   = useState('ALL')
  const [search, setSearch]         = useState('')

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      // TODO: uncomment when API is ready
      // const token = localStorage.getItem('accessToken')
      // const res = await fetch('http://localhost:8080/api/admin/requests', {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // if (!res.ok) throw new Error('Failed to load requests')
      // setRequests(await res.json())

      await new Promise(r => setTimeout(r, 700))
      setRequests(DUMMY_REQUESTS)
    } catch (err) {
      setError(err.message || 'Something went wrong')
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const q = search.trim().toLowerCase()
  const filteredRequests = requests
    .filter(r => activeTab === 'ALL' || r.requestType === activeTab)
    .filter(r => !q || [r.productName, r.sellerName, r.brand].some(f => f?.toLowerCase().includes(q)))

  const tabCount = (key) =>
    key === 'ALL'
      ? requests.length
      : requests.filter(r => r.requestType === key).length

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

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
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* ── FILTER BAR ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

          {/* Tabs */}
          <div className="flex items-center bg-white border border-[#E8E0D5] rounded-2xl p-1 gap-0.5">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === key
                    ? 'bg-[#1C1F2E] text-white shadow-sm'
                    : 'text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5]'
                }`}
              >
                {label}
                {!loading && !error && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E8E0D5] text-[#6B6560]'
                  }`}>
                    {tabCount(key)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590] pointer-events-none" />
            <input
              type="text"
              placeholder="Search product, seller, brand…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E8E0D5] rounded-2xl pl-9 pr-9 py-2 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9590] hover:text-[#1C1F2E] transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* ── REQUESTS LIST ──────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col gap-3">
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
        ) : filteredRequests.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-[#F5F0EA] border border-[#E8E0D5] rounded-full flex items-center justify-center">
              <FiInbox className="w-8 h-8 text-[#C9A96E]" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">
                {q ? 'No results found' : 'No requests here'}
              </p>
              <p className="text-[#6B6560] text-sm mt-1">
                {q
                  ? `No requests match "${search}" in this view`
                  : activeTab === 'ALL'
                    ? 'All requests have been reviewed'
                    : `No ${activeTab === 'DISPUTE' ? 'dispute' : 'new listing'} requests pending`}
              </p>
            </div>
            {q && (
              <button
                onClick={() => setSearch('')}
                className="text-sm text-[#C9A96E] hover:underline font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-[#9E9590] mb-3 font-medium">
              {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'}
              {q ? ` matching "${search}"` : ''}
            </p>
            <div className="flex flex-col gap-3">
              {filteredRequests.map(req => (
                <AdminRequestRow key={req.requestId} request={req} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default AdminRequests
