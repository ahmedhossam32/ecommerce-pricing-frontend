import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiShoppingCart, FiPackage, FiTag, FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'
import PriceHistoryChart from '../../components/PriceHistoryChart'

const DUMMY_PRODUCTS = [
  { productId: 1, name: 'iPhone 17 Pro Max 256GB', category: 'telephony', brand: 'Apple', price: 977, sellerName: 'Tech Store', description: 'The latest iPhone 17 Pro Max featuring a titanium design, A19 Pro chip, and the most advanced camera system ever in an iPhone. Available in 256GB storage.', weight: 221 },
  { productId: 2, name: 'Sony WH-1000XM5 Headphones', category: 'audio', brand: 'Sony', price: 280, sellerName: 'Audio World', description: 'Industry-leading noise canceling headphones with Auto NC Optimizer, precise voice pickup technology, and up to 30-hour battery life.', weight: 250 },
  { productId: 3, name: 'MacBook Pro 14 M3', category: 'computers', brand: 'Apple', price: 1999, sellerName: 'Apple Store', description: 'MacBook Pro with M3 chip delivers exceptional performance for professionals. Features a stunning Liquid Retina XDR display and all-day battery life.', weight: 1550 },
  { productId: 4, name: 'Rolex Submariner', category: 'watches_gifts', brand: 'Rolex', price: 7500, sellerName: 'Luxury Watch Co', description: 'The Rolex Submariner is the reference among divers watches. Waterproof to a depth of 300 metres, it features a rotatable bezel with a 60-minute scale.', weight: 155 },
  { productId: 5, name: 'Nike Air Force 1 White', category: 'fashion_shoes', brand: 'Nike', price: 120, sellerName: 'Sneaker Hub', description: 'The Nike Air Force 1 is the first basketball shoe to use Nike Air technology. Clean white leather upper with Air cushioning for all-day comfort.', weight: 400 },
  { productId: 6, name: 'PlayStation 5 Console', category: 'consoles_games', brand: 'Sony', price: 499, sellerName: 'Game Zone', description: 'PlayStation 5 console with ultra-high speed SSD, ray tracing, 4K gaming, and the new DualSense wireless controller with haptic feedback.', weight: 4500 },
]

const DUMMY_HISTORY = [
  { price: 850, event: 'Seller accepted', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { price: 920, event: 'Admin approved', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
  { price: 977, event: 'Admin override', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
]

const categoryEmojis = {
  telephony: '📱', audio: '🎧', computers: '💻',
  watches_gifts: '⌚', fashion_shoes: '👟',
  fashion_bags_accessories: '👜', consoles_games: '🎮',
  default: '📦'
}

function ProductDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('details')

  const product = DUMMY_PRODUCTS.find(p => p.productId === parseInt(id)) || DUMMY_PRODUCTS[0]
  const emoji = categoryEmojis[product.category] || categoryEmojis.default

  const handleAddToCart = () => toast.success(`${product.name} added to cart!`)
  const handleWishlist = () => toast.success(`${product.name} saved to wishlist!`)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1C1F2E] text-sm mb-8 transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          {/* Left — Image */}
          <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
            <span className="text-9xl opacity-50">{emoji}</span>
          </div>

          {/* Right — Info */}
          <div className="flex flex-col justify-center">

            {/* Category + Brand */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#FAF8F5] border border-[#E8E0D5] text-[#C9A96E] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {product.category?.replace(/_/g, ' ')}
              </span>
              <span className="text-[#6B6560] text-xs">{product.brand}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-[#1C1F2E] mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#1C1F2E]">
                ${product.price?.toFixed(2)}
              </span>
              <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-0.5 rounded-full">
                AI Verified ✓
              </span>
            </div>

            {/* Description */}
            <p className="text-[#6B6560] text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Seller + Weight */}
            <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-[#E8E0D5]">
              <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                <FiUser className="w-4 h-4 text-[#C9A96E]" />
                Sold by <span className="text-[#1C1F2E] font-medium ml-1">{product.sellerName}</span>
              </div>
              {product.weight && (
                <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                  <FiPackage className="w-4 h-4 text-[#C9A96E]" />
                  {product.weight}g
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#6B6560]">
                <FiTag className="w-4 h-4 text-[#C9A96E]" />
                {product.category?.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white py-3.5 rounded-full font-semibold text-sm transition-colors"
              >
                <FiShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1C1F2E] text-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white py-3.5 rounded-full font-semibold text-sm transition-all"
              >
                <FiHeart className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-[#E8E0D5] rounded-3xl overflow-hidden">

          {/* Tab headers */}
          <div className="flex border-b border-[#E8E0D5]">
            {[
              { key: 'details', label: 'Product Details' },
              { key: 'history', label: 'Price History' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-[#1C1F2E]'
                    : 'text-[#6B6560] hover:text-[#1C1F2E]'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#C9A96E] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-8">
            {activeTab === 'details' && (
              <div className="space-y-4">
                {[
                  { label: 'Brand', value: product.brand },
                  { label: 'Category', value: product.category?.replace(/_/g, ' ') },
                  { label: 'Weight', value: product.weight ? `${product.weight}g` : 'N/A' },
                  { label: 'Seller', value: product.sellerName },
                  { label: 'Price', value: `$${product.price?.toFixed(2)}` },
                  { label: 'Pricing', value: 'AI-Verified Fair Price' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#FAF8F5] last:border-0">
                    <span className="text-[#6B6560] text-sm">{item.label}</span>
                    <span className="text-[#1C1F2E] text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <PriceHistoryChart history={DUMMY_HISTORY} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
