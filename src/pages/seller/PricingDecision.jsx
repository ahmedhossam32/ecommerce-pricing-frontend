import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import BackButton from '../../components/BackButton'

const DUMMY_DECISION = {
  productId: 99,
  productName: 'Sony WH-1000XM5 Headphones',
  suggestedPrice: 280,
  minRange: 238,
  maxRange: 322,
  confidence: 'MEDIUM',
  status: 'PENDING_SELLER',
  message: 'Please review the suggested price and accept or dispute.',
  brand: 'Sony',
  mlBaselinePrice: 265,
  marketPriceMin: 220,
  marketPriceMax: 380,
}

const confidenceStyle = {
  HIGH:   'bg-green-50 text-green-600 border-green-200',
  MEDIUM: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  LOW:    'bg-red-50 text-red-500 border-red-200',
}

const inputCls = 'w-full bg-[#FAF8F5] border border-[#E8E0D5] focus:border-[#1C1F2E] rounded-xl px-4 py-3 text-sm text-[#1C1F2E] focus:outline-none transition-colors'
const inputErrCls = 'w-full bg-[#FAF8F5] border border-red-400 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-[#1C1F2E] focus:outline-none transition-colors'

function PricingDecision() {
  const [decisionData] = useState(DUMMY_DECISION)
  const [pageStatus, setPageStatus] = useState(decisionData.status)

  const [acceptMode, setAcceptMode] = useState(false)
  const [chosenPrice, setChosenPrice] = useState('')
  const [accepting, setAccepting] = useState(false)

  const [disputeMode, setDisputeMode] = useState(false)
  const [disputeForm, setDisputeForm] = useState({ sellerPrice: '', sellerReasoning: '' })
  const [disputeErrors, setDisputeErrors] = useState({})
  const [disputing, setDisputing] = useState(false)

  const handleAccept = async () => {
    setAccepting(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Price accepted! Your product is now live.')
    setPageStatus('LIVE')
    setAccepting(false)
  }

  const validateDispute = () => {
    const e = {}
    if (!disputeForm.sellerPrice || Number(disputeForm.sellerPrice) <= 0) e.sellerPrice = 'Enter a valid price'
    if (!disputeForm.sellerReasoning || disputeForm.sellerReasoning.length < 10) e.sellerReasoning = 'Reasoning must be at least 10 characters'
    setDisputeErrors(e)
    return Object.keys(e).length === 0
  }

  const handleDispute = async () => {
    if (!validateDispute()) return
    setDisputing(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Dispute submitted! Admin will review your request.')
    setPageStatus('PENDING_ADMIN')
    setDisputing(false)
  }

  const priceOutOfRange = chosenPrice !== '' && (
    Number(chosenPrice) < decisionData.minRange || Number(chosenPrice) > decisionData.maxRange
  )

  /* ── HEADER ───────────────────────────────────────────── */
  const renderHeader = () => {
    if (pageStatus === 'PENDING_ADMIN') return (
      <div className="bg-yellow-600 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <FiClock className="w-8 h-8 text-white mb-3" />
          <h1 className="text-3xl font-extrabold text-white">Under Admin Review</h1>
          <p className="text-yellow-100 text-sm mt-2">Your dispute has been submitted. We'll email you when admin decides.</p>
        </div>
      </div>
    )
    if (pageStatus === 'LIVE') return (
      <div className="bg-green-600 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <FiCheckCircle className="w-8 h-8 text-white mb-3" />
          <h1 className="text-3xl font-extrabold text-white">Your Product is Live! 🎉</h1>
          <p className="text-green-100 text-sm mt-2">Congratulations! Your product is now visible to buyers.</p>
        </div>
      </div>
    )
    return (
      <div className="bg-[#1C1F2E] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <BackButton label="Back" />
          <h1 className="text-3xl font-extrabold text-white mt-4">AI Pricing Result</h1>
          <p className="text-[#C9A96E] text-sm mt-2">Review the suggested price and make your decision.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* DEV ONLY — remove before demo */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-2 flex items-center gap-3">
        <span className="text-gray-400 text-xs font-mono">DEV:</span>
        <span className="text-gray-500 text-xs">Test scenario:</span>
        {[
          { key: 'PENDING_SELLER', label: 'Pending Seller', color: 'bg-blue-600' },
          { key: 'PENDING_ADMIN',  label: 'Pending Admin',  color: 'bg-yellow-600' },
          { key: 'LIVE',           label: 'Live',           color: 'bg-green-600' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setPageStatus(s.key)}
            className={`text-white text-xs font-bold px-3 py-1 rounded-full transition-opacity ${s.color} ${pageStatus === s.key ? 'opacity-100 ring-2 ring-white ring-offset-1 ring-offset-gray-900' : 'opacity-50 hover:opacity-80'}`}
          >
            {s.label}
          </button>
        ))}
        <span className="text-gray-600 text-xs ml-2 font-mono">← remove before demo</span>
      </div>

      {/* ── STICKY TOP BAR ────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-white border-b border-[#E8E0D5]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-[#9E9590] text-xs">
            <Link to="/seller/dashboard" className="hover:text-[#1C1F2E] transition-colors">Dashboard</Link>
            {' / '}
            <Link to="/seller/products" className="hover:text-[#1C1F2E] transition-colors">My Products</Link>
            {' / '}
            <span className="text-[#1C1F2E] font-medium">Pricing Decision</span>
          </span>
          <span className="text-[#9E9590] text-xs truncate max-w-[200px]">{decisionData.productName}</span>
        </div>
      </div>

      {/* ── HEADER ────────────────────────────────────────── */}
      {renderHeader()}

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── STATE 1: PENDING_SELLER ────────────────────── */}
        {pageStatus === 'PENDING_SELLER' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

            {/* LEFT — AI Pricing Breakdown */}
            <div className="bg-white border border-[#E8E0D5] rounded-3xl p-6">
              <h2 className="text-[#1C1F2E] font-bold text-lg mb-6">AI Pricing Breakdown</h2>

              {/* Hero price */}
              <div className="text-center py-6 bg-[#FAF8F5] rounded-2xl mb-6">
                <p className="text-[#9E9590] text-sm mb-2">Suggested Price</p>
                <p className="text-5xl font-extrabold text-[#1C1F2E]">${decisionData.suggestedPrice.toFixed(2)}</p>
                <p className="text-[#6B6560] text-sm mt-2">
                  Range: ${decisionData.minRange} – ${decisionData.maxRange}
                </p>
                <span className={`mt-3 inline-block text-xs font-bold px-3 py-1 rounded-full border ${confidenceStyle[decisionData.confidence] || confidenceStyle.MEDIUM}`}>
                  {decisionData.confidence} Confidence
                </span>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { label: 'Brand Detected',  value: decisionData.brand },
                  { label: 'ML Baseline',     value: `$${decisionData.mlBaselinePrice}` },
                  { label: 'Market Min',      value: `$${decisionData.marketPriceMin}` },
                  { label: 'Market Max',      value: `$${decisionData.marketPriceMax}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#FAF8F5] rounded-2xl p-4">
                    <p className="text-[#9E9590] text-xs mb-1">{label}</p>
                    <p className="text-[#1C1F2E] font-bold text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Info box */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                <FiAlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-700 font-semibold text-sm">How was this price calculated?</p>
                  <p className="text-blue-600 text-xs mt-1">
                    Our ML model analyzed {decisionData.productName} against thousands of similar products.
                    The LLM then cross-referenced real market data to suggest a fair price within the competitive range.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Decision Panel */}
            <div>

              {/* Accept card */}
              <div className="bg-white border-2 border-[#E8E0D5] hover:border-green-300 rounded-3xl p-6 mb-4 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-[#1C1F2E] font-bold">Accept Price</span>
                  </div>
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                {!acceptMode ? (
                  <>
                    <p className="text-[#6B6560] text-sm mb-4">
                      Accept the AI suggested price of ${decisionData.suggestedPrice} and go live immediately.
                    </p>
                    <button
                      onClick={handleAccept}
                      disabled={accepting}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {accepting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Accept Suggested Price (${decisionData.suggestedPrice})
                    </button>
                    <button
                      onClick={() => setAcceptMode(true)}
                      className="w-full border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] py-3 rounded-xl text-sm font-medium mt-2 transition-colors"
                    >
                      Choose Custom Price
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[#6B6560] text-sm mb-3">Enter your price within the allowed range:</p>
                    <p className="text-[#C9A96E] text-xs font-bold mb-2">
                      Min: ${decisionData.minRange} — Max: ${decisionData.maxRange}
                    </p>
                    <input
                      type="number"
                      value={chosenPrice}
                      onChange={e => setChosenPrice(e.target.value)}
                      min={decisionData.minRange}
                      max={decisionData.maxRange}
                      step="0.01"
                      placeholder="e.g. 265"
                      className={inputCls}
                    />
                    {priceOutOfRange && (
                      <p className="text-red-400 text-xs mt-1">
                        Price must be between ${decisionData.minRange} and ${decisionData.maxRange}
                      </p>
                    )}
                    <button
                      onClick={handleAccept}
                      disabled={!chosenPrice || priceOutOfRange || accepting}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl mt-3 text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {accepting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Confirm Price
                    </button>
                    <button
                      onClick={() => { setAcceptMode(false); setChosenPrice('') }}
                      className="text-[#6B6560] text-xs mt-2 w-full text-center hover:text-[#1C1F2E] transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Dispute card */}
              <div className="bg-white border-2 border-[#E8E0D5] hover:border-orange-300 rounded-3xl p-6 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <FiAlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-[#1C1F2E] font-bold">Dispute Price</span>
                </div>

                {!disputeMode ? (
                  <>
                    <p className="text-[#6B6560] text-sm mb-4">
                      Disagree with the suggested price? Submit your own price with justification for admin review.
                    </p>
                    <button
                      onClick={() => setDisputeMode(true)}
                      className="w-full border-2 border-orange-300 hover:bg-orange-50 text-orange-600 font-bold py-3 rounded-xl text-sm transition-colors"
                    >
                      Dispute This Price
                    </button>
                  </>
                ) : (
                  <>
                    {/* Seller price */}
                    <div className="mb-4">
                      <label className="block text-[#1C1F2E] text-xs font-semibold mb-1.5">Your Proposed Price *</label>
                      <input
                        type="number"
                        value={disputeForm.sellerPrice}
                        onChange={e => setDisputeForm(prev => ({ ...prev, sellerPrice: e.target.value }))}
                        className={disputeErrors.sellerPrice ? inputErrCls : inputCls}
                        placeholder="e.g. 320"
                      />
                      {disputeErrors.sellerPrice && (
                        <p className="text-red-500 text-xs mt-1">{disputeErrors.sellerPrice}</p>
                      )}
                    </div>

                    {/* Reasoning */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[#1C1F2E] text-xs font-semibold">Your Reasoning *</label>
                        <span className="text-[#9E9590] text-[10px]">{disputeForm.sellerReasoning.length}/500</span>
                      </div>
                      <textarea
                        rows={4}
                        maxLength={500}
                        value={disputeForm.sellerReasoning}
                        onChange={e => setDisputeForm(prev => ({ ...prev, sellerReasoning: e.target.value }))}
                        placeholder="Explain why you believe your price is more accurate. E.g. 'This is a limited edition model that sells for higher in the current market...'"
                        className={`${disputeErrors.sellerReasoning ? inputErrCls : inputCls} resize-none`}
                      />
                      {disputeErrors.sellerReasoning && (
                        <p className="text-red-500 text-xs mt-1">{disputeErrors.sellerReasoning}</p>
                      )}
                    </div>

                    <button
                      onClick={handleDispute}
                      disabled={disputing}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-3 text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {disputing && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                      Submit Dispute
                    </button>
                    <button
                      onClick={() => { setDisputeMode(false); setDisputeForm({ sellerPrice: '', sellerReasoning: '' }) }}
                      className="text-[#6B6560] text-xs mt-2 w-full text-center hover:text-[#1C1F2E] transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ── STATE 2: PENDING_ADMIN ─────────────────────── */}
        {pageStatus === 'PENDING_ADMIN' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock className="w-20 h-20 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1F2E] mb-2">Dispute Submitted Successfully</h2>
            <p className="text-[#6B6560] mb-6">Your request is now in the admin queue.</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-left mb-8 max-w-md mx-auto">
              {[
                { label: 'Your Proposed Price', value: disputeForm.sellerPrice ? `$${disputeForm.sellerPrice}` : '—' },
                { label: 'AI Suggested Price',  value: `$${decisionData.suggestedPrice}` },
                { label: 'Status',              value: 'Pending Admin Review', cls: 'text-yellow-600 font-bold' },
              ].map(({ label, value, cls }, i, arr) => (
                <div key={label} className={`flex justify-between text-sm py-2 ${i < arr.length - 1 ? 'border-b border-yellow-100' : ''}`}>
                  <span className="text-[#6B6560]">{label}</span>
                  <span className={cls || 'text-[#1C1F2E] font-medium'}>{value}</span>
                </div>
              ))}
            </div>

            <p className="text-[#1C1F2E] font-bold mb-2">What happens next?</p>
            <p className="text-[#6B6560] text-sm mb-8">
              An admin will review your dispute and either approve your price or reject it.
              You will receive an email notification with the decision.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/seller/products"
                className="bg-[#1C1F2E] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#2E3452] transition-colors"
              >
                View My Products
              </Link>
              <Link
                to="/seller/dashboard"
                className="border border-[#E8E0D5] text-[#6B6560] px-6 py-3 rounded-full text-sm hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* ── STATE 3: LIVE ──────────────────────────────── */}
        {pageStatus === 'LIVE' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1F2E] mb-2">Your Product is Live! 🎉</h2>
            <p className="text-[#6B6560] mb-6">Buyers can now find and purchase your product.</p>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left mb-8 max-w-md mx-auto">
              {[
                { label: 'Product',     value: decisionData.productName },
                { label: 'Final Price', value: `$${chosenPrice || decisionData.suggestedPrice}`, cls: 'text-green-600 font-bold' },
                { label: 'Status',      value: 'Live ✓',                                         cls: 'text-green-600 font-bold' },
              ].map(({ label, value, cls }, i, arr) => (
                <div key={label} className={`flex justify-between text-sm py-2 ${i < arr.length - 1 ? 'border-b border-green-100' : ''}`}>
                  <span className="text-[#6B6560]">{label}</span>
                  <span className={cls || 'text-[#1C1F2E] font-medium'}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to={`/products/${decisionData.productId}`}
                className="bg-[#C9A96E] hover:bg-[#b8935a] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                View Product
              </Link>
              <Link
                to="/seller/products/new"
                className="bg-[#1C1F2E] hover:bg-[#2E3452] text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                + List Another
              </Link>
              <Link
                to="/seller/dashboard"
                className="border border-[#E8E0D5] text-[#6B6560] px-6 py-3 rounded-full text-sm hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PricingDecision
