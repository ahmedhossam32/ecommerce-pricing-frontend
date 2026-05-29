import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FiTrendingUp } from 'react-icons/fi'
import { login as loginApi, register as registerApi } from '../api/auth'
import { uploadProfilePicture } from '../api/user'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { FiCamera } from 'react-icons/fi'

function AuthModal({ onClose, initialTab = 'login', initialRole = 'BUYER' }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: '', role: initialRole
  })

  const [registerStep, setRegisterStep] = useState(1)
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10, aspect: 1 })
  const [completedCrop, setCompletedCrop] = useState(null)
  const [croppedPreview, setCroppedPreview] = useState(null)
  const [croppedBlob, setCroppedBlob] = useState(null)
  const imgRef = useRef(null)

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const validateLogin = () => {
    const e = {}
    if (!loginForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = 'Enter a valid email'
    if (!loginForm.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateRegister = () => {
    const e = {}
    if (!registerForm.name) e.name = 'Name is required'
    else if (registerForm.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!registerForm.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) e.email = 'Enter a valid email'
    if (!registerForm.password) e.password = 'Password is required'
    else if (registerForm.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    setLoading(true)
    try {
      const res = await loginApi({ email: loginForm.email, password: loginForm.password })
      const { accessToken, name, email, role, profilePictureUrl } = res.data
      login({ name, email, role, profilePictureUrl }, accessToken)
      toast.success(`Welcome back, ${name}!`)
      onClose()
      if (role === 'SELLER') navigate('/seller/dashboard')
      else if (role === 'ADMIN') navigate('/admin/dashboard')
      else if (role === 'BUYER') {
        if (window.location.pathname === '/') navigate('/products')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateRegister()) return
    setRegisterStep(2)
  }

  const handleCropConfirm = () => {
    if (!imgRef.current || !completedCrop) return
    const canvas = document.createElement('canvas')
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = 600
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      600,
      600
    )
    canvas.toBlob((blob) => {
      setCroppedBlob(blob)
      setCroppedPreview(URL.createObjectURL(blob))
      setImgSrc('')
    }, 'image/jpeg', 1.0)
  }

  const handleFinishRegister = async () => {
    setLoading(true)
    try {
      const res = await registerApi(registerForm)
      const { accessToken, name, email, role, profilePictureUrl } = res.data
      login({ name, email, role, profilePictureUrl }, accessToken)
      if (croppedBlob) {
        const uploadRes = await uploadProfilePicture(croppedBlob)
        const newUrl = uploadRes.data
        login({ name, email, role, profilePictureUrl: newUrl }, accessToken)
      }
      toast.success('Account created! Welcome to DynaMart 🎉')
      onClose()
      if (role === 'SELLER') navigate('/seller/dashboard')
      else if (role === 'ADMIN') navigate('/admin/dashboard')
      else navigate('/products')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const ErrorMsg = ({ field }) => errors[field] ? (
    <p className="text-red-400 text-xs mt-1 flex items-center gap-1 pl-1">
      <FiAlertCircle className="w-3 h-3 shrink-0" /> {errors[field]}
    </p>
  ) : null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-[#FAF8F5] hover:bg-[#E8E0D5] rounded-full flex items-center justify-center transition-colors z-10"
        >
          <FiX className="w-4 h-4 text-[#6B6560]" />
        </button>

        {/* Logo */}
        <div className="pt-8 pb-2 text-center">
          <div className="w-10 h-10 bg-[#1C1F2E] rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiTrendingUp className="w-5 h-5 text-[#C9A96E]" />
          </div>
          <h2 className="text-xl font-bold text-[#1C1F2E]">
            Dyna<span className="text-[#C9A96E]">Mart</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8E0D5] mx-6 mt-4">
          <button
            onClick={() => { setTab('login'); setErrors({}); setRegisterStep(1); setImgSrc(''); setCroppedPreview(null); setCroppedBlob(null) }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
              tab === 'login' ? 'text-[#1C1F2E]' : 'text-[#6B6560] hover:text-[#1C1F2E]'
            }`}
          >
            Sign In
            {tab === 'login' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A96E] rounded-full" />}
          </button>
          <button
            onClick={() => { setTab('register'); setErrors({}); setRegisterStep(1); setImgSrc(''); setCroppedPreview(null); setCroppedBlob(null) }}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
              tab === 'register' ? 'text-[#1C1F2E]' : 'text-[#6B6560] hover:text-[#1C1F2E]'
            }`}
          >
            Sign Up
            {tab === 'register' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A96E] rounded-full" />}
          </button>
        </div>

        <div className="p-6">

          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <p className="text-[#6B6560] text-sm text-center mb-4">
                Welcome back! Sign in to your account.
              </p>

              <div>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590]" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={e => { setLoginForm({ ...loginForm, email: e.target.value }); setErrors(prev => ({ ...prev, email: '' })) }}
                    placeholder="Email address"
                    className={`w-full bg-[#FAF8F5] border rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#1C1F2E]'}`}
                  />
                </div>
                <ErrorMsg field="email" />
              </div>

              <div>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={e => { setLoginForm({ ...loginForm, password: e.target.value }); setErrors(prev => ({ ...prev, password: '' })) }}
                    placeholder="Password"
                    className={`w-full bg-[#FAF8F5] border rounded-xl pl-10 pr-10 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#1C1F2E]'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9590] hover:text-[#6B6560]"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <ErrorMsg field="password" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C1F2E] hover:bg-[#2E3452] text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : 'Sign In'}
              </button>

              <p className="text-center text-sm text-[#6B6560]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); setErrors({}) }}
                  className="text-[#C9A96E] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>

              <div className="flex items-center justify-center gap-6 pt-4 mt-2 border-t border-[#E8E0D5]">
                {['Free to join', 'AI-verified prices', 'No hidden fees'].map(t => (
                  <span key={t} className="text-[10px] text-[#9CA3AF] flex items-center gap-1">
                    <span className="w-1 h-1 bg-[#C9A96E] rounded-full" />{t}
                  </span>
                ))}
              </div>
            </form>
          )}

          {/* REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              {registerStep === 1 && (
                <>
                  <p className="text-[#6B6560] text-sm text-center mb-2">
                    Create your DynaMart account.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {['BUYER', 'SELLER'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegisterForm({ ...registerForm, role: r })}
                        className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          registerForm.role === r
                            ? 'bg-[#1C1F2E] text-white border-[#1C1F2E]'
                            : 'bg-white text-[#6B6560] border-[#E8E0D5] hover:border-[#1C1F2E]'
                        }`}
                      >
                        {r === 'BUYER' ? 'Buyer' : 'Seller'}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590]" />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={e => { setRegisterForm({ ...registerForm, name: e.target.value }); setErrors(prev => ({ ...prev, name: '' })) }}
                        placeholder="Full name"
                        className={`w-full bg-[#FAF8F5] border rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors ${errors.name ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#1C1F2E]'}`}
                      />
                    </div>
                    <ErrorMsg field="name" />
                  </div>

                  <div>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590]" />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={e => { setRegisterForm({ ...registerForm, email: e.target.value }); setErrors(prev => ({ ...prev, email: '' })) }}
                        placeholder="Email address"
                        className={`w-full bg-[#FAF8F5] border rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors ${errors.email ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#1C1F2E]'}`}
                      />
                    </div>
                    <ErrorMsg field="email" />
                  </div>

                  <div>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9590]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.password}
                        onChange={e => { setRegisterForm({ ...registerForm, password: e.target.value }); setErrors(prev => ({ ...prev, password: '' })) }}
                        placeholder="Password (min 6 characters)"
                        className={`w-full bg-[#FAF8F5] border rounded-xl pl-10 pr-10 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors ${errors.password ? 'border-red-400' : 'border-[#E8E0D5] focus:border-[#1C1F2E]'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9E9590] hover:text-[#6B6560]"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    <ErrorMsg field="password" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C1F2E] hover:bg-[#2E3452] text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : 'Create Account'}
                  </button>

                  <p className="text-center text-sm text-[#6B6560]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setTab('login'); setErrors({}) }}
                      className="text-[#C9A96E] font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                </>
              )}

              {registerStep === 2 && (
                <div className="space-y-5">
                  {/* Step indicator */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#C9A96E]/30 text-[#C9A96E] text-xs font-bold flex items-center justify-center">✓</div>
                      <span className="text-xs text-[#9CA3AF]">Account Info</span>
                    </div>
                    <div className="w-8 h-px bg-[#E8E0D5]" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1C1F2E] text-white text-xs font-bold flex items-center justify-center">2</div>
                      <span className="text-xs text-[#1C1F2E] font-semibold">Profile Photo</span>
                    </div>
                  </div>

                  <p className="text-[#6B6560] text-sm text-center">Add a profile photo (optional)</p>

                  {!imgSrc && !croppedPreview && (
                    <div className="flex flex-col items-center gap-3">
                      <label className="w-36 h-36 rounded-full border-2 border-dashed border-[#E8E0D5] hover:border-[#C9A96E] bg-[#FAF8F5] flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        <FiCamera className="w-10 h-10 text-[#9CA3AF] group-hover:text-[#C9A96E] transition-colors" />
                        <span className="text-xs text-[#9CA3AF] mt-1">Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onload = () => setImgSrc(reader.result)
                            reader.readAsDataURL(file)
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {imgSrc && (
                    <div className="space-y-3">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        circularCrop
                        aspect={1}
                        className="rounded-xl overflow-hidden max-h-56 w-full object-contain"
                      >
                        <img
                          ref={imgRef}
                          src={imgSrc}
                          alt="crop"
                          className="max-h-56 w-full object-contain"
                        />
                      </ReactCrop>
                      <button
                        type="button"
                        onClick={handleCropConfirm}
                        className="w-full bg-[#1C1F2E] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2E3452] transition-colors"
                      >
                        Confirm Crop
                      </button>
                    </div>
                  )}

                  {croppedPreview && !imgSrc && (
                    <div className="flex flex-col items-center gap-3">
                      <img src={croppedPreview} alt="preview" className="w-36 h-36 rounded-full object-cover border-4 border-[#C9A96E]/30" />
                      <button
                        type="button"
                        onClick={() => { setCroppedPreview(null); setCroppedBlob(null) }}
                        className="text-xs text-[#6B6560] hover:text-[#1C1F2E] underline"
                      >
                        Change photo
                      </button>
                    </div>
                  )}

                  {!imgSrc && (
                    <button
                      type="button"
                      onClick={handleFinishRegister}
                      disabled={loading}
                      className="w-full bg-[#1C1F2E] hover:bg-[#2E3452] text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : croppedPreview ? 'Create Account' : 'Skip & Create Account'}
                    </button>
                  )}

                  {!imgSrc && (
                    <p className="text-center text-xs text-[#9CA3AF]">
                      <button type="button" onClick={() => setRegisterStep(1)} className="hover:text-[#1C1F2E] underline">
                        ← Back to account info
                      </button>
                    </p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
