import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiPlus, FiTag, FiUser, FiLogOut, FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getSellerProducts } from '../../api/seller'

function SellerSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [draftCount, setDraftCount] = useState(0)
  useEffect(() => {
    getSellerProducts()
      .then(res => {
        const drafts = (res.data || []).filter(p => p.status === 'DRAFT').length
        setDraftCount(drafts)
      })
      .catch(() => {})
  }, [])

  const NAV_ITEMS = [
    { to: '/seller/dashboard', icon: FiGrid, label: 'Dashboard', end: true, badge: null },
    { to: '/seller/products', icon: FiPackage, label: 'My Products', end: false, badge: null },
    { to: '/seller/products/new', icon: FiPlus, label: 'List Product', end: true, badge: null },
    { to: '/seller/decisions', icon: FiTag, label: 'Decisions', end: true, badge: draftCount || null },
    { to: '/seller/profile', icon: FiUser, label: 'Profile', end: true, badge: null },
  ]

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sidebar-nav-item {
          animation: slideInLeft 0.35s ease both;
        }
        .sidebar-nav-item:nth-child(1) { animation-delay: 0.05s; }
        .sidebar-nav-item:nth-child(2) { animation-delay: 0.10s; }
        .sidebar-nav-item:nth-child(3) { animation-delay: 0.15s; }
        .sidebar-nav-item:nth-child(4) { animation-delay: 0.20s; }
        .sidebar-nav-item:nth-child(5) { animation-delay: 0.25s; }
        .sidebar-footer {
          animation: fadeUp 0.4s ease 0.3s both;
        }
        .nav-icon-wrap {
          transition: transform 0.2s ease;
        }
        .sidebar-link:hover .nav-icon-wrap {
          transform: scale(1.15) rotate(-4deg);
        }
        .active-link .nav-icon-wrap {
          transform: scale(1.1);
        }
        /* Shimmer on active badge */
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.5); }
          50%       { box-shadow: 0 0 0 4px rgba(201,169,110,0); }
        }
        .badge-pulse {
          animation: badgePulse 2s ease infinite;
        }
      `}</style>

      <aside className="w-56 bg-[#191D2E] border-r border-white/[0.06] flex flex-col sticky top-[88px] h-[calc(100dvh-88px)] overflow-hidden">

        {/* Subtle top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

        {/* Seller Center label */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-[#C9A96E]/15 flex items-center justify-center">
              <FiTrendingUp size={11} className="text-[#C9A96E]" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A96E]/70">
              Seller Center
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent mt-2" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end, badge }) => (
            <div key={to} className="sidebar-nav-item">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar-link relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                    ? 'active-link text-[#C9A96E] bg-[#C9A96E]/[0.10] shadow-[inset_0_1px_0_rgba(201,169,110,0.12)]'
                    : 'text-white/50 hover:text-white/85 hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active left accent bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#C9A96E] rounded-r-full shadow-[0_0_8px_rgba(201,169,110,0.6)]" />
                    )}

                    {/* Icon container */}
                    <div className={`nav-icon-wrap w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${isActive
                      ? 'bg-[#C9A96E]/20'
                      : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                      }`}>
                      <Icon size={15} />
                    </div>

                    <span className="flex-1 leading-none">{label}</span>

                    {badge != null && (
                      <span className={`badge-pulse inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-all ${isActive
                        ? 'bg-[#C9A96E] text-[#191D2E]'
                        : 'bg-[#C9A96E]/80 text-[#191D2E]'
                        }`}>
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* Bottom: seller info + sign out */}
        <div className="sidebar-footer p-4 space-y-2">

          {/* User card */}
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] min-w-0">
            {/* Avatar with gold ring */}
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A96E]/30 to-[#C9A96E]/10 flex items-center justify-center ring-1 ring-[#C9A96E]/30 overflow-hidden">
                {user?.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} className="w-full h-full object-cover rounded-xl" alt={user?.name} />
                ) : (
                  <span className="text-[#C9A96E] text-xs font-bold">{initials}</span>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#191D2E]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">{user?.name}</p>
              <p className="text-white/35 text-[10px] truncate leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Sign out button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/[0.08] text-xs font-medium transition-all duration-200 group"
          >
            <div className="w-6 h-6 rounded-lg bg-white/[0.04] group-hover:bg-red-500/10 flex items-center justify-center transition-all duration-200">
              <FiLogOut size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
            Sign Out
          </button>
        </div>

      </aside>
    </>
  )
}

export default SellerSidebar