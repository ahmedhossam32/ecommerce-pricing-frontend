import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

function BackButton({ label = 'Back' }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-[#6B6560] hover:text-[#1C1F2E] text-sm font-medium transition-colors group"
    >
      <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  )
}

export default BackButton
