import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiZap, FiPackage, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { getSellerProducts } from '../../api/seller'
import SellerProductRow from '../../components/seller/SellerProductRow'

function SellerDecisions() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSellerProducts()
      .then(res => setProducts(res.data || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const draftProducts = products.filter(p => p.status === 'DRAFT')

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Dark header */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <nav className="flex items-center gap-2 text-xs text-white/40">
              <Link to="/seller/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="text-white/70 font-semibold">Price Decisions</span>
            </nav>
            <Link
              to="/seller/products/new"
              className="inline-flex items-center gap-1.5 bg-[#1C1F2E] hover:bg-[#2E3452] text-white border border-white/20 text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <FiZap className="w-3.5 h-3.5" /> List New Product
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">Price Decisions</h1>
            {draftProducts.length > 0 && (
              <span className="bg-[#C9A96E] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {draftProducts.length}
              </span>
            )}
          </div>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Products waiting for your price decision
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {draftProducts.length === 0 ? (
          /* Empty state */
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center">
              <FiCheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-[#1C1F2E] font-bold text-lg">All caught up!</p>
              <p className="text-[#6B6560] text-sm mt-1">No products waiting for a price decision.</p>
            </div>
            <Link
              to="/seller/products/new"
              className="inline-flex items-center gap-2 bg-[#C9A96E] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#b8935a] transition-colors"
            >
              <FiZap className="w-4 h-4" /> List a New Product
            </Link>
          </div>
        ) : (
          <>
            {/* Explanation banner */}
            <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <div className="w-8 h-8 bg-[#C9A96E]/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <FiZap className="w-4 h-4 text-[#C9A96E]" />
              </div>
              <div>
                <p className="text-[#1C1F2E] font-bold text-sm">Action required on {draftProducts.length} product{draftProducts.length > 1 ? 's' : ''}</p>
                <p className="text-[#6B6560] text-xs mt-1 leading-relaxed">
                  The AI has suggested a price for each product below.
                  <span className="text-red-500 font-semibold"> Act quickly</span> —
                  review the suggestion and either
                  <span className="text-green-600 font-semibold"> accept </span>
                  it to go live immediately, or
                  <span className="text-[#C9A96E] font-semibold"> dispute </span>
                  it with your own price and reasoning for admin review.
                </p>
              </div>
            </div>

            {/* Product list */}
            <div className="flex flex-col gap-3">
              {draftProducts.map(product => (
                <SellerProductRow key={product.productId} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SellerDecisions
