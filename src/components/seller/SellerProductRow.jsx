import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiClock } from 'react-icons/fi'
import { toast } from 'react-toastify'

const STATUS_CONFIG = {
  LIVE:           { label: 'Live',           bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200'  },
  PENDING_REVIEW: { label: 'Pending Review', bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
  DRAFT:          { label: 'Action Needed',  bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200'   },
  REJECTED:       { label: 'Rejected',       bg: 'bg-red-50',    text: 'text-red-500',    border: 'border-red-200'    },
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

  const hoverClass = {
    DRAFT:          'hover:border-blue-300 hover:shadow-md cursor-pointer',
    REJECTED:       'hover:border-red-200 hover:shadow-sm cursor-pointer',
    LIVE:           'hover:border-green-200 hover:shadow-sm',
    PENDING_REVIEW: 'hover:border-yellow-200 cursor-default',
  }[product.status]

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
      onClick={handleClick}
      className={`bg-white border border-[#E8E0D5] rounded-2xl p-3 flex items-center gap-3 transition-all duration-200 ${hoverClass}`}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E8E0D5] shrink-0 flex items-center justify-center">
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
          <p className="text-blue-500 text-[11px] mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-3 h-3 shrink-0" />
            Price decision needed — click to review
          </p>
        )}
        {product.status === 'REJECTED' && (
          <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-3 h-3 shrink-0" />
            Rejected — click to relist
          </p>
        )}
        {product.status === 'PENDING_REVIEW' && (
          <p className="text-yellow-500 text-[11px] mt-1 flex items-center gap-1">
            <FiClock className="w-3 h-3 shrink-0" />
            Under admin review — no action needed
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        {product.status === 'LIVE' && (
          <p className="text-[#1C1F2E] font-extrabold text-base">${product.price?.toFixed(2)}</p>
        )}
        {(product.status === 'DRAFT' || product.status === 'PENDING_REVIEW') && (
          <p className="text-[#6B6560] text-sm">Suggested: ${product.suggestedPrice?.toFixed(2)}</p>
        )}
        {product.status === 'REJECTED' && (
          <p className="text-[#9E9590] text-sm line-through">${product.suggestedPrice?.toFixed(2)}</p>
        )}
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          {cfg.label}
        </span>
      </div>
    </div>
  )
}
