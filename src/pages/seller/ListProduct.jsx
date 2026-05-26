import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import {
  FiUpload, FiX, FiZap, FiAlertCircle, FiTrendingUp,
  FiCheckCircle, FiCircle,
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import BackButton from '../../components/BackButton'

const CATEGORIES = [
  { value: 'telephony',                label: 'Phones & Tablets' },
  { value: 'computers',                label: 'Computers' },
  { value: 'computers_accessories',    label: 'Computer Accessories' },
  { value: 'electronics',              label: 'Electronics' },
  { value: 'audio',                    label: 'Audio' },
  { value: 'fashion_bags_accessories', label: 'Fashion Bags & Accessories' },
  { value: 'fashion_shoes',            label: 'Fashion Shoes' },
  { value: 'fashion_male_clothing',    label: "Men's Clothing" },
  { value: 'fashio_female_clothing',   label: "Women's Clothing" },
  { value: 'watches_gifts',            label: 'Watches & Gifts' },
  { value: 'sports_leisure',           label: 'Sports & Leisure' },
  { value: 'health_beauty',            label: 'Health & Beauty' },
  { value: 'toys',                     label: 'Toys' },
  { value: 'books_general_interest',   label: 'Books' },
  { value: 'furniture_bedroom',        label: 'Bedroom Furniture' },
  { value: 'furniture_decor',          label: 'Furniture & Decor' },
  { value: 'home_appliances',          label: 'Home Appliances' },
  { value: 'garden_tools',             label: 'Garden Tools' },
  { value: 'pet_shop',                 label: 'Pet Shop' },
]

const confidenceStyle = {
  HIGH:   'bg-green-50 text-green-600',
  MEDIUM: 'bg-yellow-50 text-yellow-600',
  LOW:    'bg-red-50 text-red-500',
}

const inputCls = 'w-full bg-[#FAF8F5] border border-[#E8E0D5] focus:border-[#1C1F2E] rounded-xl px-4 py-3 text-sm text-[#1C1F2E] focus:outline-none transition-colors'
const inputErrCls = 'w-full bg-[#FAF8F5] border border-red-400 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-[#1C1F2E] focus:outline-none transition-colors'

function ListProduct() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    category: '',
    description: '',
    photosQty: 1,
    freightValue: 0,
    weight: '',
  })
  const [errors, setErrors] = useState({})

  const [images, setImages] = useState([])
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [currentCropSrc, setCurrentCropSrc] = useState(null)
  const [currentCropFile, setCurrentCropFile] = useState(null)
  const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10 })
  const imgRef = useRef(null)
  const fileInputRef = useRef(null)

  const [pricePreview, setPricePreview] = useState(null)
  const [computing, setComputing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    const file = files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setCurrentCropSrc(reader.result)
      setCurrentCropFile(file)
      setCropModalOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropConfirm = () => {
    const newImage = {
      id: Date.now(),
      file: currentCropFile,
      previewUrl: currentCropSrc,
      croppedUrl: currentCropSrc,
    }
    setImages(prev => {
      const updated = [...prev, newImage]
      setForm(f => ({ ...f, photosQty: updated.length }))
      return updated
    })
    setCropModalOpen(false)
    setCurrentCropSrc(null)
    setCurrentCropFile(null)
  }

  const handleRemoveImage = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      setForm(f => ({ ...f, photosQty: Math.max(1, updated.length) }))
      return updated
    })
  }

  const validate = () => {
    const e = {}
    if (!form.category) e.category = 'Category is required'
    if (!form.description || form.description.length < 10) e.description = 'Description must be at least 10 characters'
    if (!form.weight || Number(form.weight) <= 0) e.weight = 'Weight must be a positive number'
    if (Number(form.freightValue) < 0) e.freightValue = 'Shipping cost cannot be negative'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleComputePrice = async () => {
    if (!validate()) return
    setComputing(true)
    await new Promise(r => setTimeout(r, 1500))
    setPricePreview({
      suggestedPrice: 280,
      minRange: 238,
      maxRange: 322,
      confidence: 'HIGH',
      brand: 'Sony',
      mlBaselinePrice: 265,
      marketPriceMin: 220,
      marketPriceMax: 380,
    })
    setComputing(false)
    toast.success('Price computed successfully!')
  }

  const handleSubmit = async () => {
    if (!validate()) return
    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    const dummyProductId = 99
    toast.success('Product listed successfully!')
    navigate(`/seller/products/${dummyProductId}/decision`)
    setSubmitting(false)
  }

  const checks = [
    { done: images.length > 0,           label: `${images.length} image(s) uploaded` },
    { done: !!form.category,             label: 'Category selected' },
    { done: form.description.length >= 10, label: 'Description filled' },
    { done: Number(form.weight) > 0,     label: 'Weight entered' },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── STICKY SELLER TOP BAR ─────────────────────────── */}
      <div className="sticky top-16 z-20 bg-white border-b border-[#E8E0D5]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-[#9E9590] text-xs">
            <Link to="/seller/dashboard" className="hover:text-[#1C1F2E] transition-colors">Dashboard</Link>
            {' / '}
            <Link to="/seller/products" className="hover:text-[#1C1F2E] transition-colors">My Products</Link>
            {' / '}
            <span className="text-[#1C1F2E] font-medium">List New Product</span>
          </span>
          <span className="text-[#9E9590] text-xs font-medium">Step 1 of 1 — Fill Details</span>
        </div>
      </div>

      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton label="Back" />
          <h1 className="text-3xl font-extrabold text-white mt-4">List a New Product</h1>
          <p className="text-[#C9A96E] text-sm mt-2">
            Fill in the details below. Our AI will suggest a fair price instantly.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_320px] gap-8">

          {/* ── LEFT — Image Upload ──────────────────────── */}
          <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6">
            <p className="text-[#1C1F2E] font-bold mb-1">Product Images</p>
            <p className="text-[#9E9590] text-xs mb-4">Up to 5 images. First image is the thumbnail.</p>

            {images.length < 5 && (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E8E0D5] hover:border-[#C9A96E] rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <FiUpload className="w-8 h-8 text-[#C9A96E] mx-auto mb-2" />
                  <p className="text-[#1C1F2E] font-semibold text-sm">Click to upload</p>
                  <p className="text-[#9E9590] text-xs mt-1">JPG, PNG — max 5 images</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {images.map((img, idx) => (
                  <div key={img.id} className="relative rounded-xl overflow-hidden aspect-square bg-[#FAF8F5]">
                    <img src={img.croppedUrl} alt="preview" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#C9A96E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        Thumbnail
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                    >
                      <FiX className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 text-center text-[#9E9590] text-xs">{images.length}/5 images added</p>
          </div>

          {/* ── MIDDLE — Product Details Form ───────────── */}
          <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6">
            <p className="text-[#1C1F2E] font-bold mb-1">Product Details</p>
            <div className="flex items-center gap-1.5 text-[#9E9590] text-xs mb-5">
              <FiAlertCircle className="w-3 h-3 shrink-0" />
              Brand is extracted automatically from your description. Do not add a brand field.
            </div>

            <div className="space-y-5">

              {/* Category */}
              <div>
                <label className="block text-[#1C1F2E] text-xs font-semibold mb-1.5">Category *</label>
                <select
                  value={form.category}
                  onChange={e => handleFieldChange('category', e.target.value)}
                  className={errors.category ? inputErrCls : inputCls}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#1C1F2E] text-xs font-semibold">Description *</label>
                  <span className="text-[#9E9590] text-[10px]">{form.description.length} chars</span>
                </div>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                  placeholder="Describe your product in detail. Include the brand name naturally in your description — our AI will extract it automatically. Example: 'Sony WH-1000XM5 wireless headphones with...'"
                  className={`${errors.description ? inputErrCls : inputCls} resize-none`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-[#1C1F2E] text-xs font-semibold mb-1.5">Weight *</label>
                <p className="text-[#9E9590] text-[10px] mb-1.5">In grams (e.g. 250 for headphones, 4500 for a gaming console)</p>
                <input
                  type="number"
                  min="1"
                  value={form.weight}
                  onChange={e => handleFieldChange('weight', e.target.value)}
                  className={errors.weight ? inputErrCls : inputCls}
                />
                {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
              </div>

              {/* Shipping Cost */}
              <div>
                <label className="block text-[#1C1F2E] text-xs font-semibold mb-1.5">Shipping Cost</label>
                <p className="text-[#9E9590] text-[10px] mb-1.5">Enter 0 for free shipping</p>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.freightValue}
                  onChange={e => handleFieldChange('freightValue', e.target.value)}
                  className={errors.freightValue ? inputErrCls : inputCls}
                />
                {errors.freightValue && <p className="text-red-500 text-xs mt-1">{errors.freightValue}</p>}
              </div>

              {/* Photos Qty (read-only) */}
              <div>
                <label className="block text-[#1C1F2E] text-xs font-semibold mb-1.5">Number of Photos</label>
                <p className="text-[#9E9590] text-[10px] mb-1.5">Auto-updated as you upload images above</p>
                <input
                  type="number"
                  min="1"
                  value={form.photosQty}
                  readOnly
                  className={`${inputCls} opacity-75 cursor-not-allowed`}
                />
              </div>

            </div>
          </div>

          {/* ── RIGHT — Price Preview + Submit ──────────── */}
          <div>

            {/* Card 1 — AI Price Preview */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6 mb-4">
              <div className="flex items-center gap-2">
                <FiZap className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-[#1C1F2E] font-bold">AI Price Preview</span>
              </div>
              <p className="text-[#9E9590] text-xs mt-1 mb-4">
                Test the AI pricing before listing. Fill the form first.
              </p>

              <button
                onClick={handleComputePrice}
                disabled={computing}
                className="w-full bg-[#FAF8F5] hover:bg-[#1C1F2E] text-[#1C1F2E] hover:text-white border border-[#E8E0D5] hover:border-[#1C1F2E] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {computing ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiZap className="w-4 h-4" />
                )}
                Compute Price
              </button>

              {pricePreview && (
                <div className="mt-4 bg-[#FAF8F5] rounded-2xl p-4 border border-[#E8E0D5]">
                  <p className="text-[#9E9590] text-xs">Suggested Price</p>
                  <p className="text-2xl font-extrabold text-[#1C1F2E]">${pricePreview.suggestedPrice}</p>
                  <p className="text-[#6B6560] text-xs mt-1">
                    Range: ${pricePreview.minRange} – ${pricePreview.maxRange}
                  </p>

                  <span className={`mt-2 inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${confidenceStyle[pricePreview.confidence] || confidenceStyle.MEDIUM}`}>
                    {pricePreview.confidence} Confidence
                  </span>

                  <p className="text-[#9E9590] text-xs mt-2 flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3 text-[#C9A96E]" />
                    Brand detected: {pricePreview.brand}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-[#9E9590] text-[10px]">ML Baseline</p>
                      <p className="text-[#1C1F2E] text-xs font-bold">${pricePreview.mlBaselinePrice}</p>
                    </div>
                    <div>
                      <p className="text-[#9E9590] text-[10px]">Market Range</p>
                      <p className="text-[#1C1F2E] text-xs font-bold">${pricePreview.marketPriceMin}–${pricePreview.marketPriceMax}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2 — Submit */}
            <div className="bg-[#1C1F2E] rounded-3xl p-6">
              <p className="text-white font-bold">Ready to List?</p>
              <p className="text-gray-400 text-xs mt-1 mb-5">
                Your product will be reviewed by our AI and priced fairly.
              </p>

              <div className="space-y-2 mb-5">
                {checks.map(({ done, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    {done
                      ? <FiCheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                      : <FiCircle className="w-4 h-4 text-gray-500 shrink-0" />
                    }
                    <span className="text-white/70">{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiZap className="w-4 h-4" />
                )}
                List Product & Get AI Price
              </button>

              <p className="text-gray-500 text-[10px] text-center mt-3">
                By listing, you agree that pricing is AI-verified and subject to admin review if outside bounds.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── CROP MODAL ────────────────────────────────────── */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full">
            <p className="text-[#1C1F2E] font-bold text-lg mb-4">Crop Your Image</p>
            <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={undefined}>
              <img
                ref={imgRef}
                src={currentCropSrc}
                alt="crop"
                className="max-h-[400px] w-full object-contain"
              />
            </ReactCrop>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setCropModalOpen(false)}
                className="flex-1 border border-[#E8E0D5] text-[#6B6560] px-5 py-2.5 rounded-xl text-sm hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 bg-[#1C1F2E] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2E3452] transition-colors"
              >
                Use This Image
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ListProduct
