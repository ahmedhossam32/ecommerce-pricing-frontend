import { Link } from 'react-router-dom'
import heroIllustration from '../../assets/hero-illustration.png'
import catPhones from '../../assets/cat-phones1.jpg'
import catFashion from '../../assets/cat-fashion2.jpg'
import catComputers from '../../assets/cat-computers.jpg'
import catWatches from '../../assets/cat-watches1.jpg'
import productPs5 from '../../assets/product-ps5.jpg'
import productHeadphones from '../../assets/product-headphones1.jpg'
import productBag from '../../assets/product-bag.jpg'
import productWatch from '../../assets/product-watch.jpg'
import { FiShield, FiTrendingUp, FiStar, FiArrowRight, FiPackage, FiHeart, FiShoppingCart } from 'react-icons/fi'


function Home() {
    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1F2E]">

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="bg-[#1C1F2E] min-h-screen flex items-center relative overflow-hidden">

                {/* Subtle background texture */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25px 25px, #C9A96E 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                    {/* Left — Text */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 border border-[#C9A96E]/30 bg-[#C9A96E]/10 text-[#C9A96E] text-xs px-4 py-2 rounded-full mb-8">
                            <span className="w-1.5 h-1.5 bg-[#C9A96E] rounded-full animate-pulse" />
                            AI-Verified Pricing — Every Product, Every Time
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-white">
                            Shop Smart.
                            <br />
                            <span className="text-[#C9A96E]">Price Fair.</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                            DynaMart is a marketplace where every price is transparent,
                            AI-verified, and fair. Buyers trust every listing.
                            Sellers reach real customers.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <Link
                                to="/products"
                                className="flex items-center gap-2 bg-white text-[#1C1F2E] hover:bg-gray-100 px-8 py-3.5 rounded-full font-semibold text-sm transition-colors duration-200"
                            >
                                Start Shopping <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-2 border border-[#C9A96E]/40 hover:border-[#C9A96E] text-[#C9A96E] px-8 py-3.5 rounded-full font-semibold text-sm transition-colors duration-200"
                            >
                                Sell With Us
                            </Link>
                        </div>

                        {/* Stats row */}
                        <div className="flex gap-10 pt-8 border-t border-gray-800 mt-6">
                            <div>
                                <p className="text-2xl font-bold text-white">10K+</p>
                                <p className="text-gray-500 text-xs mt-1">Products Listed</p>
                            </div>
                            <div className="border-l border-gray-800 pl-10">
                                <p className="text-2xl font-bold text-white">500+</p>
                                <p className="text-gray-500 text-xs mt-1">Verified Sellers</p>
                            </div>
                            <div className="border-l border-gray-800 pl-10">
                                <p className="text-2xl font-bold text-white">100%</p>
                                <p className="text-gray-500 text-xs mt-1">Fair Pricing</p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Illustration */}
                    <div className="hidden lg:flex items-center justify-center py-8 relative">
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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
                    <p className="text-xs">Scroll to explore</p>
                    <div className="w-5 h-8 border border-gray-700 rounded-full flex items-start justify-center pt-1.5">
                        <div className="w-1 h-2 bg-gray-600 rounded-full animate-bounce" />
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────────────── */}
            <section className="py-20 bg-[#FAF8F5]">
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
                            { image: catPhones, label: 'Phones & Tablets', subtitle: 'Latest devices', count: '1,200+ products' },
                            { image: catFashion, label: 'Fashion', subtitle: 'Shoes & Clothing', count: '3,400+ products' },
                            { image: catComputers, label: 'Computers', subtitle: 'Laptops & Accessories', count: '800+ products' },
                            { image: catWatches, label: 'Watches', subtitle: 'Luxury & Casual', count: '600+ products' },
                        ].map((cat, i) => (
                            <Link
                                key={i}
                                to="/products"
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
            <section className="py-20 bg-white">
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
                        {[
                            { image: productPs5, name: 'PlayStation 5 Console', category: 'Gaming', price: '$499', badge: 'Popular', badgeColor: 'bg-blue-50 text-blue-600', imgClass: '' },
                            { image: productHeadphones, name: 'Sony WH-1000XM5', category: 'Audio', price: '$280', badge: 'Top Rated', badgeColor: 'bg-green-50 text-green-600', imgClass: '' },
                            { image: productBag, name: 'Premium Leather Bag', category: 'Fashion', price: '$320', badge: 'New', badgeColor: 'bg-[#FAF8F5] text-[#C9A96E]', imgClass: '' },
                            { image: productWatch, name: 'Apple Watch Series 10', category: 'Watches', price: '$399', badge: 'Trending', badgeColor: 'bg-purple-50 text-purple-600', imgClass: '' },
                        ].map((product, i) => (
                            <div
                                key={i}
                                className="group bg-[#FAF8F5] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                {/* Image container */}
                                <div className="relative overflow-hidden aspect-square bg-white">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.imgClass}`}
                                    />
                                    <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${product.badgeColor}`}>
                                        {product.badge}
                                    </div>
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1C1F2E] hover:text-white transition-colors">
                                            <FiHeart className="w-3.5 h-3.5" />
                                        </button>
                                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-[#1C1F2E] hover:text-white transition-colors">
                                            <FiShoppingCart className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Product info */}
                                <div className="p-4">
                                    <p className="text-[#C9A96E] text-xs font-medium mb-1">{product.category}</p>
                                    <h3 className="text-[#1C1F2E] font-semibold text-sm mb-2 leading-tight">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#1C1F2E] font-bold text-lg">{product.price}</p>
                                        <Link
                                            to="/products"
                                            className="text-xs text-[#6B6560] hover:text-[#1C1F2E] flex items-center gap-1 transition-colors"
                                        >
                                            View <FiArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View all button */}
                    <div className="text-center mt-10">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
                        >
                            View All Products <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── WHY SHOP WITH US ─────────────────────────────────── */}
            <section className="py-20 bg-[#FAF8F5]">
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
                      className="bg-white rounded-2xl p-8 border border-[#E8E0D5] hover:shadow-lg hover:border-[#C9A96E]/30 transition-all duration-300 group"
                    >
                      <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {f.icon}
                      </div>
                      <h3 className="text-[#1C1F2E] font-bold text-lg mb-3">{f.title}</h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom stats strip */}
                <div className="bg-[#1C1F2E] rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {[
                    { value: '10K+', label: 'Products Listed' },
                    { value: '500+', label: 'Verified Sellers' },
                    { value: '50K+', label: 'Happy Buyers' },
                    { value: '100%', label: 'Fair Pricing' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-2xl font-bold text-[#C9A96E] mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* ── FOR SELLERS ──────────────────────────────────────── */}
            <section className="py-20 bg-white">
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

                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-colors duration-200"
                    >
                      Become a Seller <FiArrowRight className="w-4 h-4" />
                    </Link>
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
            <section className="py-24 bg-[#FAF8F5]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#1C1F2E] mb-4 leading-tight">
                        Ready to start?
                    </h2>
                    <p className="text-[#6B6560] mb-10 text-lg">
                        Join thousands of buyers and sellers on the fairest marketplace online.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/products"
                            className="flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-8 py-4 rounded-full font-semibold text-sm transition-colors"
                        >
                            Browse Products <FiArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center gap-2 border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#1C1F2E] px-8 py-4 rounded-full font-semibold text-sm transition-colors"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home
