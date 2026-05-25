import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiShoppingCart, FiHeart, FiSearch, FiUser, FiChevronDown, FiLogOut, FiPackage, FiMenu, FiX, FiTrendingUp } from 'react-icons/fi'
import { useState } from 'react'
import AuthModal from './AuthModal'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authOpen, setAuthOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setAccountOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* TOP BAR */}
      <div className="bg-black border-b border-[#2E3452] text-gray-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between">

          {/* Left — tagline */}
          <p className="hidden md:block text-gray-400">
            The first AI-powered dynamic pricing marketplace
          </p>

          {/* Right — actions */}
          <div className="flex items-center gap-5 ml-auto">
            <Link to="/" className="hover:text-white transition-colors">Help & FAQs</Link>

            {/* My Account dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                My Account <FiChevronDown className="w-3 h-3" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E0D5] shadow-lg rounded-xl w-44 py-2 z-50">
                  {!user ? (
                    <>
                      <button
                        onClick={() => { setAccountOpen(false); setAuthOpen(true) }}
                        className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs w-full text-left"
                      >
                        <FiUser className="w-3.5 h-3.5" /> Sign In
                      </button>
                      <button
                        onClick={() => { setAccountOpen(false); setAuthOpen(true) }}
                        className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs w-full text-left"
                      >
                        <FiUser className="w-3.5 h-3.5" /> Create Account
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 border-b border-[#E8E0D5]">
                        <p className="text-[#1C1F2E] text-xs font-medium">{user.name}</p>
                        <p className="text-[#6B6560] text-xs">{user.role}</p>
                      </div>
                      {user.role === 'SELLER' && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs"
                        >
                          Dashboard
                        </Link>
                      )}
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs"
                        >
                          Admin Panel
                        </Link>
                      )}
                      {user.role === 'BUYER' && (
                        <Link
                          to="/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs"
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:text-red-600 hover:bg-[#FAF8F5] transition-colors text-xs w-full text-left"
                      >
                        <FiLogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Language */}
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              EN <FiChevronDown className="w-3 h-3" />
            </button>

            {/* Currency */}
            <button className="flex items-center gap-1 hover:text-white transition-colors">
              USD <FiChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="bg-white border-b border-[#E8E0D5]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#1C1F2E] rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1C1F2E] font-bold text-lg tracking-tight">
              Dyna<span className="text-[#C9A96E]">Mart</span>
            </span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link
              to="/"
              className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
            </Link>

            <Link
              to="/products"
              className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
            </Link>

            {/* Categories dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors">
                Categories <FiChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-3 bg-white border border-[#E8E0D5] shadow-lg rounded-xl w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {['Phones & Tablets', 'Computers', 'Fashion', 'Gaming', 'Home & Living', 'Watches'].map((cat, i) => (
                  <Link
                    key={i}
                    to="/products"
                    className="block px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Seller specific */}
            {user?.role === 'SELLER' && (
              <>
                <Link to="/seller/products" className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group">
                  My Products
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
                </Link>
                <Link to="/seller/products/new" className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group">
                  List Product
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
                </Link>
              </>
            )}

            {/* Admin specific */}
            {user?.role === 'ADMIN' && (
              <Link to="/admin/requests" className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group">
                Requests
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
              </Link>
            )}

            <Link
              to="/"
              className="text-[#1C1F2E] hover:text-[#C9A96E] text-sm font-medium transition-colors relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C9A96E] group-hover:w-full transition-all duration-200" />
            </Link>
          </nav>

          {/* Right icons */}
          <div className="hidden md:flex items-center gap-4">

            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              {searchOpen && (
                <form
                  onSubmit={handleSearch}
                  className="absolute right-0 top-full mt-3 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl shadow-xl flex overflow-hidden z-50"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-[#1C1F2E] text-sm px-4 py-2.5 outline-none w-56 placeholder-[#9E9590]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-4 transition-colors"
                  >
                    <FiSearch className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist — always visible (guest opens auth modal) */}
            {user?.role !== 'SELLER' && user?.role !== 'ADMIN' && (
              user?.role === 'BUYER' ? (
                <Link to="/wishlist" className="relative text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 group/wl">
                  <FiHeart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A96E] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">1</span>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/wl:opacity-100 transition-opacity">Wishlist</span>
                </Link>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="relative text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 group/wl">
                  <FiHeart className="w-5 h-5" />
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/wl:opacity-100 transition-opacity">Wishlist</span>
                </button>
              )
            )}

            {/* Cart — always visible (guest opens auth modal) */}
            {user?.role !== 'SELLER' && user?.role !== 'ADMIN' && (
              user?.role === 'BUYER' ? (
                <Link to="/cart" className="relative text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 group/ct">
                  <FiShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1C1F2E] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">2</span>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ct:opacity-100 transition-opacity">Cart</span>
                </Link>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="relative text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 group/ct">
                  <FiShoppingCart className="w-5 h-5" />
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ct:opacity-100 transition-opacity">Cart</span>
                </button>
              )
            )}

            {/* Orders — buyer only */}
            {user?.role === 'BUYER' && (
              <Link to="/orders" className="text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 group/ord">
                <FiPackage className="w-5 h-5" />
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ord:opacity-100 transition-opacity">Orders</span>
              </Link>
            )}

            {/* Auth buttons — not logged in */}
            {!user && (
              <>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="text-[#6B6560] hover:text-[#1C1F2E] text-sm transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white text-sm px-5 py-2 rounded-full font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[#6B6560] hover:text-[#1C1F2E] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Search bar — full width on mobile */}
        {searchOpen && (
          <div className="md:hidden px-6 pb-3">
            <form onSubmit={handleSearch} className="flex bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl overflow-hidden">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-[#1C1F2E] text-sm px-4 py-2.5 outline-none flex-1 placeholder-[#9E9590]"
              />
              <button type="submit" className="bg-[#1C1F2E] text-white px-4">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E0D5] px-6 py-5 flex flex-col gap-4 text-sm">
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Products</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Categories</Link>
          {user?.role === 'BUYER' && (
            <>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Cart</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Wishlist</Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Orders</Link>
            </>
          )}
          {user?.role === 'SELLER' && (
            <>
              <Link to="/seller/products" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">My Products</Link>
              <Link to="/seller/products/new" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">List Product</Link>
              <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Dashboard</Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin/requests" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Requests</Link>
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="text-[#6B6560] hover:text-[#1C1F2E]">Dashboard</Link>
            </>
          )}
          <div className="pt-3 border-t border-[#E8E0D5] flex gap-4">
            {!user ? (
              <>
                <button onClick={() => { setAuthOpen(true); setMobileOpen(false) }} className="text-[#6B6560] hover:text-[#1C1F2E]">Login</button>
                <button onClick={() => { setAuthOpen(true); setMobileOpen(false) }} className="text-[#C9A96E] font-semibold">Sign Up</button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600">Sign Out</button>
            )}
          </div>
        </div>
      )}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  )
}

export default Navbar
