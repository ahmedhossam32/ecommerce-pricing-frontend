import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiUpload, FiX, FiZap, FiCheckCircle, FiCircle, FiMessageSquare, FiTrendingUp, FiClock, FiAlertCircle, FiPackage, FiTruck } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
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

const DUMMY_RESULT_PENDING_SELLER = {
  productId: 'p-demo',
  suggestedPrice: 280,
  minRange: 238,
  maxRange: 322,
  confidence: 'MEDIUM',
  brand: 'Sony',
  mlBaselinePrice: 265,
  marketPriceMin: 220,
  marketPriceMax: 380,
  status: 'PENDING_SELLER',
  message: 'Price suggestion ready',
}

const DUMMY_RESULT_PENDING_ADMIN = {
  productId: 'p-demo-admin',
  suggestedPrice: 7500,
  minRange: 6000,
  maxRange: 9000,
  confidence: 'LOW',
  brand: 'Rolex',
  mlBaselinePrice: 7200,
  marketPriceMin: 6000,
  marketPriceMax: 9500,
  status: 'PENDING_ADMIN',
  message: 'Submitted for admin review',
}

// Change this to test each scenario
const DUMMY_RESULT = { ...DUMMY_RESULT_PENDING_SELLER, confidence: 'HIGH' }

function ListProduct() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: '', category: '', description: '',
    weight: '', freightValue: '',
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

  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [currentCropFile, setCurrentCropFile] = useState(null)
  const [currentCropUrl, setCurrentCropUrl] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const checks = [
    { label: 'Name entered',       done: form.name.length >= 2 },
    { label: 'Category selected',  done: form.category !== '' },
    { label: 'Description filled', done: form.description.length >= 10 },
    { label: 'Weight entered',     done: form.weight !== '' && Number(form.weight) > 0 },
    { label: 'Photos uploaded',    done: images.length >= 1 },
  ]
  const allDone = checks.every(c => c.done)

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
    if (!allDone) { toast.error('Fill all fields first to compute price'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setComputeResult(DUMMY_RESULT)
  }

  const handleSubmit = async () => {
    if (!allDone) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setPricingResult(DUMMY_RESULT)
    setLoading(false)
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

      {/* 3-column grid */}
      <div className="grid grid-cols-[220px_1fr_220px] gap-5 p-8">

        {/* Column 1: Product Images */}
        <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-[#1C1F2E] mb-1">Product Images</h2>
          <p className="text-xs text-[#9CA3AF] mb-4">Up to 5 images. First is thumbnail.</p>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-[#E8E0D5] hover:border-[#C9A96E] rounded-2xl p-8 flex flex-col items-center gap-3 transition-colors bg-[#FAF8F5] hover:bg-[#FDF6EC] group">
              <div className="w-10 h-10 bg-[#C9A96E]/10 rounded-xl flex items-center justify-center group-hover:bg-[#C9A96E]/20 transition-colors">
                <FiUpload className="w-5 h-5 text-[#C9A96E]" />
              </div>
              <div className="text-center">
                <p className="text-[#1C1F2E] font-semibold text-sm">Click to upload</p>
                <p className="text-[#9E9590] text-xs mt-0.5">JPG, PNG — max 5 images</p>
              </div>
            </div>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {images.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#E8E0D5] bg-[#FAF8F5]">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#C9A96E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Thumbnail
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/70"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-[#9CA3AF] text-center mt-3">{images.length} / 5 images</p>
        </div>

        {/* Column 2: Product Details */}
        <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6">
          <h2 className="text-sm font-bold text-[#1C1F2E] mb-4">Product Details</h2>

          <div className="bg-[#FAF0E0] border border-[#E8D5A3] rounded-xl p-3 flex items-start gap-2 mb-5">
            <FiZap className="text-[#C9A96E] w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-[#92601A] text-xs leading-relaxed">
              Brand is extracted automatically from your description — mention the brand name naturally in your description for a more accurate price.
            </p>
          </div>

          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5 space-y-4">
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

          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5 space-y-4 mt-4">
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
        </div>

        {/* Column 3: AI Preview Panel */}
        <div className={`bg-[#1C1F2E] rounded-2xl p-5 flex flex-col gap-4 border ${pricingResult?.confidence === 'HIGH' ? 'border-green-300 shadow-md shadow-green-100' : 'border-transparent'}`}>
          {pricingResult ? (
            <>
              {/* ── ACCEPTED SUCCESS SCREEN ── */}
              {accepted ? (
                <div className="flex flex-col gap-4 items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FiCheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Product is Live!</p>
                    <p className="text-white/50 text-xs mt-1">
                      Listed at ${chosenPrice ? Number(chosenPrice).toFixed(2) : pricingResult.suggestedPrice.toFixed(2)}
                    </p>
                    <p className="text-white/30 text-[10px] mt-1">
                      A confirmation email has been sent to you
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/seller/products')}
                    className="w-full py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b8935a] transition-colors"
                  >
                    View My Products
                  </button>
                </div>

              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-[#C9A96E] font-bold text-sm flex items-center gap-2">
                      <FiZap className="w-4 h-4" /> AI Pricing Result
                    </p>
                    {pricingResult.status === 'PENDING_SELLER' && !acceptMode && (
                      <button
                        onClick={() => { setPricingResult(null); setAcceptMode(false); setChosenPrice('') }}
                        className="text-white/30 hover:text-white/60 text-xs transition-colors"
                      >
                        ← Back
                      </button>
                    )}
                  </div>

                  <hr className="border-white/10" />

                  {/* Suggested Price */}
                  <div>
                    <p className="text-white/40 text-[10px] mb-1">Suggested Price</p>
                    <p className="text-white text-3xl font-extrabold">
                      ${pricingResult.suggestedPrice.toFixed(2)}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      Range: ${pricingResult.minRange} – ${pricingResult.maxRange}
                    </p>
                  </div>

                  {/* Confidence Badge */}
                  <div>
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
                  <p className="text-xs text-[#9CA3AF] flex items-center gap-2">
                    <FiTrendingUp className="w-3.5 h-3.5 text-[#C9A96E]" />
                    Brand detected:
                    <span className="bg-[#C9A96E]/10 text-[#C9A96E] font-bold px-2 py-0.5 rounded-full text-xs border border-[#C9A96E]/20">
                      {pricingResult.brand}
                    </span>
                  </p>
                  {pricingResult.confidence === 'HIGH' && (
                    <p className="text-green-400/60 text-[10px]">
                      ✓ AI is highly confident in this price — based on known market data
                    </p>
                  )}
                  {pricingResult.confidence === 'MEDIUM' && (
                    <p className="text-yellow-400/60 text-[10px]">
                      ⚠ AI has moderate confidence — review the range carefully
                    </p>
                  )}

                  <hr className="border-white/10" />

                  {/* ML + Market */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-[10px] mb-1">ML Baseline</p>
                      <p className="text-white font-bold text-sm">${pricingResult.mlBaselinePrice}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-[10px] mb-1">Market Range</p>
                      <p className="text-white font-bold text-sm">
                        ${pricingResult.marketPriceMin}–${pricingResult.marketPriceMax}
                      </p>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* ── SCENARIO 1: PENDING_SELLER ── */}
                  {pricingResult.status === 'PENDING_SELLER' && (
                    <>
                      {!acceptMode ? (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => setAcceptMode(true)}
                            className="w-full bg-[#C9A96E] hover:bg-[#b8935a] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base shadow-md shadow-[#C9A96E]/20"
                          >
                            <FiCheckCircle className="w-4 h-4" /> Accept Price
                          </button>
                          <button
                            onClick={() => setDisputeModalOpen(true)}
                            className="w-full bg-white border-2 border-[#1C1F2E] hover:bg-[#1C1F2E] text-[#1C1F2E] hover:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
                          >
                            <FiMessageSquare className="w-4 h-4" /> Dispute Price
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="text-white/60 text-xs mb-1.5">
                              Choose your price{' '}
                              <span className="text-white/30">
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
                              className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#C9A96E] transition-colors"
                            />
                            {chosenPrice && (
                              Number(chosenPrice) < pricingResult.minRange ||
                              Number(chosenPrice) > pricingResult.maxRange
                            ) && (
                              <p className="text-red-400 text-[10px] mt-1">
                                Must be between ${pricingResult.minRange} and ${pricingResult.maxRange}
                              </p>
                            )}
                            <p className="text-white/25 text-[10px] mt-1">
                              Leave empty to accept suggested price
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const price = chosenPrice
                                ? Number(chosenPrice)
                                : pricingResult.suggestedPrice
                              if (
                                chosenPrice &&
                                (price < pricingResult.minRange || price > pricingResult.maxRange)
                              ) {
                                toast.error(`Price must be between $${pricingResult.minRange} and $${pricingResult.maxRange}`)
                                return
                              }
                              // TODO: call POST /api/products/{id}/accept with chosenPrice
                              setAccepted(true)
                            }}
                            className="w-full py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b8935a] transition-colors"
                          >
                            <FiCheckCircle className="w-4 h-4" /> Confirm & Go Live
                          </button>
                          <button
                            onClick={() => setAcceptMode(false)}
                            className="w-full py-2 text-white/30 hover:text-white/60 text-xs transition-colors"
                          >
                            ← Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── SCENARIO 2: PENDING_ADMIN ── */}
                  {pricingResult.status === 'PENDING_ADMIN' && (
                    <div className="flex flex-col gap-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-5 h-5 text-yellow-400 shrink-0" />
                          <div className="flex flex-col gap-1">
                            <p className="text-yellow-400 font-bold text-sm">Under Admin Review</p>
                            <p className="text-white/50 text-xs">
                              {pricingResult.confidence === 'LOW'
                                ? 'AI could not price this confidently — admin will decide.'
                                : 'Price is outside category bounds — admin will review.'}
                            </p>
                          </div>
                        </div>
                        <hr className="border-white/10" />
                        <p className="text-white/30 text-[10px]">You'll receive an email with the decision.</p>
                        {pricingResult.confidence === 'LOW' && (
                          <div className="bg-white/5 rounded-xl p-3 mt-1">
                            <p className="text-white/50 text-[10px] font-semibold mb-2">Tips if you relist:</p>
                            <ul className="flex flex-col gap-1">
                              {[
                                'Mention brand name clearly (e.g. Sony, Nike, Apple)',
                                'Include model number or full product name',
                                'Describe condition, specs, and any accessories',
                                'Avoid vague terms like "good quality" or "works fine"',
                              ].map(tip => (
                                <li key={tip} className="text-[10px] text-white/30 flex items-start gap-1.5">
                                  <span className="text-[#C9A96E] mt-0.5 shrink-0">·</span> {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => navigate('/seller/products')}
                        className="w-full py-3 rounded-xl border border-white/20 text-white/70 text-sm font-semibold flex items-center justify-center gap-2 hover:border-white/40 hover:text-white transition-colors"
                      >
                        Back to My Products
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* ── BEFORE SUBMIT — checklist + buttons ── */
            <>
              <div>
                <p className="text-[#C9A96E] font-bold text-sm flex items-center gap-2">
                  <FiZap className="w-4 h-4" /> AI Price Preview
                </p>
                <p className="text-white/40 text-xs mt-1">Test pricing before listing</p>
              </div>
              <hr className="border-white/10" />
              <div className="flex flex-col gap-2">
                {checks.map(({ label, done }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 text-xs ${done ? 'text-white/80' : 'text-white/30'}`}
                  >
                    {done
                      ? <FiCheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      : <FiCircle className="w-3.5 h-3.5 shrink-0" />
                    }
                    {label}
                  </div>
                ))}
              </div>
              <hr className="border-white/10" />
              <button
                onClick={handleComputePrice}
                disabled={loading}
                className="w-full py-2.5 border border-[#C9A96E]/40 rounded-xl bg-[#C9A96E]/10 text-[#C9A96E] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#C9A96E]/20 transition-colors disabled:opacity-50"
              >
                <FiZap className="w-3.5 h-3.5" /> Compute Price
              </button>
              {computeResult && (
                <div className="border border-[#C9A96E]/30 bg-[#C9A96E]/10 rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A96E] text-sm font-bold flex items-center gap-1.5">
                      <FiZap className="w-3.5 h-3.5" />
                      ${computeResult.suggestedPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setComputeResult(null)}
                      className="text-white/20 hover:text-white/50 transition-colors"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-white/50">
                      Range: ${computeResult.minRange}–${computeResult.maxRange}
                    </span>
                    <span className="text-xs font-bold text-green-400">
                      {computeResult.confidence} confidence
                    </span>
                  </div>
                  <div className="text-xs text-white/40 flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3 text-[#C9A96E]" />
                    Brand: <span className="text-white/70 font-semibold ml-0.5">{computeResult.brand}</span>
                  </div>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading || !allDone}
                className="w-full py-3 rounded-xl bg-[#C9A96E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#b8935a] transition-colors disabled:opacity-60"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
                  : <><FiZap className="w-4 h-4" /> List & Get AI Price</>
                }
              </button>
              <p className="text-white/25 text-[9px] text-center leading-relaxed">
                By listing, pricing is AI-verified and subject to admin review if outside bounds.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── DISPUTE MODAL ── */}
      {disputeModalOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#E8E0D5]">

            {/* Modal Header */}
            <div className="bg-[#1C1F2E] px-8 py-6">
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
                      pricingResult?.confidence === 'HIGH' ? 'text-green-400' :
                      pricingResult?.confidence === 'MEDIUM' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {pricingResult?.confidence}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
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
                          onChange={e => setDisputeForm(prev => ({ ...prev, sellerPrice: e.target.value }))}
                          placeholder="e.g. 350"
                          min={0}
                          className="w-full pl-7 pr-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-white focus:outline-none focus:border-[#C9A96E] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-1">No range restriction — enter what you think is fair</p>

                      {/* Price comparison */}
                      {disputeForm.sellerPrice && pricingResult && (
                        <div className="mt-3 bg-white border border-[#E8E0D5] rounded-xl p-3">
                          <p className="text-[10px] text-[#6B6560] mb-2 font-semibold uppercase tracking-wide">Price Comparison</p>
                          <div className="flex flex-col gap-2">
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
                        className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-xl text-sm text-[#1C1F2E] bg-white focus:outline-none focus:border-[#C9A96E] transition-colors resize-none h-[120px]"
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

                      {/* Tips */}
                      <div className="mt-3 bg-white border border-[#E8E0D5] rounded-xl p-3">
                        <p className="text-[10px] text-[#6B6560] font-semibold mb-2">Tips for approval:</p>
                        <ul className="flex flex-col gap-1.5">
                          {[
                            'Mention condition (new, like new, used)',
                            'Reference comparable market prices',
                            'Note any included accessories',
                            'Explain rarity or limited availability',
                          ].map(tip => (
                            <li key={tip} className="text-[10px] text-[#9CA3AF] flex items-start gap-1.5">
                              <span className="text-[#C9A96E] mt-0.5 shrink-0">·</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Validation summary */}
                  {disputeForm.sellerPrice && disputeForm.sellerReasoning.length >= 10 && (
                    <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <p className="text-green-700 text-xs">
                        Ready to submit — ${Number(disputeForm.sellerPrice).toFixed(2)} with {disputeForm.sellerReasoning.length} chars of reasoning
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => {
                        setDisputeModalOpen(false)
                        setDisputeForm({ sellerPrice: '', sellerReasoning: '' })
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
                        setDisputeLoading(true)
                        await new Promise(r => setTimeout(r, 1500))
                        setDisputeLoading(false)
                        setDisputeSubmitted(true)
                      }}
                      disabled={disputeLoading || !disputeForm.sellerPrice || disputeForm.sellerReasoning.length < 10}
                      className="flex-1 py-3 rounded-xl bg-[#1C1F2E] text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2E3452] transition-colors disabled:opacity-50"
                    >
                      {disputeLoading
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                        : <><FiMessageSquare className="w-4 h-4" /> Submit Dispute</>
                      }
                    </button>
                  </div>
                </>
              ) : (
                /* Success state */
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

      {/* Crop Modal */}
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
