import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiClock, FiLayers, FiUser, FiLogOut, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

function AdminSidebar({ pendingCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'A'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const NAV_ITEMS = [
    { to: '/admin/dashboard', icon: FiGrid,    label: 'Dashboard',    end: true,  badge: null                 },
    { to: '/admin/requests',  icon: FiClock,   label: 'Requests',     end: true,  badge: pendingCount || null },
    { to: '/admin/products',  icon: FiLayers,  label: 'All Products', end: true,  badge: null                 },
    { to: '/admin/profile',   icon: FiUser,    label: 'Profile',      end: true,  badge: null                 },
  ]

  return (
    <>
      <style>{`
        @keyframes adminSlideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes adminFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .admin-nav-item { animation: adminSlideInLeft 0.35s ease both; }
        .admin-nav-item:nth-child(1) { animation-delay: 0.05s; }
        .admin-nav-item:nth-child(2) { animation-delay: 0.10s; }
        .admin-nav-item:nth-child(3) { animation-delay: 0.15s; }
        .admin-nav-item:nth-child(4) { animation-delay: 0.20s; }
        .admin-sidebar-footer { animation: adminFadeUp 0.4s ease 0.3s both; }
        .admin-nav-icon { transition: transform 0.2s ease; }
        .admin-sidebar-link:hover .admin-nav-icon { transform: scale(1.15) rotate(-4deg); }
        .active-admin-link .admin-nav-icon { transform: scale(1.1); }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.5); }
          50%       { box-shadow: 0 0 0 4px rgba(201,169,110,0); }
        }
        .badge-pulse { animation: badgePulse 2s ease infinite; }
      `}</style>

      <aside className="w-56 bg-[#21253A] border-r border-white/[0.07] flex flex-col sticky top-[88px] h-[calc(100dvh-88px)] overflow-hidden">

        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A96E]/40 to-transparent" />

        {/* Admin Panel label */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-[#C9A96E]/15 flex items-center justify-center">
              <FiShield size={11} className="text-[#C9A96E]" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A96E]/70">
              Admin Panel
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-white/[0.06] to-transparent mt-2" />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end, badge }) => (
            <div key={to} className="admin-nav-item">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `admin-sidebar-link relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'active-admin-link text-[#C9A96E] bg-[#C9A96E]/[0.10] shadow-[inset_0_1px_0_rgba(201,169,110,0.12)]'
                      : 'text-white/50 hover:text-white/85 hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#C9A96E] rounded-r-full shadow-[0_0_8px_rgba(201,169,110,0.6)]" />
                    )}

                    <div className={`admin-nav-icon w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isActive ? 'bg-[#C9A96E]/20' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                    }`}>
                      <Icon size={15} />
                    </div>

                    <span className="flex-1 leading-none">{label}</span>

                    {badge != null && badge > 0 && (
                      <span className={`badge-pulse inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-all ${
                        isActive ? 'bg-[#C9A96E] text-[#21253A]' : 'bg-[#C9A96E]/80 text-[#21253A]'
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

        {/* Footer: user card + sign out */}
        <div className="admin-sidebar-footer p-4 space-y-2">

          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A96E]/30 to-[#C9A96E]/10 flex items-center justify-center ring-1 ring-[#C9A96E]/30">
                <span className="text-[#C9A96E] text-xs font-bold">{initials}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#21253A]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">{user?.name}</p>
              <p className="text-white/35 text-[10px] truncate leading-tight mt-0.5">{user?.email}</p>
            </div>
          </div>

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

export default AdminSidebar
