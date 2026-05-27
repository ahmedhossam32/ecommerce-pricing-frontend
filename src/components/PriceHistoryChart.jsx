import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { format } from 'date-fns'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1F2E] border border-[#2E3452] rounded-xl px-4 py-3 shadow-xl">
        <p className="text-[#C9A96E] font-bold text-sm">${payload[0].value?.toFixed(2)}</p>
        <p className="text-gray-400 text-xs mt-0.5">{payload[0].payload.event}</p>
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
    )
  }
  return null
}

function PriceHistoryChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[#6B6560] text-sm">
        No price history available
      </div>
    )
  }

  const data = history.map(h => ({
    ...h,
    date: format(new Date(h.date), 'MMM d'),
    price: h.price,
  }))

  const prices = data.map(d => d.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
  const padding = (maxPrice - minPrice) * 0.3 || 50
  const yMin = Math.floor((minPrice - padding) / 50) * 50
  const yMax = Math.ceil((maxPrice + padding) / 50) * 50

  const getEventColor = (event) => {
    if (!event) return '#C9A96E'
    const e = event.toLowerCase()
    if (e.includes('seller'))   return '#C9A96E'
    if (e.includes('approved')) return '#3B82F6'
    if (e.includes('override')) return '#F97316'
    if (e.includes('rejected')) return '#EF4444'
    return '#C9A96E'
  }

  const getEventBadge = (event) => {
    if (!event) return null
    const e = event.toLowerCase()
    if (e.includes('seller'))   return { label: 'Seller',   color: 'bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/20' }
    if (e.includes('approved')) return { label: 'Admin',    color: 'bg-blue-50 text-blue-600 border-blue-200' }
    if (e.includes('override')) return { label: 'Override', color: 'bg-orange-50 text-orange-600 border-orange-200' }
    if (e.includes('rejected')) return { label: 'Rejected', color: 'bg-red-50 text-red-500 border-red-200' }
    return null
  }

  return (
    <div>
      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Lowest', value: `$${minPrice.toFixed(0)}`, color: 'text-green-600' },
          { label: 'Average', value: `$${avgPrice.toFixed(0)}`, color: 'text-[#C9A96E]' },
          { label: 'Highest', value: `$${maxPrice.toFixed(0)}`, color: 'text-[#1C1F2E]' },
        ].map((s, i) => (
          <div key={i} className="bg-[#FAF8F5] rounded-xl p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[#6B6560] text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6B6560' }}
            axisLine={{ stroke: '#E8E0D5' }}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#6B6560' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${v.toLocaleString()}`}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgPrice}
            stroke="#C9A96E"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#C9A96E"
            strokeWidth={2.5}
            dot={{ fill: '#C9A96E', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#1C1F2E', stroke: '#C9A96E', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Events list */}
      <div className="mt-4 space-y-2">
        {history.map((h, i) => (
          <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-[#E8E0D5] last:border-0">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: getEventColor(h.event) }}
              />
              <span className="text-[#6B6560]">{h.event}</span>
              {(() => {
                const badge = getEventBadge(h.event)
                return badge ? (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge.color} ml-1.5`}>
                    {badge.label}
                  </span>
                ) : null
              })()}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#1C1F2E] font-semibold">${h.price?.toFixed(2)}</span>
              <span className="text-[#6B6560]">{format(new Date(h.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PriceHistoryChart
