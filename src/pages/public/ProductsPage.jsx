import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiX, FiGrid, FiList, FiChevronLeft, FiChevronRight, FiArrowRight, FiSmartphone, FiMonitor, FiZap, FiWatch, FiShoppingBag, FiHeadphones, FiStar, FiActivity, FiHome, FiMusic, FiBookOpen, FiHeart, FiCoffee } from 'react-icons/fi'
import { MdPets } from 'react-icons/md'
import ProductCardComponent from '../../components/ProductCard'
import { getAllProducts } from '../../api/products'
import { toast } from 'react-toastify'

const MemoProductCard = React.memo(ProductCardComponent)

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  health_beauty: '💄', sports_leisure: '⚽',
  furniture_decor: '🛋', default: '📦',
}

const CATEGORIES = [
  { value: 'all',                      label: 'All Products',  icon: FiGrid },
  { value: 'telephony',                label: 'Phones',        icon: FiSmartphone },
  { value: 'computers',                label: 'Computers',     icon: FiMonitor },
  { value: 'electronics',              label: 'Electronics',   icon: FiZap },
  { value: 'audio',                    label: 'Audio',         icon: FiHeadphones },
  { value: 'watches_gifts',            label: 'Watches',       icon: FiWatch },
  { value: 'fashion_bags_accessories', label: 'Bags',          icon: FiShoppingBag },
  { value: 'fashion_shoes',            label: 'Shoes',         icon: FiActivity },
  { value: 'fashio_female_clothing',   label: 'Fashion',       icon: FiStar },
  { value: 'consoles_games',           label: 'Gaming',        icon: FiZap },
  { value: 'health_beauty',            label: 'Beauty',        icon: FiHeart },
  { value: 'sports_leisure',           label: 'Sports',        icon: FiActivity },
  { value: 'furniture_bedroom',        label: 'Furniture',     icon: FiHome },
  { value: 'musical_instruments',      label: 'Music',         icon: FiMusic },
  { value: 'pet_shop',                 label: 'Pet Shop',      icon: MdPets },
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
]

function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort]       = useState('newest')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState('grid')
  const [page, setPage]       = useState(1)

  useEffect(() => {
    getAllProducts()
      .then(res => setProducts(res.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
    else setCategory('all')
  }, [searchParams])

  const handleSearch = useCallback((val) => {
    setSearch(val)
    setPage(1)
  }, [])

  const handleCategory = useCallback((val) => {
    setCategory(val)
    setPage(1)
  }, [])

  const handleSort = useCallback((val) => {
    setSort(val)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, handleSearch])

  const filtered = useMemo(() => {
    let result = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (category !== 'all') result = result.filter(p => p.category === category)
    switch (sort) {
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break
      case 'price_desc': result.sort((a, b) => b.price - a.price); break
      case 'name_asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return result
  }, [products, search, category, sort])

  const activeFilters = (search ? 1 : 0) + (category !== 'all' ? 1 : 0)

  const ITEMS_PER_PAGE = 8
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HERO HEADER ──────────────────────────────────────── */}
      <div className="relative bg-[#1C1F2E] overflow-hidden">
        {/* Radial glow centred on the left content area */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 25% 50%, rgba(201,169,110,0.08) 0%, transparent 70%)' }}
        />
        {/* Subtle repeating dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #C9A96E 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-12">

          {/* Top label row */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-0.5 bg-[#C9A96E]" />
            <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-[0.2em]">
              DynaMart Marketplace
            </p>
            <div className="w-px h-3 bg-white/20 mx-1" />
            <span className="inline-flex items-center gap-1.5 bg-green-500/15 text-green-400 border border-green-500/20 text-[10px] font-semibold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              AI Engine Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight max-w-xl">
            Browse Products
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mb-6">
            Every price is set by our AI engine — analyzing market data in real time so you always pay a fair price.
          </p>

          {/* Stats strip — inline, simple */}
          <div className="flex items-center gap-6 mb-8">
            {[
              { value: '500+', label: 'Verified Sellers' },
              { value: '100%', label: 'AI-Priced' },
              { value: '12+',  label: 'Categories' },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-6 bg-white/10" />}
                <div>
                  <p className="text-[#C9A96E] font-extrabold text-lg leading-none">{value}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xl focus-within:shadow-[0_0_0_3px_rgba(201,169,110,0.2)] rounded-2xl transition-shadow duration-200">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full bg-white/[0.08] backdrop-blur-sm border border-white/20 hover:border-white/35 focus:border-[#C9A96E] focus:bg-white/[0.12] rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); handleSearch('') }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <FiX className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E8E0D5] shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative">

            {/* Left fade hint for scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 to-transparent z-10 pointer-events-none" />
            {/* Right fade hint for scroll */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center z-10 pointer-events-none">
              <div className="w-16 h-full bg-gradient-to-l from-white via-white/90 to-transparent" />
              <div className="absolute right-2 flex items-center gap-1 text-[#9CA3AF]">
                <FiChevronRight className="w-3.5 h-3.5 animate-bounce-x" />
              </div>
            </div>

            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
              {CATEGORIES.map(cat => {
                const active = category === cat.value
                const Icon = cat.icon
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategory(cat.value)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border shrink-0 transition-all duration-200 group
                      ${active
                        ? 'bg-[#1C1F2E] border-[#1C1F2E] text-white shadow-md'
                        : 'bg-white border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E]/60 hover:text-[#1C1F2E] hover:shadow-sm hover:-translate-y-0.5'
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#C9A96E]' : 'text-[#9CA3AF] group-hover:text-[#C9A96E]'} transition-colors`} />

                    {/* Label */}
                    <span className={`text-xs font-semibold whitespace-nowrap transition-colors duration-200
                      ${active ? 'text-white' : 'text-[#6B6560] group-hover:text-[#1C1F2E]'}
                    `}>
                      {cat.value === 'all' ? 'All Products' : cat.label}
                    </span>

                    {/* Active gold dot */}
                    <span className={`h-1.5 rounded-full bg-[#C9A96E] shrink-0 transition-all duration-200
                      ${active ? 'opacity-100 scale-100 w-1.5' : 'opacity-0 scale-0 w-0'}
                    `} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left — count + active filters */}
          <div className="flex items-center gap-3">
            <p className="text-[#1C1F2E] font-bold text-sm">
              <span className="text-2xl font-extrabold text-[#1C1F2E]">{filtered.length}</span>
              <span className="text-[#6B6560] font-normal text-sm ml-1.5">products found</span>
            </p>
            {activeFilters > 0 && <div className="w-px h-4 bg-[#E8E0D5]" />}
            {activeFilters > 0 && (
              <button
                onClick={() => { setSearchInput(''); handleSearch(''); handleCategory('all') }}
                className="flex items-center gap-1.5 text-xs text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-3 py-1.5 rounded-full hover:bg-[#C9A96E]/20 transition-colors font-medium"
              >
                <FiX className="w-3 h-3" />
                Clear {activeFilters} filter{activeFilters > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Right — sort + view toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B6560] hidden sm:block">Sort by</span>
            <select
              value={sort}
              onChange={e => handleSort(e.target.value)}
              className="bg-white border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1C1F2E] focus:outline-none focus:border-[#C9A96E] transition-colors cursor-pointer font-semibold"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Grid / List toggle */}
            <div className="flex bg-white border border-[#E8E0D5] rounded-xl overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-[#1C1F2E] text-white' : 'text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5]'}`}
              >
                <FiGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 transition-colors ${view === 'list' ? 'bg-[#1C1F2E] text-white' : 'text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5]'}`}
              >
                <FiList className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Thin gold divider line below toolbar */}
        <div className="mt-4 h-px bg-gradient-to-r from-[#C9A96E]/30 via-[#E8E0D5] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-[#F5F0EA] to-[#EDE5D8] animate-pulse" />
                <div className="p-4">
                  <div className="h-2.5 w-16 bg-[#E8E0D5] rounded-full animate-pulse mb-2" />
                  <div className="h-4 w-4/5 bg-[#E8E0D5] rounded-full animate-pulse mb-1.5" />
                  <div className="h-3 w-1/2 bg-[#E8E0D5] rounded-full animate-pulse mb-4" />
                  <div className="flex justify-between">
                    <div className="h-5 w-16 bg-[#E8E0D5] rounded-full animate-pulse" />
                    <div className="h-7 w-14 bg-[#E8E0D5] rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-white border-2 border-dashed border-[#E8E0D5] rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#1C1F2E] mb-2">Nothing found</h3>
            <p className="text-[#6B6560] text-sm mb-8 max-w-xs mx-auto">
              Try a different search term or remove the active filters.
            </p>
            <button
              onClick={() => { setSearchInput(''); handleSearch(''); handleCategory('all') }}
              className="inline-flex items-center gap-2 bg-[#1C1F2E] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#2E3452] transition-colors shadow-lg"
            >
              <FiX className="w-4 h-4" /> Clear all filters
            </button>
          </div>
        )}

        {/* PRODUCTS GRID / LIST */}
        {!loading && filtered.length > 0 && (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
                {paginated.map(product => (
                  <MemoProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {paginated.map(product => (
                  <Link
                    key={product.productId}
                    to={`/products/${product.productId}`}
                    className="bg-white border border-[#E8E0D5] rounded-2xl p-4 flex items-center gap-5 hover:border-[#C9A96E]/50 hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#FAF8F5] flex items-center justify-center">
                      {product.imageUrls?.[0]
                        ? <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                        : <span className="text-3xl">{categoryEmojis[product.category] || '📦'}</span>
                      }
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#C9A96E] text-[10px] font-extrabold uppercase tracking-widest mb-0.5">{product.category?.replace(/_/g, ' ')}</p>
                      <h3 className="text-[#1C1F2E] font-bold text-sm leading-snug truncate group-hover:text-[#2E3452]">{product.name}</h3>
                      <p className="text-[#9E9590] text-xs mt-0.5">{product.brand} · {product.sellerName}</p>
                    </div>
                    {/* Price */}
                    <div className="shrink-0 text-right">
                      <p className="text-[#1C1F2E] font-extrabold text-lg">${product.price?.toFixed(2)}</p>
                      <span className="inline-flex items-center gap-1 text-[#C9A96E] text-[10px] font-bold bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-full mt-1">
                        ✦ AI Verified
                      </span>
                    </div>
                    {/* Arrow */}
                    <FiArrowRight className="w-4 h-4 text-[#6B6560] group-hover:text-[#1C1F2E] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="mt-12 flex flex-col items-center gap-4">

            {/* Page info text */}
            <p className="text-xs text-[#9E9590]">
              Page <span className="font-bold text-[#1C1F2E]">{page}</span> of{' '}
              <span className="font-bold text-[#1C1F2E]">{totalPages}</span>
            </p>

            {/* Pagination controls */}
            <div className="flex items-center gap-1.5">

              {/* Prev button */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E8E0D5] bg-white text-xs font-semibold text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <FiChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
                      page === n
                        ? 'bg-[#1C1F2E] text-white shadow-md scale-105'
                        : 'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E]/50 hover:text-[#1C1F2E] hover:shadow-sm'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E8E0D5] bg-white text-xs font-semibold text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E] hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <FiChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom gold accent line */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent rounded-full mt-2" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
