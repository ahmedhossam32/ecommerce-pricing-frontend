import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiClock, FiCheckCircle, FiXCircle, FiFileText, FiArrowRight } from 'react-icons/fi'
import { toast } from 'react-toastify'

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

export default function SellerProductRow({ product }) {
  const navigate = useNavigate()
  const cfg = STATUS_CONFIG[product.status] ?? STATUS_CONFIG.DRAFT
  const hasImage = product.imageUrls?.length > 0
  const emoji = categoryEmojis[product.category] ?? categoryEmojis.default
  const isClickable = product.status === 'DRAFT' || product.status === 'REJECTED'

  const handleClick = () => {
    if (product.status === 'DRAFT') {
      navigate(`/seller/products/${product.productId}/decision`)
    } else if (product.status === 'REJECTED') {
      toast.info('You can relist this product.')
      navigate('/seller/products/new')
    }
  }

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`product-row relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] group
        ${product.status === 'PENDING_REVIEW' ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300' :
          product.status === 'REJECTED'       ? 'border-red-200 bg-red-50/30 hover:border-red-300' :
          'border-[#E8E0D5] bg-white hover:border-[#C9A96E]/40'}
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full
        ${product.status === 'LIVE'           ? 'bg-green-400' :
          product.status === 'PENDING_REVIEW' ? 'bg-amber-400' :
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
        {(product.status === 'DRAFT' || product.status === 'PENDING_REVIEW') && (
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
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <cfg.icon size={11} />
          {cfg.label}
        </span>
      </div>
    </div>
  )
}
