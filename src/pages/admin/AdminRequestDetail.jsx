import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiFileText, FiArrowLeft, FiChevronLeft, FiChevronRight,
  FiCheckCircle, FiXCircle, FiAlertCircle, FiMail,
  FiMessageSquare, FiRefreshCw,
} from 'react-icons/fi'
import { categoryEmojis, categoryGradients, getRoutingReason } from '../../data/adminDummyData'
import api from '../../api/axiosInstance'

function AdminRequestDetail() {
  const { requestId } = useParams()
  const navigate = useNavigate()

  const [request, setRequest]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [imgIndex, setImgIndex]   = useState(0)

  const [approvedPrice, setApprovedPrice]     = useState('')
  const [adminNote, setAdminNote]             = useState('')
  const [approveLoading, setApproveLoading]   = useState(false)
  const [approveError, setApproveError]       = useState(null)

  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectLoading, setRejectLoading]     = useState(false)
  const [rejectError, setRejectError]         = useState(null)

  const [decision, setDecision] = useState(null)
  const [activeDecisionTab, setActiveDecisionTab] = useState('APPROVE')
  const [confirmModal, setConfirmModal] = useState(null)

  const fetchRequest = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/admin/requests/${requestId}`)
      setRequest(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Request not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequest() }, [requestId])

  useEffect(() => {
    if (request?.suggestedPrice != null) {
      setApprovedPrice(String(request.suggestedPrice))
    }
  }, [request])

  const handleApprove = async () => {
    if (!approvedPrice || isNaN(Number(approvedPrice)) || Number(approvedPrice) <= 0) {
      setApproveError('Please enter a valid positive price')
      return
    }
    setApproveLoading(true)
    setApproveError(null)
    try {
      await api.post(`/admin/approve/${requestId}`, {
        approvedPrice: Number(approvedPrice),
        adminNote: adminNote.trim() || undefined
      })
      toast.success('Request approved successfully!')
      setDecision('APPROVED')
    } catch (err) {
      setApproveError(err?.response?.data?.message || 'Failed to approve. Try again.')
      toast.error(err?.response?.data?.message || 'Failed to approve')
    } finally {
      setApproveLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectError('Rejection reason is required')
      return
    }
    if (rejectionReason.trim().length < 5) {
      setRejectError('Reason must be at least 5 characters')
      return
    }
    setRejectLoading(true)
    setRejectError(null)
    try {
      await api.post(`/admin/reject/${requestId}`, {
        rejectionReason: rejectionReason.trim()
      })
      toast.success('Request rejected.')
      setDecision('REJECTED')
    } catch (err) {
      setRejectError(err?.response?.data?.message || 'Failed to reject. Try again.')
      toast.error(err?.response?.data?.message || 'Failed to reject')
    } finally {
      setRejectLoading(false)
    }
  }

  const emoji        = categoryEmojis[request?.category]   || categoryEmojis.default
  const gradient     = categoryGradients[request?.category] || categoryGradients.default
  const hasImage     = request?.imageUrls?.length > 0
  const routingReason = request?.routingReason || (request ? getRoutingReason(request) : null)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-[#1C1F2E] py-10 px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link to="/admin/dashboard" className="hover:text-white/70 transition-colors">Admin Panel</Link>
            <span>/</span>
            <Link to="/admin/requests" className="hover:text-white/70 transition-colors">Pending Requests</Link>
            <span>/</span>
            <span className="text-white/70 font-semibold">Review Request</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E]/30 flex items-center justify-center shrink-0">
                <FiFileText className="w-7 h-7 text-[#C9A96E]" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white">
                  {loading ? 'Loading...' : request?.productName ?? 'Request Detail'}
                </h1>
                <p className="text-[#9CA3AF] text-sm mt-1">
                  Review product details and make your decision
                </p>
              </div>
            </div>
            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/15 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <FiArrowLeft className="w-3.5 h-3.5" /> Back to Requests
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-5 gap-6 animate-pulse">
            <div className="col-span-3 space-y-4">
              <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">
                <div className="aspect-video bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-1/4" />
                  <div className="h-6 bg-gray-100 rounded-full w-2/3" />
                  <div className="h-4 bg-gray-100 rounded-full w-1/3" />
                </div>
              </div>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="bg-white border border-[#E8E0D5] rounded-2xl p-6 space-y-3">
                <div className="h-5 bg-gray-100 rounded-full w-1/3" />
                <div className="h-10 bg-gray-100 rounded-xl w-full" />
                <div className="h-20 bg-gray-100 rounded-xl w-full" />
                <div className="h-10 bg-gray-100 rounded-xl w-full" />
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="py-20 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center">
              <FiXCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-[#1C1F2E] font-bold text-lg">{error}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRequest}
                className="inline-flex items-center gap-2 bg-[#1C1F2E] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#2E3452] transition-colors"
              >
                <FiRefreshCw className="w-4 h-4" /> Retry
              </button>
              <Link
                to="/admin/requests"
                className="inline-flex items-center gap-2 border border-[#E8E0D5] text-[#6B6560] text-sm font-bold px-5 py-2.5 rounded-full hover:border-[#1C1F2E] hover:text-[#1C1F2E] transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" /> Back
              </Link>
            </div>
          </div>
        )}

        {/* TWO-COLUMN LAYOUT */}
        {!loading && !error && request && (
          <div className="grid grid-cols-5 gap-6">

            {/* ── LEFT COL ───────────────────────────────────── */}
            <div className="col-span-3">
              <div className="bg-white border border-[#E8E0D5] rounded-2xl overflow-hidden">

                {/* Image carousel */}
                <div className={`relative bg-gradient-to-br ${gradient}`} style={{ aspectRatio: '16/9' }}>
                  {hasImage ? (
                    <>
                      <img
                        src={request.imageUrls[imgIndex]}
                        alt={request.productName}
                        className="w-full h-full object-cover"
                      />
                      {request.imageUrls.length > 1 && (
                        <>
                          <button
                            onClick={() => setImgIndex(i => i === 0 ? request.imageUrls.length - 1 : i - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <FiChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setImgIndex(i => i === request.imageUrls.length - 1 ? 0 : i + 1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <FiChevronRight className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {request.imageUrls.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setImgIndex(i)}
                                className={`h-2 rounded-full transition-all ${i === imgIndex ? 'bg-white w-4' : 'bg-white/50 w-2'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl select-none">{emoji}</span>
                    </div>
                  )}

                  {/* Request type badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
                      request.requestType === 'DISPUTE'
                        ? 'bg-[#C9A96E] text-white'
                        : 'bg-[#1C1F2E] text-[#C9A96E]'
                    }`}>
                      {request.requestType === 'DISPUTE' ? 'Dispute' : 'New Listing'}
                    </span>
                  </div>
                </div>

                {/* Product info */}
                <div className="p-6 space-y-4">

                  <div className="flex items-center justify-between">
                    <p className="text-[#C9A96E] text-xs font-extrabold uppercase tracking-widest">
                      {request.category?.replace(/_/g, ' ')}
                    </p>
                    {request.llmConfidence && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        request.llmConfidence === 'HIGH'
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : request.llmConfidence === 'MEDIUM'
                          ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                          : 'bg-red-50 text-red-500 border-red-200'
                      }`}>
                        {request.llmConfidence} Confidence
                      </span>
                    )}
                  </div>

                  <h2 className="text-[#1C1F2E] font-extrabold text-2xl leading-snug">
                    {request.productName}
                  </h2>

                  {request.brand && (
                    <p className="text-[#6B6560] text-sm">
                      Brand: <span className="font-semibold text-[#1C1F2E]">{request.brand}</span>
                    </p>
                  )}

                  {request.condition && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#6B6560] text-sm">Condition:</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        request.condition === 'NEW'
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : request.condition === 'USED'
                          ? 'bg-amber-50 text-amber-600 border-amber-200'
                          : request.condition === 'REFURBISHED'
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {request.condition}
                      </span>
                      {request.conditionGrade && (
                        <span className="text-xs text-[#6B6560] font-medium bg-[#FAF8F5] border border-[#E8E0D5] px-2 py-0.5 rounded-full">
                          Grade: {request.conditionGrade}
                        </span>
                      )}
                      {request.conditionNotes && request.conditionNotes.trim() !== '' && (
                        <span className="text-[#6B6560] text-xs italic">
                          "{request.conditionNotes}"
                        </span>
                      )}
                    </div>
                  )}

                  {/* Seller row */}
                  <div className="flex items-center gap-3 p-4 bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl">
                    {request.sellerProfilePictureUrl ? (
                      <img
                        src={request.sellerProfilePictureUrl}
                        alt={request.sellerName}
                        className="w-12 h-12 rounded-full object-cover border border-[#E8E0D5] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
                        <span className="text-[#C9A96E] font-bold text-sm">
                          {request.sellerName?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-[#1C1F2E] font-semibold text-sm">{request.sellerName}</p>
                      <p className="text-[#6B6560] text-xs">{request.sellerEmail}</p>
                    </div>
                  </div>

                  {/* Routing reason — NEW_LISTING only */}
                  {request.requestType === 'NEW_LISTING' && routingReason && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <FiAlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <p className="text-amber-700 text-sm font-medium">{routingReason}</p>
                    </div>
                  )}

                  <hr className="border-[#E8E0D5]" />

                  {/* Pricing grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#FDF6EC] border border-[#C9A96E]/30 rounded-xl p-4 text-center">
                      <p className="text-[#C9A96E] text-xs font-semibold uppercase tracking-wide mb-1">AI Suggested</p>
                      <p className="text-[#1C1F2E] font-extrabold text-2xl">
                        ${request.suggestedPrice?.toFixed(2) ?? 'N/A'}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-4 text-center">
                      <p className="text-[#9CA3AF] text-xs font-medium mb-1">ML Baseline</p>
                      <p className="text-[#1C1F2E] font-extrabold text-xl">
                        ${request.mlBaselinePrice?.toFixed(2) ?? 'N/A'}
                      </p>
                    </div>
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-4 text-center">
                      <p className="text-[#9CA3AF] text-xs font-medium mb-1 flex items-center justify-center gap-1">
                        Market Range
                        <span className="bg-blue-50 text-blue-500 border border-blue-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      </p>
                      <p className="text-[#1C1F2E] font-bold text-sm leading-snug">
                        {request.marketPriceMin && request.marketPriceMax
                          ? `$${request.marketPriceMin} – $${request.marketPriceMax}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  {request.reasoning && request.reasoning !== 'LLM unavailable' && (
                    <div className="bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl p-4 space-y-2">
                      <p className="text-[#6B6560] text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                        🤖 AI Reasoning
                      </p>
                      <p className="text-[#1C1F2E] text-sm leading-relaxed">
                        {request.reasoning}
                      </p>
                    </div>
                  )}

                  {/* Dispute seller card */}
                  {request.requestType === 'DISPUTE' && request.sellerPrice && (
                    <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/30 rounded-xl p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <FiMessageSquare className="w-4 h-4 text-[#C9A96E] shrink-0" />
                        <p className="text-[#C9A96E] font-bold text-sm">Seller's Dispute</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#6B6560] text-xs">Seller's proposed price</p>
                        <p className="text-[#1C1F2E] font-extrabold text-lg">
                          ${request.sellerPrice.toFixed(2)}
                        </p>
                      </div>
                      {request.sellerReasoning && (
                        <div className="bg-white border border-[#E8E0D5] rounded-lg p-3">
                          <p className="text-[#6B6560] text-xs font-medium mb-1">Seller's reasoning</p>
                          <p className="text-[#1C1F2E] text-sm leading-relaxed">
                            {request.sellerReasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* ── RIGHT COL ──────────────────────────────────── */}
            <div className="col-span-2 sticky top-6 self-start">

              {/* Success state */}
              {decision && (
                <div className="bg-white border border-[#E8E0D5] rounded-2xl p-8 flex flex-col items-center text-center gap-5">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    decision === 'APPROVED'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {decision === 'APPROVED'
                      ? <FiCheckCircle className="w-8 h-8 text-green-500" />
                      : <FiXCircle className="w-8 h-8 text-red-400" />
                    }
                  </div>
                  <div>
                    <p className="text-[#1C1F2E] font-extrabold text-xl">
                      {decision === 'APPROVED' ? 'Request Approved' : 'Request Rejected'}
                    </p>
                    <p className="text-[#6B6560] text-sm mt-2">
                      {decision === 'APPROVED'
                        ? 'Product is now live on the marketplace.'
                        : 'Product has been rejected.'}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[#9CA3AF]">
                      <FiMail className="w-3.5 h-3.5" />
                      Seller has been notified by email automatically
                    </div>
                  </div>
                  <Link
                    to="/admin/requests"
                    className="inline-flex items-center gap-2 bg-[#1C1F2E] hover:bg-[#2E3452] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Back to Requests
                  </Link>
                </div>
              )}

              {/* Decision forms */}
              {!decision && (
                <div className="space-y-4">

                  {/* Request type badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                      request.requestType === 'DISPUTE'
                        ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/30'
                        : 'bg-[#1C1F2E]/5 text-[#1C1F2E] border-[#1C1F2E]/20'
                    }`}>
                      {request.requestType === 'DISPUTE' ? 'Dispute Review' : 'New Listing Review'}
                    </span>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex items-center bg-white border border-[#E8E0D5] rounded-2xl p-1 gap-1">
                    <button
                      onClick={() => { setActiveDecisionTab('APPROVE'); setApproveError(null) }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        activeDecisionTab === 'APPROVE'
                          ? 'bg-[#1C1F2E] text-white shadow-sm'
                          : 'text-[#6B6560] hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => { setActiveDecisionTab('REJECT'); setRejectError(null) }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        activeDecisionTab === 'REJECT'
                          ? 'bg-red-700 text-white shadow-sm'
                          : 'text-[#6B6560] hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <FiXCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>

                  {/* APPROVE TAB */}
                  {activeDecisionTab === 'APPROVE' && (
                    <div className="bg-white border border-[#C9A96E]/30 rounded-2xl p-6 space-y-4">
                      <div>
                        <p className="text-[#1C1F2E] font-bold text-base">Set Final Price</p>
                        <p className="text-[#6B6560] text-xs mt-1">
                          Approve this product and set the price it goes live at.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1C1F2E] mb-1.5">
                          Final Approved Price <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E9590] font-semibold text-sm pointer-events-none">$</span>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={approvedPrice}
                            onChange={e => { setApprovedPrice(e.target.value); setApproveError(null) }}
                            placeholder="0.00"
                            className={`w-full bg-[#FAF8F5] border rounded-xl pl-8 pr-4 py-3 text-sm text-[#1C1F2E] font-semibold focus:outline-none transition-colors ${
                              approveError ? 'border-red-400' : 'border-[#E8E0D5] focus:border-green-400'
                            }`}
                          />
                        </div>
                        {approveError && (
                          <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <FiAlertCircle className="w-3 h-3 shrink-0" /> {approveError}
                          </p>
                        )}
                      </div>

                      {request.suggestedPrice && (
                        <button
                          type="button"
                          onClick={() => setApprovedPrice(String(request.suggestedPrice))}
                          className="text-xs text-[#C9A96E] hover:underline font-medium"
                        >
                          Reset to AI suggested (${request.suggestedPrice.toFixed(2)})
                        </button>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[#1C1F2E] mb-1.5">
                          Note to Seller <span className="text-[#9CA3AF] font-normal">(optional)</span>
                        </label>
                        <textarea
                          value={adminNote}
                          onChange={e => setAdminNote(e.target.value)}
                          placeholder="Add a note for the seller (included in approval email)..."
                          rows={3}
                          maxLength={500}
                          className="w-full bg-[#FAF8F5] border border-[#E8E0D5] rounded-xl px-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none focus:border-green-400 transition-colors resize-none"
                        />
                        <p className="text-[#9CA3AF] text-xs mt-1 text-right">{adminNote.length}/500</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-[#FAF8F5] rounded-lg px-3 py-2">
                        <FiMail className="w-3.5 h-3.5 shrink-0" />
                        Seller will receive an approval email automatically
                      </div>

                      <button
                        onClick={() => {
                          if (!approvedPrice || isNaN(Number(approvedPrice)) || Number(approvedPrice) <= 0) {
                            setApproveError('Please enter a valid positive price')
                            return
                          }
                          setConfirmModal({ type: 'APPROVE' })
                        }}
                        disabled={approveLoading}
                        className="w-full bg-[#1C1F2E] hover:bg-[#2E3452] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {approveLoading
                          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                          : <><FiCheckCircle className="w-4 h-4" /> Approve & Set Price</>
                        }
                      </button>
                    </div>
                  )}

                  {/* REJECT TAB */}
                  {activeDecisionTab === 'REJECT' && (
                    <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
                      <div>
                        <p className="text-[#1C1F2E] font-bold text-base">Reject Listing</p>
                        <p className="text-[#6B6560] text-xs mt-1">
                          The seller will be notified with your reason and a suggested price range.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1C1F2E] mb-1.5">
                          Rejection Reason <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={e => { setRejectionReason(e.target.value); setRejectError(null) }}
                          placeholder="Explain why this listing is being rejected (min 5 characters)..."
                          rows={4}
                          maxLength={500}
                          className={`w-full bg-[#FAF8F5] border rounded-xl px-4 py-3 text-sm text-[#1C1F2E] placeholder-[#9E9590] focus:outline-none transition-colors resize-none ${
                            rejectError ? 'border-red-400' : 'border-[#E8E0D5] focus:border-red-400'
                          }`}
                        />
                        <div className="flex items-center justify-between mt-1">
                          {rejectError
                            ? <p className="text-red-400 text-xs flex items-center gap-1"><FiAlertCircle className="w-3 h-3 shrink-0" /> {rejectError}</p>
                            : <span />
                          }
                          <p className="text-[#9CA3AF] text-xs">{rejectionReason.length}/500</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] bg-[#FAF8F5] rounded-lg px-3 py-2">
                        <FiMail className="w-3.5 h-3.5 shrink-0" />
                        Seller will receive a rejection email with suggested price range (±15%)
                      </div>

                      <button
                        onClick={() => {
                          if (!rejectionReason.trim()) {
                            setRejectError('Rejection reason is required')
                            return
                          }
                          if (rejectionReason.trim().length < 5) {
                            setRejectError('Reason must be at least 5 characters')
                            return
                          }
                          setConfirmModal({ type: 'REJECT' })
                        }}
                        disabled={rejectLoading}
                        className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {rejectLoading
                          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                          : <><FiXCircle className="w-4 h-4" /> Reject Listing</>
                        }
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* ── CONFIRMATION MODAL ───────────────────────────────── */}
      {confirmModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
              confirmModal.type === 'APPROVE'
                ? 'bg-[#C9A96E]/10 border border-[#C9A96E]/30'
                : 'bg-red-50 border border-red-200'
            }`}>
              {confirmModal.type === 'APPROVE'
                ? <FiCheckCircle className="w-7 h-7 text-[#C9A96E]" />
                : <FiXCircle className="w-7 h-7 text-red-400" />
              }
            </div>

            <div className="text-center space-y-2">
              <p className="text-[#1C1F2E] font-extrabold text-lg">
                {confirmModal.type === 'APPROVE' ? 'Approve this product?' : 'Reject this product?'}
              </p>
              {confirmModal.type === 'APPROVE' ? (
                <p className="text-[#6B6560] text-sm leading-relaxed">
                  <span className="font-semibold text-[#1C1F2E]">{request.productName}</span>
                  {' '}will go live at{' '}
                  <span className="font-extrabold text-green-600">${Number(approvedPrice).toFixed(2)}</span>
                  . The seller will be notified by email.
                </p>
              ) : (
                <p className="text-[#6B6560] text-sm leading-relaxed">
                  <span className="font-semibold text-[#1C1F2E]">{request.productName}</span>
                  {' '}will be rejected. The seller will receive your reason by email.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 bg-[#FAF8F5] border border-[#E8E0D5] hover:border-[#1C1F2E] text-[#6B6560] hover:text-[#1C1F2E] font-bold py-2.5 rounded-xl transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmModal(null)
                  if (confirmModal.type === 'APPROVE') handleApprove()
                  else handleReject()
                }}
                className={`flex-1 font-bold py-2.5 rounded-xl transition-colors text-sm text-white ${
                  confirmModal.type === 'APPROVE'
                    ? 'bg-[#1C1F2E] hover:bg-[#2E3452]'
                    : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                {confirmModal.type === 'APPROVE' ? 'Yes, Approve' : 'Yes, Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminRequestDetail
