import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiCamera, FiUpload, FiLock, FiShoppingBag, FiShoppingCart, FiHeart, FiTrendingUp, FiPackage, FiTag } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'

const roleBadge = {
  BUYER:  'bg-green-50 text-green-600',
  SELLER: 'bg-blue-50 text-blue-600',
  ADMIN:  'bg-purple-50 text-purple-600',
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

      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <BackButton label="Back" />
          <h1 className="text-3xl font-extrabold text-white mt-4">My Profile</h1>
          <p className="text-[#C9A96E] text-sm mt-1">Manage your account information</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* ── LEFT — Profile card ───────────────────────────── */}
          <div className="sticky top-24 self-start">
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6 text-center">

              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#E8E0D5] bg-[#1C1F2E] flex items-center justify-center mx-auto">
                  {user?.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  )}
                </div>
              </div>

              <label
                htmlFor="avatar-upload"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#6B6560] hover:text-[#1C1F2E] border border-[#E8E0D5] hover:border-[#1C1F2E] px-3 py-1.5 rounded-full cursor-pointer transition-all font-medium"
              >
                <FiCamera className="w-3.5 h-3.5" />
                Change Photo
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

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
                    <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiShoppingBag className="w-4 h-4 shrink-0" /> My Orders
                    </Link>
                    <Link to="/cart" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiShoppingCart className="w-4 h-4 shrink-0" /> My Cart
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiHeart className="w-4 h-4 shrink-0" /> Wishlist
                    </Link>
                  </>
                )}
                {user?.role === 'SELLER' && (
                  <>
                    <Link to="/seller/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiTrendingUp className="w-4 h-4 shrink-0" /> Dashboard
                    </Link>
                    <Link to="/seller/products" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiPackage className="w-4 h-4 shrink-0" /> My Products
                    </Link>
                    <Link to="/seller/decisions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#6B6560] hover:bg-[#FAF8F5] hover:text-[#1C1F2E] transition-colors">
                      <FiTag className="w-4 h-4 shrink-0" /> Price Decisions
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT — Sections ──────────────────────────────── */}
          <div>

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

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[#1C1F2E] text-sm font-medium">Password</p>
                  <p className="text-[#9E9590] text-xs mt-0.5">••••••••</p>
                </div>
                <button
                  onClick={() => toast.info('Password change coming soon!')}
                  className="text-xs text-[#6B6560] border border-[#E8E0D5] px-3 py-1.5 rounded-full hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-all"
                >
                  Change Password
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
