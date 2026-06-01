import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiUpload, FiX, FiZap, FiCheckCircle, FiCircle, FiMessageSquare,
  FiTrendingUp, FiClock, FiAlertCircle, FiPackage, FiTruck,
  FiArrowLeft, FiArrowRight, FiCheck, FiImage, FiTag,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { listProduct, previewPrice, acceptPrice, disputePrice } from '../../api/seller'
import api from '../../api/axiosInstance'
import Cropper from 'react-easy-crop'

const CATEGORIES = [
  { value: 'telephony',                label: 'Phones & Tablets' },
  { value: 'computers',                label: 'Computers' },
  { value: 'computers_accessories',    label: 'Computer Accessories' },
  { value: 'electronics',              label: 'Electronics' },
  { value: 'audio',                    label: 'Audio' },
  { value: 'fashion_bags_accessories', label: 'Bags & Accessories' },
  { value: 'fashion_shoes',            label: 'Shoes' },
  { value: 'fashion_male_clothing',    label: "Men's Clothing" },
  { value: 'fashio_female_clothing',   label: "Women's Clothing" },
  { value: 'watches_gifts',            label: 'Watches & Gifts' },
  { value: 'sports_leisure',           label: 'Sports & Leisure' },
  { value: 'health_beauty',            label: 'Health & Beauty' },
  { value: 'toys',                     label: 'Toys' },
  { value: 'books_general_interest',   label: 'Books' },
  { value: 'furniture_bedroom',        label: 'Bedroom Furniture' },
  { value: 'furniture_decor',          label: 'Home Decor' },
  { value: 'home_appliances',          label: 'Home Appliances' },
  { value: 'garden_tools',             label: 'Garden Tools' },
  { value: 'pet_shop',                 label: 'Pet Shop' },
]


function ListProduct() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)

  const [form, setForm] = useState({
    name: '', category: '', description: '',
    weight: '', freightValue: '',
    condition: '', conditionGrade: '', conditionNotes: '',
  })
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [pricingResult, setPricingResult] = useState(null)
  const [computeResult, setComputeResult] = useState(null)
  const [acceptMode, setAcceptMode] = useState(false)
  const [chosenPrice, setChosenPrice] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [disputeModalOpen, setDisputeModalOpen] = useState(false)
  const [disputeForm, setDisputeForm] = useState({ sellerPrice: '', sellerReasoning: '' })
  const [disputeSubmitted, setDisputeSubmitted] = useState(false)
  const [disputeLoading, setDisputeLoading] = useState(false)
  const [disputePriceError, setDisputePriceError] = useState('')

  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [currentCropFile, setCurrentCropFile] = useState(null)
  const [currentCropUrl, setCurrentCropUrl] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const step2Checks = [
    { label: 'Name entered',       done: form.name.length >= 2 },
    { label: 'Category selected',  done: form.category !== '' },
    { label: 'Description filled', done: form.description.length >= 10 },
  ]
  const step3Checks = [
    { label: 'Condition selected',    done: form.condition !== '' },
    { label: 'Condition grade',       done: form.condition !== 'USED' || form.conditionGrade !== '' },
    { label: 'Weight entered',        done: form.weight !== '' && Number(form.weight) > 0 },
    { label: 'Freight value entered', done: form.freightValue !== '' && Number(form.freightValue) >= 0 },
  ]
  const step2Done = step2Checks.every(c => c.done)
  const step3Done = step3Checks.every(c => c.done)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setComputeResult(null)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed'); return
    }
    const file = files[0]
    setCurrentCropFile(file)
    setCurrentCropUrl(URL.createObjectURL(file))
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCropModalOpen(true)
  }

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImageBitmap(await fetch(imageSrc).then(r => r.blob()))
    const canvas = document.createElement('canvas')
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))
  }

  const handleCropConfirm = async () => {
    const blob = await getCroppedImg(currentCropUrl, croppedAreaPixels)
    const croppedFile = new File([blob], currentCropFile.name, { type: 'image/jpeg' })
    setImages(prev => [...prev, croppedFile])
    setCropModalOpen(false)
    URL.revokeObjectURL(currentCropUrl)
    setCurrentCropUrl(null)
  }

  const handleComputePrice = async () => {
    if (!step2Done) { toast.error('Fill all fields first to compute price'); return }
    setLoading(true)
    try {
      const res = await previewPrice({
        name: form.name,
        category: form.category,
        description: form.description,
        weight: parseFloat(form.weight),
        freightValue: parseFloat(form.freightValue),
        photosQty: images.length || 1,
        condition: form.condition,
        conditionGrade: form.conditionGrade,
        conditionNotes: form.conditionNotes,
      })
      setComputeResult(res.data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to get price preview')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!step3Done) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    try {
      const res = await listProduct({
        name: form.name,
        category: form.category,
        description: form.description,
        weight: parseFloat(form.weight),
        freightValue: parseFloat(form.freightValue),
        photosQty: images.length || 1,
        condition: form.condition,
        conditionGrade: form.conditionGrade,
        conditionNotes: form.conditionNotes,
      })
      const result = res.data
      if (images.length > 0) {
        const formData = new FormData()
        images.forEach(file => formData.append('files', file))
        await api.post(`/products/${result.productId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      setPricingResult(result)
      setCurrentStep(4)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to list product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Dark header */}
      <div className="bg-[#1C1F2E] py-10 px-8">
        <nav className="flex items-center gap-2 text-xs text-white/40 mb-5">
          <Link to="/seller/dashboard" className="hover:text-white/60 transition-colors">Seller Center</Link>
          <span>/</span>
          <Link to="/seller/products" className="hover:text-white/60 transition-colors">My Products</Link>
          <span>/</span>
          <span className="text-white/70 font-semibold">List New Product</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-white">List a New Product</h1>
        <p className="text-[#9CA3AF] text-sm mt-2">Fill in the details — our AI will suggest a fair price automatically.</p>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { num: 1, label: 'Product Images' },
            { num: 2, label: 'Product Details' },
            { num: 3, label: 'Condition & Ship' },
            { num: 4, label: 'AI Pricing' },
          ].map(({ num, label }, idx) => (
            <div key={num} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep > num
                    ? 'bg-green-500 text-white'
                    : currentStep === num
                    ? 'bg-[#C9A96E] text-white shadow-[0_0_0_4px_rgba(201,169,110,0.2)]'
                    : 'bg-white border-2 border-[#E8E0D5] text-[#9CA3AF]'
                }`}>
                  {currentStep > num ? <FiCheck size={16} /> : num}
                </div>
                <span className={`text-[10px] font-semibold whitespace-nowrap ${
                  currentStep === num ? 'text-[#C9A96E]' : 'text-[#9CA3AF]'
                }`}>
                  {label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-[2px] mx-2 mb-5 rounded-full transition-all duration-500 ${
                  currentStep > num ? 'bg-green-400' : 'bg-[#E8E0D5]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Product Images ── */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center">
                <FiImage className="text-[#C9A96E]" size={20} />
              </div>
              <div>
                <h2 className="text-[#1C1F2E] font-bold text-lg">Product Images</h2>
                <p className="text-[#9CA3AF] text-xs">Upload up to 5 photos. First image is the thumbnail.</p>
              </div>
            </div>

            {/* Upload zone */}
            <label className="block cursor-pointer mb-6">
              <div className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 transition-all duration-200 ${
                images.length >= 5
                  ? 'border-[#E8E0D5] bg-[#FAF8F5] cursor-not-allowed opacity-50'
                  : 'border-[#E8E0D5] hover:border-[#C9A96E] bg-[#FAF8F5] hover:bg-[#FDF6EC] group'
              }`}>
                <div className="w-14 h-14 bg-[#C9A96E]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors">
                  <FiUpload className="text-[#C9A96E]" size={24} />
                </div>
                <div className="text-center">
                  <p className="text-[#1C1F2E] font-bold text-base">Click to upload photos</p>
                  <p className="text-[#9CA3AF] text-sm mt-1">JPG, PNG — max 5 images</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  images.length >= 1 ? 'bg-green-50 text-green-600' : 'bg-[#F0EDE8] text-[#9CA3AF]'
                }`}>
                  {images.length} / 5 uploaded
                </span>
              </div>
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={handleImageUpload} disabled={images.length >= 5} />
            </label>

            {/* 5-slot image grid */}
            <div className="grid grid-cols-5 gap-3 mb-6">
              {Array.from({ length: 5 }).map((_, idx) => {
                const file = images[idx]
                return (
                  <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    file ? 'border-[#C9A96E]/40 shadow-sm' : 'border-dashed border-[#E8E0D5] bg-[#FAF8F5]'
                  }`}>
                    {file ? (
                      <>
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-[#C9A96E] text-white text-[9px] font-bold py-0.5 text-center">
                            THUMBNAIL
                          </span>
                        )}
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                        >
                          <FiX size={10} className="text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#E8E0D5] text-xs font-medium">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Info note */}
            <div className="bg-[#FAF0E0] border border-[#E8D5A3] rounded-xl p-3 flex items-start gap-2 mb-6">
              <FiAlertCircle className="text-[#C9A96E] shrink-0 mt-0.5" size={14} />
              <p className="text-[#92601A] text-xs leading-relaxed">
                Images are uploaded when you list the product. Products without images will not be accepted.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
              <p className="text-xs text-[#9CA3AF]">
                {images.length === 0
                  ? 'At least 1 image recommended'
                  : `${images.length} image${images.length > 1 ? 's' : ''} ready`}
              </p>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                Continue <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Product Details ── */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center">
                <FiPackage className="text-[#C9A96E]" size={20} />
              </div>
              <div>
                <h2 className="text-[#1C1F2E] font-bold text-lg">Product Details</h2>
                <p className="text-[#9CA3AF] text-xs">Tell us about your product — AI extracts the brand automatically.</p>
              </div>
            </div>

            {/* AI brand note */}
            <div className="bg-[#FAF0E0] border border-[#E8D5A3] rounded-xl p-3 flex items-start gap-2 mb-6">
              <FiZap className="text-[#C9A96E] shrink-0 mt-0.5" size={14} />
              <p className="text-[#92601A] text-xs leading-relaxed">
                <span className="font-bold">Brand is extracted automatically</span> from your description — mention the brand name naturally (e.g. "Sony WH-1000XM5") for a more accurate price suggestion.
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-white border border-[#E8E0D5] rounded-xl p-5 space-y-4 mb-4">
              <h3 className="text-[#1C1F2E] font-bold text-sm flex items-center gap-2">
                <FiPackage className="w-4 h-4 text-[#C9A96E]" /> Product Info
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#6B6560] mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B6560] mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category" value={form.category} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#6B6560]">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-[#9CA3AF]">{form.description.length} chars</span>
                </div>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your product in detail. Include the brand name — AI extracts it automatically."
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none overflow-y-auto h-24"
                />
              </div>
            </div>

            {/* Progress checklist */}
            <div className="grid grid-cols-2 gap-2 my-6 p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E0D5]">
              {step2Checks.map(({ label, done }) => (
                <div key={label} className={`flex items-center gap-2 text-xs ${done ? 'text-green-600' : 'text-[#9CA3AF]'}`}>
                  {done
                    ? <FiCheckCircle size={12} className="text-green-500 shrink-0" />
                    : <FiCircle size={12} className="shrink-0" />
                  }
                  {label}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                <FiArrowLeft size={15} /> Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!step2Done}
                className="flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                Continue <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Condition & Ship ── */}
        {currentStep === 3 && (
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center">
                <FiTag className="text-[#C9A96E]" size={20} />
              </div>
              <div>
                <h2 className="text-[#1C1F2E] font-bold text-lg">Condition & Shipping</h2>
                <p className="text-[#9CA3AF] text-xs">Tell us the product condition and shipping details.</p>
              </div>
            </div>

            {/* Section 1 — Product Condition */}
            <div className="bg-white border border-[#E8E0D5] rounded-xl p-5 space-y-4 mb-4">
              <h3 className="text-[#1C1F2E] font-bold text-sm flex items-center gap-2">
                <FiTag className="w-4 h-4 text-[#C9A96E]" /> Product Condition
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#6B6560] mb-2">
                  Product Condition <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { value: 'NEW',         label: 'New' },
                    { value: 'USED',        label: 'Used' },
                    { value: 'REFURBISHED', label: 'Refurbished' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, condition: value, conditionGrade: '', conditionNotes: '' }))}
                      className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                        form.condition === value
                          ? 'bg-[#1C1F2E] text-white border-[#1C1F2E]'
                          : 'bg-white text-[#6B6560] border-[#E8E0D5] hover:border-[#1C1F2E]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.condition === 'NEW' && (
                  <p className="text-[#9CA3AF] text-xs mt-2">Brand new, sealed or never used</p>
                )}
                {form.condition === 'USED' && (
                  <>
                    <p className="text-[#9CA3AF] text-xs mt-2">Previously owned, may show signs of wear</p>
                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-[#6B6560] mb-2">
                        Condition Grade <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[
                          { value: 'MINOR', label: 'Minor Wear',   desc: 'Light scratches, fully functional' },
                          { value: 'HEAVY', label: 'Heavy Damage', desc: 'Cracks, broken parts, faults' },
                        ].map(({ value, label, desc }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, conditionGrade: value }))}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                              form.conditionGrade === value
                                ? 'bg-[#1C1F2E] text-white border-[#1C1F2E]'
                                : 'bg-white text-[#6B6560] border-[#E8E0D5] hover:border-[#1C1F2E]'
                            }`}
                          >
                            <p className="font-semibold text-sm">{label}</p>
                            <p className={`text-[10px] mt-0.5 ${
                              form.conditionGrade === value ? 'text-white/60' : 'text-[#9CA3AF]'
                            }`}>
                              {desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {form.condition === 'REFURBISHED' && (
                  <p className="text-[#9CA3AF] text-xs mt-2">Restored to working condition</p>
                )}
              </div>
              {(form.condition === 'USED' || form.condition === 'REFURBISHED') && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#6B6560]">
                      Condition Notes <span className="text-[#9CA3AF] font-normal">(optional)</span>
                    </label>
                    <span className="text-[10px] text-[#9CA3AF]">{form.conditionNotes.length} / 100</span>
                  </div>
                  <textarea
                    name="conditionNotes"
                    value={form.conditionNotes}
                    onChange={handleChange}
                    placeholder="e.g. minor scratches on back, screen is perfect, includes original box"
                    maxLength={100}
                    className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors resize-none h-20"
                  />
                  <p className="text-[10px] text-[#9CA3AF] mt-1">Helps the AI price your product more accurately</p>
                </div>
              )}
            </div>

            {/* Section 2 — Shipping Details */}
            <div className="bg-white border border-[#E8E0D5] rounded-xl p-5 space-y-4 mb-6">
              <h3 className="text-[#1C1F2E] font-bold text-sm flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-[#C9A96E]" /> Shipping Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B6560] mb-1.5">
                    Weight (g) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" name="weight" value={form.weight} onChange={handleChange}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                  <p className="text-[10px] text-[#9CA3AF] mt-1">Approximate weight in grams. Check the box or product manual.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6560] mb-1.5">
                    Shipping Cost <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number" name="freightValue" value={form.freightValue} onChange={handleChange}
                    placeholder="0 = free"
                    className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-[#FAF8F5] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Progress checklist */}
            <div className="grid grid-cols-2 gap-2 my-6 p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E0D5]">
              {step3Checks.map(({ label, done }) => (
                <div key={label} className={`flex items-center gap-2 text-xs ${done ? 'text-green-600' : 'text-[#9CA3AF]'}`}>
                  {done
                    ? <FiCheckCircle size={12} className="text-green-500 shrink-0" />
                    : <FiCircle size={12} className="shrink-0" />
                  }
                  {label}
                </div>
              ))}
            </div>

            {/* Preview price (optional) */}
            <button
              onClick={handleComputePrice}
              disabled={loading || !step3Done}
              className="w-full py-2.5 border border-[#C9A96E]/40 rounded-xl bg-[#C9A96E]/10 text-[#C9A96E] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#C9A96E]/20 transition-colors disabled:opacity-40 mb-3"
            >
              <FiZap size={15} /> Preview AI Price (optional)
            </button>

            {/* computeResult preview card */}
            {computeResult && (
              <div className="border border-[#C9A96E]/30 bg-[#C9A96E]/10 rounded-xl p-4 flex flex-col gap-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#C9A96E] text-sm font-bold flex items-center gap-1.5">
                    <FiZap className="w-3.5 h-3.5" />
                    ${computeResult.suggestedPrice.toFixed(2)}
                  </span>
                  <button onClick={() => setComputeResult(null)} className="text-[#9CA3AF] hover:text-[#6B6560] transition-colors">
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-[#6B6560]">
                    Range: ${computeResult.minRange}–${computeResult.maxRange}
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    {computeResult.confidence} confidence
                  </span>
                </div>
                <div className="text-xs text-[#9CA3AF] flex items-center gap-1">
                  <FiTrendingUp className="w-3 h-3 text-[#C9A96E]" />
                  Brand: <span className="text-[#6B6560] font-semibold ml-0.5">{computeResult.brand}</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E0D5]">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                <FiArrowLeft size={15} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !step3Done}
                className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <><FiZap size={15} /> List & Get AI Price</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: AI Pricing Result ── */}
        {currentStep === 4 && pricingResult && (
          <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
            {/* Confidence top bar */}
            <div className={`h-1.5 w-full ${
              pricingResult.confidence === 'HIGH'   ? 'bg-green-400' :
              pricingResult.confidence === 'MEDIUM' ? 'bg-amber-400' :
              'bg-red-400'
            }`} />

            <div className="p-8">
              {accepted ? (
                /* ── Success screen ── */
                <div className="flex flex-col gap-4 items-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-400/30 flex items-center justify-center">
                    <FiCheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[#1C1F2E] font-bold text-xl">Product is Live!</p>
                    <p className="text-[#6B6560] text-sm mt-1">
                      Listed at ${chosenPrice ? Number(chosenPrice).toFixed(2) : pricingResult.suggestedPrice.toFixed(2)}
                    </p>
                    <p className="text-[#9CA3AF] text-xs mt-1">A confirmation email has been sent to you</p>
                  </div>
                  <button
                    onClick={() => navigate('/seller/products')}
                    className="w-full max-w-xs py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b8935a] transition-colors"
                  >
                    View My Products
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[#C9A96E] font-bold text-sm flex items-center gap-2">
                      <FiZap className="w-4 h-4" /> AI Pricing Result
                    </p>
                    {pricingResult.status === 'PENDING_SELLER' && !acceptMode && (
                      <button
                        onClick={() => { setPricingResult(null); setAcceptMode(false); setChosenPrice(''); setCurrentStep(3) }}
                        className="text-[#9CA3AF] hover:text-[#6B6560] text-xs transition-colors"
                      >
                        ← Back
                      </button>
                    )}
                  </div>

                  <hr className="border-[#E8E0D5]" />

                  {/* Suggested price — prominent center */}
                  <div className="text-center py-6 border-b border-[#E8E0D5] mb-6">
                    <p className="text-[#9CA3AF] text-sm mb-2">AI Suggested Price</p>
                    <p className="text-5xl font-extrabold text-[#1C1F2E]">
                      ${pricingResult.suggestedPrice.toFixed(2)}
                    </p>
                    <p className="text-[#6B6560] text-sm mt-2">
                      Accepted range: ${pricingResult.minRange} – ${pricingResult.maxRange}
                    </p>
                  </div>

                  {/* Confidence badge */}
                  <div className="mb-4">
                    {pricingResult.confidence === 'HIGH' && (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        <FiCheckCircle className="w-3.5 h-3.5" /> High Confidence
                      </span>
                    )}
                    {pricingResult.confidence === 'MEDIUM' && (
                      <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        <FiAlertCircle className="w-3.5 h-3.5" /> Medium Confidence
                      </span>
                    )}
                    {pricingResult.confidence === 'LOW' && (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-500 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full">
                        <FiAlertCircle className="w-3.5 h-3.5" /> Low Confidence
                      </span>
                    )}
                  </div>

                  {/* Brand */}
                  <p className="text-xs text-[#9CA3AF] flex items-center gap-2 mb-2">
                    <FiTrendingUp className="w-3.5 h-3.5 text-[#C9A96E]" />
                    Brand detected:
                    <span className="bg-[#C9A96E]/10 text-[#C9A96E] font-bold px-2 py-0.5 rounded-full text-xs border border-[#C9A96E]/20">
                      {pricingResult.brand}
                    </span>
                  </p>
                  {pricingResult.confidence === 'HIGH' && (
                    <p className="text-green-600/60 text-[10px] mb-4">
                      ✓ AI is highly confident in this price — based on known market data
                    </p>
                  )}
                  {pricingResult.confidence === 'MEDIUM' && (
                    <p className="text-amber-500/70 text-[10px] mb-4">
                      ⚠ AI has moderate confidence — review the range carefully
                    </p>
                  )}

                  <hr className="border-[#E8E0D5] mb-4" />

                  {/* ML Baseline + Market Range */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                      <p className="text-[#9CA3AF] text-[10px] mb-1">ML Baseline</p>
                      <p className="text-[#1C1F2E] font-bold text-sm">${pricingResult.mlBaselinePrice}</p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-3">
                      <p className="text-[#9CA3AF] text-[10px] mb-1 flex items-center gap-1">
                        Market Range
                        <span className="bg-blue-50 text-blue-500 border border-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      </p>
                      <p className="text-[#1C1F2E] font-bold text-sm">
                        ${pricingResult.marketPriceMin}–${pricingResult.marketPriceMax}
                      </p>
                    </div>
                  </div>

                  <hr className="border-[#E8E0D5] mb-4" />

                  {/* ── PENDING_SELLER ── */}
                  {pricingResult.status === 'PENDING_SELLER' && (
                    <>
                      {!acceptMode ? (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => setAcceptMode(true)}
                            className="w-full bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base hover:shadow-[0_4px_20px_rgba(201,169,110,0.4)]"
                          >
                            <FiCheckCircle className="w-4 h-4" /> Accept Price
                          </button>
                          <button
                            onClick={() => setDisputeModalOpen(true)}
                            className="w-full bg-white border-2 border-[#1C1F2E] hover:bg-[#1C1F2E] hover:text-white text-[#1C1F2E] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
                          >
                            <FiMessageSquare className="w-4 h-4" /> Dispute Price
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-[#6B6560] text-xs mb-1.5">
                              Choose your price{' '}
                              <span className="text-[#9CA3AF]">
                                (${pricingResult.minRange} – ${pricingResult.maxRange})
                              </span>
                            </p>
                            <input
                              type="number"
                              value={chosenPrice}
                              onChange={e => setChosenPrice(e.target.value)}
                              placeholder={`Default: $${pricingResult.suggestedPrice}`}
                              min={pricingResult.minRange}
                              max={pricingResult.maxRange}
                              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E0D5] text-[#1C1F2E] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#C9A96E] transition-colors"
                            />
                            {chosenPrice && (
                              Number(chosenPrice) < pricingResult.minRange ||
                              Number(chosenPrice) > pricingResult.maxRange
                            ) && (
                              <p className="text-red-400 text-[10px] mt-1">
                                Must be between ${pricingResult.minRange} and ${pricingResult.maxRange}
                              </p>
                            )}
                            <p className="text-[#9CA3AF] text-[10px] mt-1">
                              Leave empty to accept suggested price
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              const price = chosenPrice ? Number(chosenPrice) : null
                              if (price && (price < pricingResult.minRange || price > pricingResult.maxRange)) {
                                toast.error(`Price must be between $${pricingResult.minRange} and $${pricingResult.maxRange}`)
                                return
                              }
                              try {
                                const body = price ? { chosenPrice: price } : {}
                                await acceptPrice(pricingResult.productId, body)
                                setAccepted(true)
                              } catch (err) {
                                toast.error(err?.response?.data?.message || 'Failed to accept price')
                              }
                            }}
                            className="w-full py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b8935a] transition-colors"
                          >
                            <FiCheckCircle className="w-4 h-4" /> Confirm & Go Live
                          </button>
                          <button
                            onClick={() => setAcceptMode(false)}
                            className="w-full py-2 text-[#9CA3AF] hover:text-[#6B6560] text-xs transition-colors"
                          >
                            ← Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── PENDING_ADMIN ── */}
                  {pricingResult.status === 'PENDING_ADMIN' && (
                    <div className="flex flex-col gap-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-5 h-5 text-amber-500 shrink-0" />
                          <div className="flex flex-col gap-1">
                            <p className="text-amber-700 font-bold text-sm">Under Admin Review</p>
                            <p className="text-[#6B6560] text-xs">
                              {pricingResult.confidence === 'LOW'
                                ? 'AI could not price this confidently — admin will decide.'
                                : 'Price is outside category bounds — admin will review.'}
                            </p>
                          </div>
                        </div>
                        <hr className="border-amber-200" />
                        <p className="text-[#9CA3AF] text-[10px]">You'll receive an email with the decision.</p>
                        {pricingResult.confidence === 'LOW' && (
                          <div className="bg-white border border-[#E8E0D5] rounded-xl p-3 mt-1">
                            <p className="text-[#6B6560] text-[10px] font-semibold mb-2">Tips if you relist:</p>
                            <ul className="flex flex-col gap-1">
                              {[
                                'Mention brand name clearly (e.g. Sony, Nike, Apple)',
                                'Include model number or full product name',
                                'Describe condition, specs, and any accessories',
                                'Avoid vague terms like "good quality" or "works fine"',
                              ].map(tip => (
                                <li key={tip} className="text-[10px] text-[#9CA3AF] flex items-start gap-1.5">
                                  <span className="text-[#C9A96E] mt-0.5 shrink-0">·</span> {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate('/seller/products')}
                        className="w-full py-3 rounded-xl border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        Back to My Products
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── DISPUTE MODAL ── */}
      {disputeModalOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#E8E0D5] max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="bg-[#1C1F2E] px-6 py-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C9A96E]/20 rounded-xl flex items-center justify-center border border-[#C9A96E]/30">
                    <FiMessageSquare className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Dispute AI Price</p>
                    <p className="text-white/40 text-xs mt-0.5">Submit your own price with reasoning</p>
                  </div>
                </div>
                {!disputeSubmitted && (
                  <button
                    onClick={() => {
                      setDisputeModalOpen(false)
                      setDisputeForm({ sellerPrice: '', sellerReasoning: '' })
                      setDisputeSubmitted(false)
                      setDisputePriceError('')
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-4 h-4 text-white/60" />
                  </button>
                )}
              </div>

              {/* Context strip */}
              {!disputeSubmitted && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-[10px] mb-1 uppercase tracking-wide">AI Suggested</p>
                    <p className="text-white font-bold text-sm">${pricingResult?.suggestedPrice?.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-[10px] mb-1 uppercase tracking-wide">Allowed Range</p>
                    <p className="text-white font-bold text-sm">${pricingResult?.minRange} – ${pricingResult?.maxRange}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-[10px] mb-1 uppercase tracking-wide">Confidence</p>
                    <p className={`font-bold text-sm ${
                      pricingResult?.confidence === 'HIGH' ? 'text-[#C9A96E]' :
                      pricingResult?.confidence === 'MEDIUM' ? 'text-[#C9A96E]' :
                      'text-red-400'
                    }`}>
                      {pricingResult?.confidence}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {!disputeSubmitted ? (
                <>
                  {/* Info note */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 mb-6">
                    <FiAlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Your dispute will be reviewed by an admin. You can suggest any price — but provide clear reasoning to increase approval chances. You'll receive an email with the decision.
                    </p>
                  </div>

                  {/* Two column form */}
                  <div className="grid grid-cols-2 gap-6">

                    {/* Left — Price */}
                    <div>
                      <label className="block text-xs font-semibold text-[#6B6560] mb-1.5">
                        Your Price <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm font-semibold">$</span>
                        <input
                          type="number"
                          value={disputeForm.sellerPrice}
                          onChange={e => { setDisputeForm(prev => ({ ...prev, sellerPrice: e.target.value })); setDisputePriceError('') }}
                          placeholder="e.g. 350"
                          min={0}
                          className="w-full pl-7 pr-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-white focus:outline-none focus:border-[#C9A96E] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-1">No range restriction — enter what you think is fair</p>
                      {disputePriceError && (
                        <p className="text-red-400 text-[10px] mt-1 leading-relaxed">{disputePriceError}</p>
                      )}

                      {/* Price comparison */}
                      {disputeForm.sellerPrice && pricingResult && (
                        <div className="mt-3 bg-white border border-[#E8E0D5] rounded-xl p-2">
                          <p className="text-[10px] text-[#6B6560] mb-2 font-semibold uppercase tracking-wide">Price Comparison</p>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#9CA3AF]">AI Suggested</span>
                              <span className="text-xs text-[#1C1F2E] font-semibold">${pricingResult.suggestedPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#9CA3AF]">Your Price</span>
                              <span className="text-xs text-[#C9A96E] font-bold">${Number(disputeForm.sellerPrice).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-[#E8E0D5]" />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#9CA3AF]">Difference</span>
                              <span className={`text-xs font-bold ${
                                Number(disputeForm.sellerPrice) > pricingResult.suggestedPrice
                                  ? 'text-green-500' : 'text-red-400'
                              }`}>
                                {Number(disputeForm.sellerPrice) > pricingResult.suggestedPrice ? '+' : ''}
                                ${(Number(disputeForm.sellerPrice) - pricingResult.suggestedPrice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right — Reasoning */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#6B6560]">
                          Your Reasoning <span className="text-red-400">*</span>
                        </label>
                        <span className={`text-[10px] font-semibold ${
                          disputeForm.sellerReasoning.length > 450 ? 'text-red-400' :
                          disputeForm.sellerReasoning.length >= 10 ? 'text-green-500' :
                          'text-[#9CA3AF]'
                        }`}>
                          {disputeForm.sellerReasoning.length} / 500
                        </span>
                      </div>
                      <textarea
                        value={disputeForm.sellerReasoning}
                        onChange={e => setDisputeForm(prev => ({ ...prev, sellerReasoning: e.target.value }))}
                        placeholder="Explain why you think your price is fair — e.g. rare limited edition, includes accessories, local market demand, better condition than typical..."
                        maxLength={500}
                        className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-white focus:outline-none focus:border-[#C9A96E] transition-colors resize-none h-[80px]"
                      />
                      {disputeForm.sellerReasoning.length > 0 && disputeForm.sellerReasoning.length < 10 && (
                        <p className="text-red-400 text-[10px] mt-1">
                          {10 - disputeForm.sellerReasoning.length} more characters needed
                        </p>
                      )}
                      {disputeForm.sellerReasoning.length >= 10 && (
                        <p className="text-green-500 text-[10px] mt-1 flex items-center gap-1">
                          <FiCheckCircle className="w-3 h-3" /> Good reasoning
                        </p>
                      )}

                    </div>
                  </div>

                  {/* Validation summary */}
                  {disputeForm.sellerPrice && disputeForm.sellerReasoning.length >= 10 && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-2 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <p className="text-green-700 text-xs">
                        Ready to submit — ${Number(disputeForm.sellerPrice).toFixed(2)} with {disputeForm.sellerReasoning.length} chars of reasoning
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setDisputeModalOpen(false)
                        setDisputeForm({ sellerPrice: '', sellerReasoning: '' })
                        setDisputePriceError('')
                      }}
                      className="flex-1 py-3 rounded-xl border border-[#E8E0D5] text-[#6B6560] text-sm font-semibold hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-colors bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!disputeForm.sellerPrice || Number(disputeForm.sellerPrice) <= 0) {
                          toast.error('Please enter a valid price'); return
                        }
                        if (disputeForm.sellerReasoning.length < 10) {
                          toast.error('Reasoning must be at least 10 characters'); return
                        }
                        const price = parseFloat(disputeForm.sellerPrice)
                        const withinRange = price >= pricingResult.minRange && price <= pricingResult.maxRange
                        if (withinRange) {
                          setDisputePriceError(`This price is already within the accepted range ($${pricingResult.minRange} – $${pricingResult.maxRange}). Use Accept Price instead.`)
                          return
                        }
                        setDisputePriceError('')
                        setDisputeLoading(true)
                        try {
                          await disputePrice(pricingResult.productId, {
                            sellerPrice: parseFloat(disputeForm.sellerPrice),
                            sellerReasoning: disputeForm.sellerReasoning,
                          })
                          setDisputeSubmitted(true)
                        } catch (err) {
                          toast.error(err?.response?.data?.message || 'Failed to submit dispute')
                        } finally {
                          setDisputeLoading(false)
                        }
                      }}
                      disabled={disputeLoading || !disputeForm.sellerPrice || disputeForm.sellerReasoning.length < 10}
                      className="flex-1 py-3 rounded-xl bg-[#1C1F2E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2E3452] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {disputeLoading
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                        : <><FiMessageSquare className="w-4 h-4" /> Submit Dispute</>
                      }
                    </button>
                  </div>
                </>
              ) : (
                /* Dispute success state */
                <div className="py-10 flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 bg-[#C9A96E]/10 border-2 border-[#C9A96E]/30 rounded-full flex items-center justify-center">
                    <FiClock className="w-8 h-8 text-[#C9A96E]" />
                  </div>
                  <div>
                    <p className="text-[#1C1F2E] font-bold text-xl">Dispute Submitted!</p>
                    <p className="text-[#6B6560] text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                      Your dispute has been sent to our admin team. You'll receive an email with the decision.
                    </p>
                  </div>
                  <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 w-full max-w-xs">
                    <div className="flex justify-between text-xs mb-2.5">
                      <span className="text-[#9CA3AF]">Your Price</span>
                      <span className="text-[#1C1F2E] font-bold">${Number(disputeForm.sellerPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-2.5">
                      <span className="text-[#9CA3AF]">AI Suggested</span>
                      <span className="text-[#6B6560]">${pricingResult?.suggestedPrice?.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-[#E8E0D5] mb-2.5" />
                    <div className="flex justify-between text-xs">
                      <span className="text-[#9CA3AF]">Status</span>
                      <span className="text-yellow-500 font-semibold flex items-center gap-1">
                        <FiClock className="w-3 h-3" /> Under Review
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDisputeModalOpen(false)
                      setDisputeSubmitted(false)
                      setDisputeForm({ sellerPrice: '', sellerReasoning: '' })
                      setDisputePriceError('')
                      navigate('/seller/products')
                    }}
                    className="w-full max-w-xs py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold hover:bg-[#b8935a] transition-colors"
                  >
                    Back to My Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CROP MODAL ── */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg" style={{ height: 360 }}>
            <Cropper
              image={currentCropUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />
          </div>
          <div className="flex items-center gap-3 mt-4 w-full max-w-lg">
            <span className="text-white/60 text-xs">Zoom</span>
            <input
              type="range" min={1} max={3} step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { setCropModalOpen(false); URL.revokeObjectURL(currentCropUrl) }}
              className="px-5 py-2 rounded-full border border-white/20 text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              className="px-5 py-2 rounded-full bg-[#C9A96E] text-white font-bold text-sm"
            >
              Confirm Crop
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default ListProduct
