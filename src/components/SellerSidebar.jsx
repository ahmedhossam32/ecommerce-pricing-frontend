import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiPlus, FiTag, FiUser, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const DRAFT_COUNT = 2

const NAV_ITEMS = [
  { to: '/seller/dashboard',    icon: FiGrid,    label: 'Dashboard',       end: true,  badge: null        },
  { to: '/seller/products',     icon: FiPackage, label: 'My Products',     end: false, badge: null        },
  { to: '/seller/products/new', icon: FiPlus,    label: 'List Product',    end: true,  badge: null        },
  { to: '/seller/decisions',    icon: FiTag,     label: 'Decisions',       end: true,  badge: DRAFT_COUNT },
  { to: '/profile',             icon: FiUser,    label: 'Profile',         end: true,  badge: null        },
]

function SellerSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-[180px] bg-[#21253A] border-r border-white/[0.07] flex flex-col sticky top-[88px] h-[calc(100dvh-88px)]">

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4">
      <nav className="">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-[#C9A96E] bg-[#C9A96E]/[0.08]'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A96E] rounded-r-full" />
                )}
                <Icon style={{ width: 18, height: 18 }} className="shrink-0" />
                {label}
                {badge != null && (
                  <span className="bg-[#C9A96E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      </div>

      {/* Bottom: seller info + sign out */}
      <div className="mt-auto border-t border-white/[0.07] p-4">
        <div className="flex items-center gap-3 mb-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-white/40 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors"
        >
          <FiLogOut className="w-3.5 h-3.5 shrink-0" />
          Sign Out
        </button>
      </div>

    </aside>
  )
}

export default SellerSidebar
