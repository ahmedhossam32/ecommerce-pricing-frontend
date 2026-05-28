import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiCamera, FiUpload, FiLock, FiShoppingBag, FiShoppingCart, FiHeart, FiTrendingUp, FiPackage, FiTag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

const roleBadge = {
  BUYER:  'bg-[#1C1F2E]/10 text-[#1C1F2E] border border-[#1C1F2E]/20',
  SELLER: 'bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/30',
  ADMIN:  'bg-[#1C1F2E]/10 text-[#1C1F2E] border border-[#1C1F2E]/20',
}

function Profile() {
  const { user, login } = useAuth()

  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSavePhoto = async () => {
    if (!selectedFile) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 800))
    // TODO: replace with real API call
    // POST /api/user/profile-picture — multipart file, key=file
    // Returns plain string URL (not JSON)
    // const formData = new FormData()
    // formData.append('file', selectedFile)
    // const url = await uploadProfilePicture(formData)
    // login({ ...user, profilePicture: url }, token)
    toast.success('Profile picture updated! (dummy)')
    setUploading(false)
    setSelectedFile(null)
    setPreview(null)
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <style>{`
        @keyframes profileFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-left  { animation: profileFadeUp 0.35s ease 0.05s both; }
        .profile-right { animation: profileFadeUp 0.35s ease 0.15s both; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-5">
            {user?.role === 'SELLER' && (
              <Link to="/seller/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            )}
            {user?.role === 'BUYER' && (
              <Link to="/" className="hover:text-white/70 transition-colors">Home</Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            )}
            <span>/</span>
            <span className="text-white/70 font-semibold">My Profile</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* ── LEFT — Profile card ───────────────────────────── */}
          <div className="sticky top-24 self-start profile-left">
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6 text-center">

              {/* Avatar with hover-overlay camera */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#C9A96E]/60 bg-[#1C1F2E] flex items-center justify-center mx-auto">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  <FiCamera className="text-white" size={20} />
                </label>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              {/* Save / Cancel when preview is active */}
              {preview && (
                <div className="flex gap-2 mt-3 justify-center">
                  <button
                    onClick={handleSavePhoto}
                    disabled={uploading}
                    className="flex items-center gap-1.5 bg-[#C9A96E] hover:bg-[#b8935a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    {uploading
                      ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <FiUpload size={12} />
                    }
                    {uploading ? 'Saving...' : 'Save Photo'}
                  </button>
                  <button
                    onClick={() => { setPreview(null); setSelectedFile(null) }}
                    className="text-xs text-[#6B6560] border border-[#E8E0D5] px-4 py-2 rounded-xl hover:border-[#1C1F2E] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* User info */}
              <p className="text-[#1C1F2E] font-bold text-lg mt-2">{user?.name}</p>
              <p className="text-[#6B6560] text-sm mt-0.5">{user?.email}</p>
              {user?.role && (
                <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${roleBadge[user.role] || roleBadge.BUYER}`}>
                  {user.role}
                </span>
              )}

              {/* Quick links */}
              <div className="border-t border-[#E8E0D5] mt-5 pt-5 space-y-1 text-left">
                {user?.role === 'BUYER' && (
                  <>
                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiShoppingBag className="w-4 h-4 shrink-0" /> My Orders
                    </Link>
                    <Link to="/cart" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiShoppingCart className="w-4 h-4 shrink-0" /> My Cart
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiHeart className="w-4 h-4 shrink-0" /> Wishlist
                    </Link>
                  </>
                )}
                {user?.role === 'SELLER' && (
                  <>
                    <Link to="/seller/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiTrendingUp className="w-4 h-4 shrink-0" /> Dashboard
                    </Link>
                    <Link to="/seller/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiPackage className="w-4 h-4 shrink-0" /> My Products
                    </Link>
                    <Link to="/seller/decisions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] hover:translate-x-1 transition-all duration-200">
                      <FiTag className="w-4 h-4 shrink-0" /> Price Decisions
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Sections ──────────────────────────────── */}
          <div className="profile-right">

            {/* Section 1 — Account Information */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <FiUser className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-[#1C1F2E] font-bold">Account Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',     value: user?.name },
                  { label: 'Email Address', value: user?.email },
                  { label: 'Account Type',  value: user?.role },
                  { label: 'Member Since',  value: 'May 2026' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[#9E9590] text-xs font-medium mb-1.5">{label}</p>
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1C1F2E] font-medium flex items-center justify-between">
                      <span>{value || '—'}</span>
                      <span className="text-[#9E9590] text-[10px] bg-white border border-[#E8E0D5] px-2 py-0.5 rounded-full shrink-0 ml-2">
                        Read only
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 — Account Security */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <FiLock className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-[#1C1F2E] font-bold">Account Security</span>
              </div>

              <div className="py-3">
                <p className="text-[#1C1F2E] text-sm font-medium">Password</p>
                <p className="text-[#9E9590] text-xs mt-0.5">••••••••</p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-4 mt-3">
                <p className="text-[#9CA3AF] text-xs">
                  Password changes are not yet supported in this version. Contact support if you need to reset your password.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
