import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { FiSearch, FiX, FiTrendingUp, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ProductCardComponent from '../../components/ProductCard'
import { DUMMY_PRODUCTS } from '../../data/dummyData'
import catPhones from '../../assets/cat-phones1.jpg'
import catComputers from '../../assets/cat-computers.jpg'
import catFashion from '../../assets/cat-fashion2.jpg'
import catWatches from '../../assets/cat-watches1.jpg'
import productHeadphones from '../../assets/product-headphones.jpg'
import productPs5 from '../../assets/product-ps5.jpg'
import productBag from '../../assets/product-bag.jpg'

const MemoProductCard = React.memo(ProductCardComponent)

const CATEGORIES = [
  { value: 'all',                      label: 'All',       img: null },
  { value: 'telephony',                label: 'Phones',    img: catPhones },
  { value: 'audio',                    label: 'Audio',     img: productHeadphones },
  { value: 'computers',                label: 'Computers', img: catComputers },
  { value: 'watches_gifts',            label: 'Watches',   img: catWatches },
  { value: 'fashion_shoes',            label: 'Fashion',   img: catFashion },
  { value: 'consoles_games',           label: 'Gaming',    img: productPs5 },
  { value: 'fashion_bags_accessories', label: 'Bags',      img: productBag },
  { value: 'health_beauty',            label: 'Beauty',    img: null },
]

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
]

function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort]       = useState('newest')
  const [loading, setLoading] = useState(true)
  const [view, setView]       = useState('grid')
  const [page, setPage]       = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

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
    let result = [...DUMMY_PRODUCTS]
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
  }, [search, category, sort])

  const activeFilters = (search ? 1 : 0) + (category !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HERO HEADER ──────────────────────────────────────── */}
      <div className="relative bg-[#1C1F2E] overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#C9A96E]/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#C9A96E]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-0.5 bg-[#C9A96E]" />
                <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-[0.2em]">
                  DynaMart Marketplace
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                Browse Products
              </h1>
              <p className="text-gray-400 text-sm max-w-md">
                Every price is AI-verified to be fair. Shop confidently — no price gouging, ever.
              </p>
            </div>
          </div>

          {/* Search bar inside header */}
          <div className="mt-8 relative max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/15 hover:border-white/30 focus:border-[#C9A96E] rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors"
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

          {/* Category thumbnails — full-width row */}
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none w-full justify-between">
            {CATEGORIES.map(cat => {
              const active = category === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategory(cat.value)}
                  className={`flex-1 min-w-0 flex flex-col items-center gap-1 py-2 px-1 rounded-xl cursor-pointer ${
                    active
                      ? `bg-[#1C1F2E] shadow-md${cat.value === 'all' ? ' ring-2 ring-[#C9A96E] ring-offset-1' : ''}`
                      : 'bg-white border border-[#E8E0D5] hover:border-[#C9A96E]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F5F0EA] flex items-center justify-center shrink-0">
                    {cat.img ? (
                      <img src={cat.img} className="w-full h-full object-cover" alt={cat.label} />
                    ) : (
                      <span className="text-lg">{cat.value === 'all' ? '✨' : '💄'}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-semibold whitespace-nowrap truncate w-full text-center ${active ? 'text-white' : 'text-[#6B6560]'}`}>
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Left — count + active filters */}
          <div className="flex items-center gap-3">
            <p className="text-[#1C1F2E] font-bold text-sm">
              {filtered.length}
              <span className="text-[#6B6560] font-normal"> products</span>
            </p>
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
            <select
              value={sort}
              onChange={e => handleSort(e.target.value)}
              className="bg-white border border-[#E8E0D5] rounded-xl px-3 py-2 text-xs text-[#1C1F2E] focus:outline-none focus:border-[#1C1F2E] transition-colors cursor-pointer font-medium"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Grid / List toggle */}
            <div className="flex bg-white border border-[#E8E0D5] rounded-xl overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors ${view === 'grid' ? 'bg-[#1C1F2E] text-white' : 'text-[#6B6560] hover:text-[#1C1F2E]'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 transition-colors ${view === 'list' ? 'bg-[#1C1F2E] text-white' : 'text-[#6B6560] hover:text-[#1C1F2E]'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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

        {/* PRODUCTS GRID */}
        {!loading && filtered.length > 0 && (
          <div className={
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }>
            {filtered.map(product => (
              <MemoProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full border border-[#E8E0D5] bg-white flex items-center justify-center text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                  page === n
                    ? 'bg-[#1C1F2E] text-white shadow-md'
                    : 'bg-white border border-[#E8E0D5] text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E]'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(5, p + 1))}
              disabled={page === 5}
              className="w-9 h-9 rounded-full border border-[#E8E0D5] bg-white flex items-center justify-center text-[#6B6560] hover:border-[#1C1F2E] hover:text-[#1C1F2E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Trending banner */}
        {!loading && filtered.length > 0 && category === 'all' && !search && (
          <div className="mt-12 bg-[#1C1F2E] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C9A96E]/20 rounded-2xl flex items-center justify-center shrink-0">
                <FiTrendingUp className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">AI-Powered Pricing</p>
                <p className="text-gray-400 text-sm">Every price is dynamically verified to be fair and competitive.</p>
              </div>
            </div>
            <div className="flex gap-6 shrink-0">
              {[['100%', 'Fair Prices'], ['12+', 'Categories'], ['24/7', 'AI Monitoring']].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <p className="text-[#C9A96E] font-extrabold text-xl">{val}</p>
                  <p className="text-gray-500 text-xs">{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
