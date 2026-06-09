import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiClock, FiCheckCircle, FiXCircle, FiFileText, FiArrowRight, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { deleteSellerProduct } from '../../api/seller'

const STATUS_CONFIG = {
  LIVE:           { label: 'Live',           bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  icon: FiCheckCircle },
  PENDING_REVIEW: { label: 'Pending Review', bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  icon: FiClock       },
  DRAFT:          { label: 'Action Needed',  bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200',   icon: FiFileText    },
  REJECTED:       { label: 'Rejected',       bg: 'bg-red-50',    text: 'text-red-500',    border: 'border-red-200',    icon: FiXCircle     },
}

const categoryEmojis = {
  telephony:                '📱',
  audio:                    '🎧',
  computers:                '💻',
  watches_gifts:            '⌚',
  fashion_shoes:            '👟',
  fashion_bags_accessories: '👜',
  consoles_games:           '🎮',
  health_beauty:            '💄',
  default:                  '📦',
}

export default function SellerProductRow({ product, onDelete }) {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const cfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.DRAFT
  const hasImage = product.imageUrls?.length > 0
  const emoji = categoryEmojis[product.category] ?? categoryEmojis.default
  const isClickable = product.status === 'DRAFT' || product.status === 'REJECTED' || product.status === 'LIVE'

  const handleClick = () => {
    if (product.status === 'DRAFT') {
      navigate(`/seller/products/${product.productId}/decision`)
    } else if (product.status === 'REJECTED') {
      toast.info('You can relist this product.')
      navigate('/seller/products/new')
    } else if (product.status === 'LIVE') {
      navigate(`/products/${product.productId}`)
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowConfirm(true)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteSellerProduct(product.productId)
      toast.success('Product deleted')
      setShowConfirm(false)
      onDelete?.(product.productId)
    } catch {
      toast.error('Failed to delete product')
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        onClick={isClickable ? handleClick : undefined}
        className={`product-row relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] group
          ${product.status === 'PENDING_REVIEW' ? 'border-[#C9A96E]/20 bg-[#C9A96E]/5 hover:border-[#C9A96E]/40' :
            product.status === 'REJECTED'       ? 'border-red-200 bg-red-50/30 hover:border-red-300' :
            'border-[#E8E0D5] bg-white hover:border-[#C9A96E]/40'}
          ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {/* Left accent bar */}
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full
          ${product.status === 'LIVE'           ? 'bg-green-400' :
            product.status === 'PENDING_REVIEW' ? 'bg-[#C9A96E]' :
            product.status === 'REJECTED'       ? 'bg-red-400' :
            'bg-gray-300'}`} />

        {/* Thumbnail */}
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#E8E0D5] shadow-sm shrink-0 bg-[#F5F3F0] flex items-center justify-center group-hover:border-[#C9A96E]/30 transition-all">
          {hasImage ? (
            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl select-none">{emoji}</span>
          )}
        </div>

        {/* Middle */}
        <div className="flex-1 min-w-0">
          <p className="text-[#1C1F2E] font-bold text-sm leading-snug truncate">{product.name}</p>
          <p className="text-[#9E9590] text-xs mt-0.5">
            {product.brand} · {product.category?.replace(/_/g, ' ')}
          </p>
          {product.status === 'DRAFT' && (
            <span className="text-[#C9A96E] text-xs font-semibold flex items-center gap-1 mt-1">
              <FiArrowRight size={11} /> Price decision needed — click to review
            </span>
          )}
          {product.status === 'LIVE' && (
            <span className="text-green-500 text-xs font-semibold flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <FiArrowRight size={11} /> View public listing
            </span>
          )}
          {product.status === 'REJECTED' && (
            <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3 shrink-0" />
              Rejected — click to relist
            </p>
          )}
          {product.status === 'PENDING_REVIEW' && (
            <p className="text-amber-500 text-[11px] mt-1 flex items-center gap-1">
              <FiClock className="w-3 h-3 shrink-0" />
              Under admin review — no action needed
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {product.status === 'LIVE' && (
            <p className="text-[#1C1F2E] text-base font-extrabold">${product.price?.toFixed(2)}</p>
          )}
          {(product.status === 'DRAFT' || product.status === 'PENDING_REVIEW') && product.suggestedPrice && (
            <p className="text-[#9CA3AF] text-sm font-medium">Suggested: ${product.suggestedPrice?.toFixed(2)}</p>
          )}
          {product.status === 'REJECTED' && (
            <p className="text-[#9CA3AF] text-sm font-medium line-through">${product.suggestedPrice?.toFixed(2)}</p>
          )}
          {product.status === 'DRAFT' && (
            <button className="text-xs font-bold text-white bg-[#C9A96E] hover:bg-[#b8935a] px-3 py-1.5 rounded-lg transition-all shrink-0">
              Review →
            </button>
          )}

          {/* Delete button — visible on row hover */}
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete product"
          >
            <FiTrash2 size={14} />
          </button>

          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <cfg.icon size={11} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => { if (!deleting) setShowConfirm(false) }}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-[#1C1F2E] text-base text-center mb-2">Delete Product?</h3>
            <p className="text-sm text-[#6B6560] text-center mb-5 leading-relaxed">
              This will remove your listing. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 border border-[#E8E0D5] text-[#6B6560] hover:border-[#C9A96E] px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
