import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import { categoryEmojis, categoryGradients, getRoutingReason } from '../../data/adminDummyData'

function AdminRequestRow({ request }) {
  const navigate = useNavigate()
  const {
    requestId, productName, category, brand,
    sellerName, sellerEmail, sellerProfilePictureUrl,
    suggestedPrice, sellerPrice, requestType,
    llmConfidence, imageUrls,
  } = request

  const emoji = categoryEmojis[category] || categoryEmojis.default
  const gradient = categoryGradients[category] || categoryGradients.default
  const hasImage = imageUrls?.length > 0
  const routingReason = getRoutingReason(request)
  const sellerInitial = sellerName?.[0]?.toUpperCase() || '?'

  const rowBg =
    requestType !== 'DISPUTE' && llmConfidence === 'LOW'
      ? 'bg-red-50/30 border-red-200 hover:border-red-300'
      : requestType === 'DISPUTE'
      ? 'bg-[#FDF6EC] border-[#E8D5A3] hover:border-[#C9A96E]'
      : 'bg-white border-[#E8E0D5] hover:border-[#C9A96E]/50'

  return (
    <div
      onClick={() => navigate(`/admin/requests/${requestId}`)}
      className={`relative overflow-hidden rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer group border ${rowBg}`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${
        requestType === 'DISPUTE' ? 'bg-[#C9A96E]' : 'bg-[#1C1F2E]/30'
      }`} />

      {/* Thumbnail */}
      <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {hasImage ? (
          <img src={imageUrls[0]} alt={productName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">{emoji}</span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="text-[#1C1F2E] font-bold text-sm truncate group-hover:text-[#2E3452] transition-colors">
          {productName}
        </p>
        <p className="text-[#9E9590] text-xs mt-0.5">
          {brand ?? 'Unknown'} · {category?.replace(/_/g, ' ')}
        </p>

        {request.condition && (
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${
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
        )}

        {/* Seller row */}
        <div className="flex items-center gap-2 mt-1.5">
          {sellerProfilePictureUrl ? (
            <img
              src={sellerProfilePictureUrl}
              alt={sellerName}
              className="w-4 h-4 rounded-full object-cover border border-[#E8E0D5] shrink-0"
            />
          ) : (
            <div className="w-4 h-4 rounded-full bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
              <span className="text-[#C9A96E] text-[8px] font-bold">{sellerInitial}</span>
            </div>
          )}
          <p className="text-[#9E9590] text-xs truncate">{sellerEmail}</p>
        </div>

        {/* Routing reason or dispute price */}
        <div className="mt-1.5">
          {requestType === 'DISPUTE' && sellerPrice ? (
            <p className="text-[#C9A96E] text-xs font-medium">
              Seller wants ${sellerPrice.toFixed(2)}
            </p>
          ) : (
            <p className="text-[#6B6560] text-xs flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3 text-[#C9A96E] shrink-0" />
              {routingReason}
            </p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 shrink-0">

        {/* Badges */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            requestType === 'DISPUTE'
              ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/30'
              : 'bg-[#1C1F2E]/5 text-[#1C1F2E] border-[#1C1F2E]/20'
          }`}>
            {requestType === 'DISPUTE' ? 'Dispute' : 'New Listing'}
          </span>
          {llmConfidence && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              llmConfidence === 'HIGH'   ? 'bg-green-50 text-green-600 border-green-200' :
              llmConfidence === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                           'bg-red-50 text-red-500 border-red-200'
            }`}>
              {llmConfidence}
            </span>
          )}
        </div>

        {/* Price */}
        <p className="text-[#1C1F2E] font-extrabold text-sm">
          ${suggestedPrice?.toFixed(2) ?? 'N/A'}
        </p>
        <p className="text-[#9E9590] text-[10px]">AI suggested</p>

        {/* Arrow */}
        <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E8E0D5] group-hover:bg-[#1C1F2E] group-hover:border-[#1C1F2E] flex items-center justify-center transition-all duration-200">
          <FiArrowRight className="w-3.5 h-3.5 text-[#6B6560] group-hover:text-white transition-colors" />
        </div>

      </div>
    </div>
  )
}

export default AdminRequestRow
