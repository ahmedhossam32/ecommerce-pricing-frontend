import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { FiShoppingCart, FiHeart, FiUser, FiChevronDown, FiLogOut, FiPackage, FiMenu, FiX, FiTrendingUp } from 'react-icons/fi'
import { useState } from 'react'
import AuthModal from './AuthModal'

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const isOnCart = location.pathname === '/cart'
  const isOnWishlist = location.pathname === '/wishlist'
  const isOnOrders = location.pathname === '/orders'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('login')
  const [authRole, setAuthRole] = useState('BUYER')
  const openAuth = (tab = 'login', role = 'BUYER') => { setAuthTab(tab); setAuthRole(role); setAuthOpen(true) }
  const closeAuth = () => { setAuthOpen(false); setAuthTab('login'); setAuthRole('BUYER') }

  const handleLogout = () => {
    logout()
    navigate('/')
    setAccountOpen(false)
    setAvatarOpen(false)
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
                {user ? user.name.split(' ')[0] : 'My Account'} <FiChevronDown className="w-3 h-3" />
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E0D5] shadow-lg rounded-xl w-44 py-2 z-50">
                  {!user ? (
                    <>
                      <button
                        onClick={() => { setAccountOpen(false); openAuth() }}
                        className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] transition-colors text-xs w-full text-left"
                      >
                        <FiUser className="w-3.5 h-3.5" /> Sign In
                      </button>
                      <button
                        onClick={() => { setAccountOpen(false); openAuth() }}
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

            {/* Wishlist — always visible (guest opens auth modal) */}
            {user?.role !== 'SELLER' && user?.role !== 'ADMIN' && (
              user?.role === 'BUYER' ? (
                <div className="relative group/wl">
                  <Link to="/wishlist" className="p-1 block transition-colors relative">
                    <FiHeart
                      className="w-5 h-5 transition-colors"
                      style={{ color: isOnWishlist ? '#C9A96E' : '#6B6560' }}
                      fill={isOnWishlist ? '#C9A96E' : 'none'}
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C9A96E] text-[#1C1F2E] text-[9px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/wl:opacity-100 transition-opacity">Wishlist</span>
                </div>
              ) : (
                <div className="relative group/wl">
                  <button onClick={() => openAuth('login')} className="text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 block">
                    <FiHeart className="w-5 h-5" />
                  </button>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/wl:opacity-100 transition-opacity">Wishlist</span>
                </div>
              )
            )}

            {/* Cart — always visible (guest opens auth modal) */}
            {user?.role !== 'SELLER' && user?.role !== 'ADMIN' && (
              user?.role === 'BUYER' ? (
                <div className="relative group/ct">
                  <Link to="/cart" className="p-1 block transition-colors relative">
                    <FiShoppingCart
                      className="w-5 h-5 transition-colors"
                      style={{ color: isOnCart ? '#C9A96E' : '#6B6560' }}
                      fill={isOnCart ? '#C9A96E' : 'none'}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1C1F2E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </Link>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ct:opacity-100 transition-opacity">Cart</span>
                </div>
              ) : (
                <div className="relative group/ct">
                  <button onClick={() => openAuth('login')} className="text-[#6B6560] hover:text-[#1C1F2E] transition-colors p-1 block">
                    <FiShoppingCart className="w-5 h-5" />
                  </button>
                  <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ct:opacity-100 transition-opacity">Cart</span>
                </div>
              )
            )}

            {/* Orders — buyer only */}
            {user?.role === 'BUYER' && (
              <div className="relative group/ord">
                <Link to="/orders" className="p-1 block transition-colors">
                  <FiPackage
                    className="w-5 h-5 transition-colors"
                    style={{ color: isOnOrders ? '#C9A96E' : '#6B6560' }}
                    fill={isOnOrders ? '#C9A96E' : 'none'}
                  />
                </Link>
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1F2E] text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover/ord:opacity-100 transition-opacity">Orders</span>
              </div>
            )}

            {/* Auth / Avatar */}
            {!user ? (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="text-[#6B6560] hover:text-[#1C1F2E] text-sm transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('register', 'BUYER')}
                  className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white text-sm px-5 py-2 rounded-full font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setAvatarOpen(true)}
                onMouseLeave={() => setAvatarOpen(false)}
              >
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-[#E8E0D5]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#C9A96E] text-white text-xs font-bold flex items-center justify-center">
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[#1C1F2E]">{user.name.split(' ')[0]}</span>
                  <FiChevronDown className="w-3.5 h-3.5 text-[#6B6560]" />
                </button>
                {avatarOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-[#E8E0D5] border-t-2 border-t-[#C9A96E] shadow-lg rounded-xl w-48 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[#E8E0D5] bg-[#1C1F2E]">
                      <p className="text-white text-xs font-bold">{user.name}</p>
                      <p className="text-white/50 text-xs">{user.email}</p>
                    </div>
                    {user.role === 'BUYER' && (
                      <>
                        <Link to="/cart" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] text-xs transition-all">
                          <FiShoppingCart className="w-3.5 h-3.5" /> My Cart
                        </Link>
                        <Link to="/orders" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] transition-all text-xs">
                          <FiPackage className="w-3.5 h-3.5" /> My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] transition-all text-xs">
                          <FiHeart className="w-3.5 h-3.5" /> Wishlist
                        </Link>
                      </>
                    )}
                    {user.role === 'SELLER' && (
                      <Link to="/seller/dashboard" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] transition-all text-xs">
                        <FiPackage className="w-3.5 h-3.5" /> Dashboard
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link to="/admin/dashboard" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] transition-all text-xs">
                        <FiPackage className="w-3.5 h-3.5" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setAvatarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#6B6560] hover:text-[#1C1F2E] hover:bg-[#FAF8F5] border-l-2 border-l-transparent hover:border-l-[#C9A96E] text-xs transition-all">
                      <FiUser className="w-3.5 h-3.5" /> Profile Settings
                    </Link>
                    <div className="h-px bg-[#C9A96E]/20 mx-3 my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 border-l-2 border-l-transparent hover:border-l-[#C9A96E] transition-all text-xs w-full text-left">
                      <FiLogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
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
                <button onClick={() => { setMobileOpen(false); openAuth('login') }} className="text-[#6B6560] hover:text-[#1C1F2E]">Login</button>
                <button onClick={() => { setMobileOpen(false); openAuth('register', 'BUYER') }} className="text-[#C9A96E] font-semibold">Sign Up</button>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-500 hover:text-red-600">Sign Out</button>
            )}
          </div>
        </div>
      )}
      {authOpen && <AuthModal onClose={closeAuth} initialTab={authTab} initialRole={authRole} />}
    </header>
  )
}

export default Navbar
