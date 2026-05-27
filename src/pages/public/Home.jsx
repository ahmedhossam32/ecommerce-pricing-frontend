import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthModal from '../../components/AuthModal'
import heroIllustration from '../../assets/hero-illustration.png'
import catPhones from '../../assets/cat-phones1.jpg'
import catFashion from '../../assets/cat-fashion2.jpg'
import catComputers from '../../assets/cat-computers.jpg'
import catWatches from '../../assets/cat-watches1.jpg'
import { FiShield, FiTrendingUp, FiStar, FiArrowRight, FiPackage, FiCheckCircle } from 'react-icons/fi'
import ProductCard from '../../components/ProductCard'
import { DUMMY_PRODUCTS } from '../../data/dummyData'


function AnimatedCounter({ target, suffix = '', duration = 1500, delay = 800 }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setStarted(true)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const steps = 40
    const increment = target / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return <span>{count}{suffix}</span>
}

function Home() {
  const [authModal, setAuthModal] = useState(null)

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1F2E]">

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="bg-[#1C1F2E] min-h-screen flex items-center relative overflow-hidden">

                {/* Subtle background texture */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                          linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A96E] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                    {/* Left — Text */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 border border-[#C9A96E]/40 bg-[#C9A96E]/10 backdrop-blur-sm text-[#C9A96E] text-xs px-4 py-2 rounded-full mb-8 animate-fade-up animate-fade-up-1">
                            <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse shrink-0" />
                            AI-Verified Pricing — Every Product, Every Time
                            <span className="bg-[#C9A96E]/20 text-[#C9A96E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                LIVE
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white animate-fade-up animate-fade-up-2">
                            Shop Smart.
                            <br />
                            <span className="text-[#C9A96E]">Price Fair.</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg animate-fade-up animate-fade-up-3">
                            DynaMart is a marketplace where every price is transparent,
                            AI-verified, and fair. Buyers trust every listing.
                            Sellers reach real customers.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12 animate-fade-up animate-fade-up-4">
                            <Link
                                to="/products"
                                className="flex items-center gap-2 bg-white text-[#1C1F2E] hover:bg-gray-50 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5"
                            >
                                Start Shopping <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setAuthModal({ tab: 'register', role: 'SELLER' })}
                                className="flex items-center gap-2 border border-[#C9A96E]/50 hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 text-[#C9A96E] px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Sell With Us
                            </button>
                        </div>

                        {/* Stats row */}
                        <div className="flex gap-10 pt-8 border-t border-gray-800 mt-6 animate-fade-up animate-fade-up-5">
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    <AnimatedCounter target={10} suffix="K+" delay={900} />
                                </p>
                                <p className="text-gray-500 text-xs mt-1">Products Listed</p>
                            </div>
                            <div className="border-l border-gray-800 pl-10">
                                <p className="text-2xl font-bold text-white">
                                    <AnimatedCounter target={500} suffix="+" delay={1000} />
                                </p>
                                <p className="text-gray-500 text-xs mt-1">Verified Sellers</p>
                            </div>
                            <div className="border-l border-gray-800 pl-10">
                                <p className="text-2xl font-bold text-white">
                                    <AnimatedCounter target={100} suffix="%" delay={1100} />
                                </p>
                                <p className="text-gray-500 text-xs mt-1">Fair Pricing</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Illustration */}
                    <div className="hidden lg:flex items-center justify-center py-8 relative animate-fade-up animate-fade-up-3">
                        <div className="absolute w-96 h-96 bg-[#C9A96E] opacity-5 rounded-full blur-3xl" />
                        <img
                            src={heroIllustration}
                            alt="DynaMart marketplace illustration"
                            className="w-full max-w-xl object-contain relative z-10 transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer"
                            style={{ mixBlendMode: 'screen' }}
                        />
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-fade-up animate-fade-up-5">
                    <p className="text-xs tracking-widest uppercase">Scroll</p>
                    <div className="w-5 h-9 border border-gray-700 rounded-full flex items-start justify-center pt-2">
                        <div className="w-1 h-2 bg-[#C9A96E] rounded-full animate-bounce opacity-60" />
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────────────── */}
            <section className="pt-12 pb-20 bg-[#FAF8F5]">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#C9A96E] font-semibold text-xs uppercase tracking-widest mb-3">
                            Browse by Category
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1C1F2E]">
                            Shop What You Love
                        </h2>
                        <p className="text-[#6B6560] mt-3 text-sm max-w-md mx-auto">
                            Thousands of products across every category, all with AI-verified fair prices.
                        </p>
                    </div>

                    {/* Category Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { image: catPhones,    label: 'Phones & Tablets', subtitle: 'Latest devices',        count: '1,200+ products', category: 'telephony'    },
                            { image: catFashion,   label: 'Fashion',           subtitle: 'Shoes & Clothing',      count: '3,400+ products', category: 'fashion_shoes' },
                            { image: catComputers, label: 'Computers',         subtitle: 'Laptops & Accessories', count: '800+ products',   category: 'computers'    },
                            { image: catWatches,   label: 'Watches',           subtitle: 'Luxury & Casual',       count: '600+ products',   category: 'watches_gifts' },
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                to={`/products?category=${cat.category}`}
                                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute inset-0 bg-[#1C1F2E]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <p className="text-[#C9A96E] text-xs font-medium mb-1">{cat.subtitle}</p>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{cat.label}</h3>
                                    <p className="text-gray-400 text-xs mb-3">{cat.count}</p>
                                    <div className="flex items-center gap-2 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        Shop Now <FiArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View All
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View all link */}
                    <div className="text-center mt-10">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 border border-[#1C1F2E] text-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                        >
                            View All Products <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
            <section className="pt-8 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#C9A96E] font-semibold text-xs uppercase tracking-widest mb-3">
                            Hand Picked
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1C1F2E]">
                            Featured Products
                        </h2>
                        <p className="text-[#6B6560] mt-3 text-sm max-w-md mx-auto">
                            Discover our most popular products with AI-verified fair prices.
                        </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {DUMMY_PRODUCTS.slice(0, 4).map(product => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>

                    {/* View all button */}
                    <div className="text-center mt-10">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 border border-[#1C1F2E] text-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white px-8 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                        >
                            View All Products <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WHY SHOP WITH US ─────────────────────────────────── */}
            <section className="pt-8 pb-20 bg-[#FAF8F5]">
              <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                  <p className="text-[#C9A96E] font-semibold text-xs uppercase tracking-widest mb-3">
                    Our Promise
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#1C1F2E] mb-4">
                    Why Shop With Us?
                  </h2>
                  <p className="text-[#6B6560] max-w-xl mx-auto text-sm leading-relaxed">
                    We built something different. A marketplace where the price
                    is always explained, never random.
                  </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {[
                    {
                      icon: <FiShield className="w-6 h-6" />,
                      title: 'Verified Fair Prices',
                      desc: 'Every price is reviewed and AI-verified before going live. No overpricing, no guesswork. Buyers always get a fair deal.',
                      color: 'bg-blue-50 text-blue-600',
                    },
                    {
                      icon: <FiTrendingUp className="w-6 h-6" />,
                      title: 'Full Price Transparency',
                      desc: 'See the complete price history of any product. Know if prices are rising or dropping before you buy.',
                      color: 'bg-[#FDF8F0] text-[#C9A96E]',
                    },
                    {
                      icon: <FiStar className="w-6 h-6" />,
                      title: 'Curated Marketplace',
                      desc: 'Every product is reviewed before going live. Quality listings from trusted sellers only. No spam, no fakes.',
                      color: 'bg-green-50 text-green-600',
                    },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-8 border border-[#E8E0D5] hover:shadow-lg hover:border-[#C9A96E]/30 hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {f.icon}
                      </div>
                      <h3 className="text-[#1C1F2E] font-bold text-lg mb-3">{f.title}</h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom stats strip */}
                <div className="bg-[#1C1F2E] rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { value: '10K+',  label: 'Products Listed'  },
                    { value: '500+',  label: 'Verified Sellers' },
                    { value: '50K+',  label: 'Happy Buyers'     },
                    { value: '100%',  label: 'Fair Pricing'     },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <p className="text-3xl font-extrabold text-[#C9A96E]">{stat.value}</p>
                      <div className="w-8 h-0.5 bg-[#C9A96E]/30 rounded-full my-1" />
                      <p className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* ── FOR SELLERS ──────────────────────────────────────── */}
            <section className="pt-8 pb-20 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                  {/* Left — Text */}
                  <div>
                    <p className="text-[#C9A96E] font-semibold text-xs uppercase tracking-widest mb-4">
                      For Sellers
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1C1F2E] mb-6 leading-tight">
                      Start selling in
                      <br />
                      <span className="text-[#C9A96E]">minutes, not hours.</span>
                    </h2>
                    <p className="text-[#6B6560] leading-relaxed mb-8 text-sm">
                      Fill in 5 simple fields. Our AI engine suggests the perfect
                      price instantly. No market research needed. No pricing
                      expertise required. Just list and let AI do the rest.
                    </p>

                    {/* Steps */}
                    <div className="space-y-4 mb-8">
                      {[
                        'Fill product name, description, category, weight and shipping cost',
                        'AI engine suggests a fair market price instantly',
                        'Accept, adjust within range, or dispute — you stay in control',
                        'Product goes live to thousands of buyers automatically',
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-7 h-7 bg-[#1C1F2E] text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold">{i + 1}</span>
                          </div>
                          <p className="text-[#6B6560] text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setAuthModal({ tab: 'register', role: 'SELLER' })}
                      className="inline-flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors duration-200"
                    >
                      Become a Seller <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right — Dashboard Mockup */}
                  <div className="bg-[#1C1F2E] rounded-3xl p-6 shadow-2xl">

                    {/* Window bar */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-3 h-3 bg-red-400 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                      <span className="text-gray-500 text-xs ml-2">Seller Dashboard — DynaMart</span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Live Products', value: '12', color: 'text-green-400' },
                        { label: 'Pending Review', value: '3', color: 'text-yellow-400' },
                        { label: 'Total Revenue', value: '$4,820', color: 'text-[#C9A96E]' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#252840] rounded-2xl p-4">
                          <p className="text-gray-500 text-xs mb-2">{stat.label}</p>
                          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Product list */}
                    <div className="space-y-2 mb-4">
                      {[
                        { name: 'iPhone 17 Pro Max', price: '$977', status: 'LIVE', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                        { name: 'Sony WH-1000XM5', price: '$280', status: 'LIVE', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                        { name: 'Rolex Submariner', price: '—', status: 'PENDING', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
                        { name: 'Nike Air Force 1', price: '$120', status: 'LIVE', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#252840] rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-[#1C1F2E] rounded-lg flex items-center justify-center">
                              <FiPackage className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-white text-xs font-medium">{p.name}</p>
                              <p className="text-gray-500 text-xs">{p.price}</p>
                            </div>
                          </div>
                          <span className={`text-xs border px-2 py-0.5 rounded-full ${p.color}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom bar */}
                    <div className="bg-[#252840] rounded-2xl px-4 py-3 flex items-center justify-between">
                      <p className="text-gray-500 text-xs">This month revenue</p>
                      <p className="text-[#C9A96E] font-bold text-sm">$1,240</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <section className="py-20 bg-[#1C1F2E]">
              <div className="max-w-3xl mx-auto px-6 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 border border-[#C9A96E]/30 bg-[#C9A96E]/10 text-[#C9A96E] text-xs px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse" />
                  Join DynaMart Today
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to start?
                </h2>
                <p className="text-gray-400 mb-10 text-lg">
                  Join thousands of buyers and sellers on the fairest marketplace online.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mb-10">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 bg-white text-[#1C1F2E] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-sm transition-colors hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                  >
                    Browse Products <FiArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setAuthModal({ tab: 'register', role: 'BUYER' })}
                    className="flex items-center gap-2 border border-[#C9A96E]/50 hover:border-[#C9A96E] hover:bg-[#C9A96E]/10 text-[#C9A96E] px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Create Account
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/10">
                  {[
                    { icon: FiCheckCircle, text: 'Free to join' },
                    { icon: FiShield,      text: 'AI-verified prices' },
                    { icon: FiStar,        text: 'No hidden fees' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Icon className="w-4 h-4 text-[#C9A96E] shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

              </div>
            </section>

        {authModal && (
          <AuthModal
            onClose={() => setAuthModal(null)}
            initialTab={authModal.tab}
            initialRole={authModal.role}
          />
        )}
        </div>
    )
}

export default Home
