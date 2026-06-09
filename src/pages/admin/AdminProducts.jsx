import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiPackage, FiClock, FiXCircle,
  FiFileText, FiSearch, FiX, FiRefreshCw,
  FiAlertCircle, FiDollarSign, FiArrowRight, FiTrash2,
  FiMail, FiInbox, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi'
import { categoryEmojis, categoryGradients } from '../../data/adminDummyData'
import api from '../../api/axiosInstance'
import { deleteAdminProduct } from '../../api/admin'

const TABS = [
  { key: 'ALL',            label: 'All'            },
  { key: 'LIVE',           label: 'Live'           },
  { key: 'PENDING_REVIEW', label: 'Pending Review' },
  { key: 'REJECTED',       label: 'Rejected'       },
  { key: 'DRAFT',          label: 'Draft'          },
]

const TAB_ACTIVE = {
  ALL:            'bg-[#1C1F2E] text-white shadow-md',
  LIVE:           'bg-green-600 text-white shadow-md',
  PENDING_REVIEW: 'bg-[#C9A96E] text-white shadow-md',
  REJECTED:       'bg-red-500 text-white shadow-md',
  DRAFT:          'bg-[#6B7280] text-white shadow-md',
}

const TAB_INACTIVE = {
  ALL:            'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E]',
  LIVE:           'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-green-400 hover:text-green-600',
  PENDING_REVIEW: 'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E]',
  REJECTED:       'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-red-400 hover:text-red-500',
  DRAFT:          'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-gray-400 hover:text-gray-600',
}

const getStatusBadge = (status) => {
  switch (status) {
    case 'LIVE':           return 'bg-green-50 text-green-600 border border-green-200'
    case 'PENDING_REVIEW': return 'bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/30'
    case 'REJECTED':       return 'bg-red-50 text-red-500 border border-red-200'
    case 'DRAFT':          return 'bg-gray-50 text-gray-500 border border-gray-200'
    default:               return 'bg-gray-50 text-gray-500 border border-gray-200'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'LIVE':           return 'Live'
    case 'PENDING_REVIEW': return 'Pending Review'
    case 'REJECTED':       return 'Rejected'
    case 'DRAFT':          return 'Draft'
    default:               return status
  }
}

function AdminProductRow({ product, onOverrideClick, navigate, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const {
    productId, productName, category, brand,
    sellerName, sellerEmail, sellerProfilePictureUrl,
    price, suggestedPrice, status, createdAt, imageUrls,
  } = product

  const emoji         = categoryEmojis[category]   || categoryEmojis.default
  const gradient      = categoryGradients[category] || categoryGradients.default
  const hasImage      = imageUrls?.length > 0
  const sellerInitial = sellerName?.[0]?.toUpperCase() || '?'
  const isClickable   = status === 'LIVE' || status === 'PENDING_REVIEW'

  const handleClick = () => {
    if (status === 'LIVE') {
      onOverrideClick(product)
    } else if (status === 'PENDING_REVIEW') {
      if (product.requestId) navigate(`/admin/requests/${product.requestId}`)
      else navigate('/admin/requests')
    }
  }

  return (
    <>
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`group relative overflow-hidden border rounded-2xl p-4 flex items-center gap-4 transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
      } ${
        status === 'LIVE'           ? 'bg-white border-[#E8E0D5] hover:border-green-300' :
        status === 'PENDING_REVIEW' ? 'bg-[#C9A96E]/5 border-[#C9A96E]/20 hover:border-[#C9A96E]/40' :
        status === 'REJECTED'       ? 'bg-red-50/30 border-red-200' :
        status === 'DRAFT'          ? 'bg-gray-50/40 border-[#E8E0D5]' :
        'bg-white border-[#E8E0D5] hover:border-[#C9A96E]/40'
      }`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${
        status === 'LIVE'           ? 'bg-green-400' :
        status === 'PENDING_REVIEW' ? 'bg-[#C9A96E]' :
        status === 'REJECTED'       ? 'bg-red-400' :
        'bg-gray-300'
      }`} />

      {/* Thumbnail */}
      <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {hasImage
          ? <img src={imageUrls[0]} alt={productName} className="w-full h-full object-cover" />
          : <span className="text-2xl">{emoji}</span>
        }
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className={`text-[#1C1F2E] font-bold text-sm truncate transition-colors ${isClickable ? 'group-hover:text-[#2E3452]' : ''}`}>
          {productName}
        </p>
        <p className="text-[#9E9590] text-xs mt-0.5">
          {brand ?? 'Unknown'} · {category?.replace(/_/g, ' ')}
        </p>

        <div className="flex items-center gap-2 mt-1.5">
          {sellerProfilePictureUrl ? (
            <img src={sellerProfilePictureUrl} alt={sellerName} className="w-4 h-4 rounded-full object-cover border border-[#E8E0D5] shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
              <span className="text-[#C9A96E] text-[8px] font-bold">{sellerInitial}</span>
            </div>
          )}
          <p className="text-[#9E9590] text-xs truncate">{sellerEmail}</p>
        </div>

        {product.condition && (
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
            product.condition === 'NEW'
              ? 'bg-green-50 text-green-600 border-green-200'
              : product.condition === 'USED'
              ? 'bg-amber-50 text-amber-600 border-amber-200'
              : product.condition === 'REFURBISHED'
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-gray-50 text-gray-500 border-gray-200'
          }`}>
            {product.condition}
          </span>
        )}
        <p className="text-[#9CA3AF] text-[10px] mt-1">
          {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
          className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
          title="Delete product"
        >
          <FiTrash2 size={14} />
        </button>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusBadge(status)}`}>
          {getStatusLabel(status)}
        </span>

        <div className="text-right">
          {price != null ? (
            <>
              <p className="text-[#1C1F2E] font-extrabold text-sm">${price.toFixed(2)}</p>
              <p className="text-[#9E9590] text-[10px]">current price</p>
            </>
          ) : suggestedPrice != null ? (
            <>
              <p className="text-[#C9A96E] font-extrabold text-sm">${suggestedPrice.toFixed(2)}</p>
              <p className="text-[#9E9590] text-[10px]">AI suggested</p>
            </>
          ) : (
            <p className="text-[#9E9590] text-xs">No price yet</p>
          )}
        </div>

        {isClickable && (
          <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E8E0D5] group-hover:bg-[#1C1F2E] group-hover:border-[#1C1F2E] flex items-center justify-center transition-all duration-200">
            <FiArrowRight className="w-3.5 h-3.5 text-[#6B6560] group-hover:text-white transition-colors" />
          </div>
        )}

        {status === 'LIVE' && (
          <p className="text-[10px] text-[#9CA3AF]">Click to override</p>
        )}
        {status === 'PENDING_REVIEW' && (
          <p className="text-[10px] text-[#C9A96E]">Click to review</p>
        )}
        {status === 'DRAFT' && (
          <p className="text-[10px] text-amber-500 flex items-center gap-1">
            <FiClock className="w-3 h-3 shrink-0" /> Awaiting seller
          </p>
        )}
        {status === 'REJECTED' && (
          <p className="text-[10px] text-red-400 flex items-center gap-1">
            <FiXCircle className="w-3 h-3 shrink-0" /> No action needed
          </p>
        )}
      </div>
    </div>

    {showConfirm && (
      <div
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
        onClick={() => !deleting && setShowConfirm(false)}
      >
        <div
          className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 mx-auto flex items-center justify-center">
            <FiTrash2 className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="font-extrabold text-lg text-[#1C1F2E] text-center">Delete Product?</h3>
          <p className="text-sm text-[#6B6560] text-center">
            This will permanently remove <span className="font-semibold">{productName}</span> from the platform. Orders referencing it will be preserved.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setDeleting(true)
                try {
                  await deleteAdminProduct(productId)
                  toast.success('Product deleted successfully')
                  setShowConfirm(false)
                  onDelete?.(productId)
                } catch {
                  toast.error('Failed to delete product')
                  setDeleting(false)
                }
              }}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

function AdminProducts() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts]               = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState(null)
  const [activeTab, setActiveTab]             = useState('ALL')
  const [search, setSearch]                   = useState('')
  const [currentPage, setCurrentPage]         = useState(1)
  const ITEMS_PER_PAGE = 8

  const [overrideModal, setOverrideModal]         = useState(null)
  const [newPrice, setNewPrice]                   = useState('')
  const [adminNote, setAdminNote]                 = useState('')
  const [overrideLoading, setOverrideLoading]     = useState(false)
  const [overrideError, setOverrideError]         = useState(null)
  const [confirmOverride, setConfirmOverride]     = useState(false)
  const [overrideImgIndex, setOverrideImgIndex]   = useState(0)

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && TABS.find(t => t.key === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [])

  const handleTabChange = (key) => {
    setActiveTab(key)
    setCurrentPage(1)
    if (key === 'ALL') setSearchParams({})
    else setSearchParams({ tab: key })
  }

  const handleDelete = (productId) => {
    setProducts(prev => prev.filter(p => p.productId !== productId))
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/admin/products')
      setProducts(res.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const q = search.trim().toLowerCase()

  const filteredProducts = products
    .filter(p => activeTab === 'ALL' || p.status === activeTab)
    .filter(p => !q || [p.productName, p.brand, p.sellerName].some(f => f?.toLowerCase().includes(q)))

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginated  = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const tabCount = (key) =>
    key === 'ALL' ? products.length : products.filter(p => p.status === key).length

  const handleOverride = async () => {
    setOverrideLoading(true)
    try {
      await api.post(`/admin/override/${overrideModal.product.productId}`, {
        newPrice: Number(newPrice),
        adminNote: adminNote.trim() || undefined
      })
      setProducts(prev =>
        prev.map(p =>
          p.productId === overrideModal.product.productId
            ? { ...p, price: Number(newPrice) }
            : p
        )
      )
      toast.success(`Price overridden to $${Number(newPrice).toFixed(2)} successfully!`)
      setOverrideModal(null)
      setConfirmOverride(false)
      setNewPrice('')
      setAdminNote('')
    } catch (err) {
      setOverrideError(err?.response?.data?.message || 'Failed to override. Try again.')
      setConfirmOverride(false)
      toast.error(err?.response?.data?.message || 'Failed to override price')
    } finally {
      setOverrideLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes productRowIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .admin-product-row { animation: productRowIn 0.3s ease both; }
        .admin-product-row:nth-child(1) { animation-delay: 0.03s; }
        .admin-product-row:nth-child(2) { animation-delay: 0.06s; }
        .admin-product-row:nth-child(3) { animation-delay: 0.09s; }
        .admin-product-row:nth-child(4) { animation-delay: 0.12s; }
        .admin-product-row:nth-child(5) { animation-delay: 0.15s; }
        .admin-product-row:nth-child(6) { animation-delay: 0.18s; }
        .admin-product-row:nth-child(7) { animation-delay: 0.21s; }
        .admin-product-row:nth-child(8) { animation-delay: 0.24s; }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link to="/admin/dashboard" className="hover:text-white/70 transition-colors">Admin Panel</Link>
            <span>/</span>
            <span className="text-white/70 font-semibold">All Products</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                <FiPackage className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-white">All Products</h1>
                  {!loading && (
                    <span className="bg-[#C9A96E] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {products.length}
                    </span>
                  )}
                </div>
                <p className="text-[#9CA3AF] text-sm mt-1">Browse and manage all products on the platform</p>
              </div>
            </div>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center gap-2 border border-[#E8E0D5]/20 hover:border-white/30 text-white/60 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === key ? TAB_ACTIVE[key] : TAB_INACTIVE[key]
                }`}
              >
                {label}
                {!loading && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? 'bg-white/20' : 'bg-[#FAF8F5] text-[#6B6560]'
                  }`}>
                    {tabCount(key)}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="w-px h-7 bg-[#E8E0D5]" />

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Search product, seller, brand..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/10 transition-all"
            />
            {search && (
              <button onClick={() => { setSearch(''); setCurrentPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1C1F2E] transition-colors">
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Products list */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E0D5] rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded-full w-2/5" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-5 bg-gray-100 rounded-full w-16" />
                  <div className="h-4 bg-gray-100 rounded-full w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
              <FiXCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">Failed to load products</p>
              <p className="text-[#6B6560] text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 bg-[#1C1F2E] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#2E3452] transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-[#FAF8F5] border border-[#E8E0D5] rounded-full flex items-center justify-center">
              <FiInbox className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">
                {q ? 'No results found' : 'No products here'}
              </p>
              <p className="text-[#6B6560] text-sm mt-1">
                {q
                  ? `No products match "${search}"`
                  : `No ${activeTab === 'ALL' ? '' : getStatusLabel(activeTab).toLowerCase() + ' '}products found`}
              </p>
            </div>
            {q && (
              <button onClick={() => setSearch('')} className="text-sm text-[#C9A96E] font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#C9A96E] rounded-full" />
              <p className="text-[#6B6560] text-sm">
                <span className="font-bold text-[#1C1F2E]">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
                {search && <span className="text-[#9CA3AF]"> matching "{search}"</span>}
                {activeTab !== 'ALL' && !search && <span className="text-[#9CA3AF]"> · {TABS.find(t => t.key === activeTab)?.label}</span>}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {paginated.map(p => (
                <div key={p.productId} className="admin-product-row">
                  <AdminProductRow
                    product={p}
                    onOverrideClick={(product) => {
                      setOverrideModal({ product })
                      setNewPrice(String(product.price ?? ''))
                      setAdminNote('')
                      setOverrideError(null)
                      setOverrideImgIndex(0)
                    }}
                    navigate={navigate}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
                <p className="text-xs text-[#6B6560]">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
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
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-[#1C1F2E] text-white'
                          : 'border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E] hover:text-[#C9A96E]'
                      }`}>
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

      {/* ── OVERRIDE MODAL ───────────────────────────────────── */}
      {overrideModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => { setOverrideModal(null); setConfirmOverride(false) }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >

            {/* Product hero banner */}
            <div className="relative h-40 overflow-hidden">
              {overrideModal.product.imageUrls?.length > 0 ? (
                <img
                  src={overrideModal.product.imageUrls[overrideImgIndex]}
                  alt={overrideModal.product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[overrideModal.product.category] || categoryGradients.default} flex items-center justify-center`}>
                  <span className="text-7xl">
                    {categoryEmojis[overrideModal.product.category] || categoryEmojis.default}
                  </span>
                </div>
              )}
              {overrideModal.product.imageUrls?.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOverrideImgIndex(i => i === 0 ? overrideModal.product.imageUrls.length - 1 : i - 1) }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOverrideImgIndex(i => i === overrideModal.product.imageUrls.length - 1 ? 0 : i + 1) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/35 hover:bg-black/55 text-white rounded-full flex items-center justify-center transition-colors z-10"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-[62px] left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {overrideModal.product.imageUrls.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setOverrideImgIndex(i) }}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === overrideImgIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                <div>
                  <p className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-widest">
                    {overrideModal.product.category?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-white font-extrabold text-lg leading-tight">
                    {overrideModal.product.productName}
                  </p>
                  {overrideModal.product.brand && (
                    <p className="text-white/70 text-xs mt-0.5">{overrideModal.product.brand}</p>
                  )}
                </div>
                <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Live
                </span>
              </div>
              <button
                onClick={() => { setOverrideModal(null); setConfirmOverride(false) }}
                className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">

              {/* Seller info + current price */}
              <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl">
                {overrideModal.product.sellerProfilePictureUrl ? (
                  <img
                    src={overrideModal.product.sellerProfilePictureUrl}
                    alt={overrideModal.product.sellerName}
                    className="w-9 h-9 rounded-full object-cover border border-[#E8E0D5] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
                    <span className="text-[#C9A96E] font-bold text-sm">
                      {overrideModal.product.sellerName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[#1C1F2E] font-semibold text-sm truncate">{overrideModal.product.sellerName}</p>
                  <p className="text-[#6B6560] text-xs truncate">{overrideModal.product.sellerEmail}</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <p className="text-[#9CA3AF] text-[10px]">Current price</p>
                  <p className="text-[#1C1F2E] font-extrabold text-base">
                    ${overrideModal.product.price?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* New price input */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1F2E] mb-1.5">
                  New Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9590] font-semibold text-sm pointer-events-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newPrice}
                    onChange={e => { setNewPrice(e.target.value); setOverrideError(null) }}
                    placeholder="0.00"
                    className={`w-full bg-[#FAF8F5] border rounded-xl pl-8 pr-4 py-3 text-sm text-[#1C1F2E] font-semibold focus:outline-none transition-colors ${
                      overrideError ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#C9A96E]'
                    }`}
                  />
                </div>
                {overrideError && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3 shrink-0" /> {overrideError}
                  </p>
                )}
                {newPrice && !isNaN(Number(newPrice)) && Number(newPrice) > 0 && overrideModal.product.price && (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="text-[#9CA3AF] line-through">${overrideModal.product.price.toFixed(2)}</span>
                    <span className="text-[#9CA3AF]">→</span>
                    <span className={`font-bold ${
                      Number(newPrice) > overrideModal.product.price ? 'text-green-600'
                        : Number(newPrice) < overrideModal.product.price ? 'text-red-500'
                        : 'text-[#6B6560]'
                    }`}>
                      ${Number(newPrice).toFixed(2)}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      Number(newPrice) > overrideModal.product.price ? 'bg-green-50 text-green-600'
                        : Number(newPrice) < overrideModal.product.price ? 'bg-red-50 text-red-500'
                        : 'bg-gray-50 text-gray-500'
                    }`}>
                      {Number(newPrice) > overrideModal.product.price
                        ? `+$${(Number(newPrice) - overrideModal.product.price).toFixed(2)}`
                        : Number(newPrice) < overrideModal.product.price
                        ? `-$${(overrideModal.product.price - Number(newPrice)).toFixed(2)}`
                        : 'No change'}
                    </span>
                  </div>
                )}
              </div>

              {/* Admin note */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1F2E] mb-1.5">
                  Reason <span className="text-[#9CA3AF] font-normal">(optional)</span>
                </label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Reason for price override (included in seller email)..."
                  rows={2}
                  maxLength={500}
                  className="w-full bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none"
                />
                <p className="text-[#9CA3AF] text-xs mt-1 text-right">{adminNote.length}/500</p>
              </div>

              {/* Email disclaimer */}
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-[#FAF8F5] rounded-lg px-3 py-2">
                <FiMail className="w-3.5 h-3.5 shrink-0" />
                Seller will receive an override notification email automatically
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setOverrideModal(null); setConfirmOverride(false) }}
                  className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newPrice || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
                      setOverrideError('Please enter a valid positive price')
                      return
                    }
                    setConfirmOverride(true)
                  }}
                  className="flex-1 bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Override Price
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM OVERRIDE MODAL ───────────────────────────── */}
      {confirmOverride && overrideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 flex items-center justify-center mx-auto">
              <FiDollarSign className="w-7 h-7 text-[#C9A96E]" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-[#1C1F2E] font-extrabold text-lg">Override this price?</p>
              <p className="text-[#6B6560] text-sm leading-relaxed">
                <span className="font-semibold text-[#1C1F2E]">{overrideModal.product.productName}</span>
                {' '}price will change from{' '}
                <span className="font-bold text-red-500">${overrideModal.product.price?.toFixed(2)}</span>
                {' '}to{' '}
                <span className="font-bold text-green-600">${Number(newPrice).toFixed(2)}</span>.
                The seller will be notified by email.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOverride(false)}
                className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-2.5 rounded-xl transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                disabled={overrideLoading}
                className="flex-1 bg-[#C9A96E] hover:bg-[#b8935a] disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
              >
                {overrideLoading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                  : 'Yes, Override'
                }
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminProducts
