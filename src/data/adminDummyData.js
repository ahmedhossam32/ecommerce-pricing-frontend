export const categoryEmojis = {
  telephony:                '📱',
  audio:                    '🎧',
  computers:                '💻',
  watches_gifts:            '⌚',
  fashion_shoes:            '👟',
  fashion_bags_accessories: '👜',
  computers_accessories:    '🖱️',
  consoles_games:           '🎮',
  health_beauty:            '💄',
  sports_leisure:           '⚽',
  furniture_decor:          '🛋️',
  default:                  '📦',
}

export const categoryGradients = {
  telephony:                'from-blue-50 via-indigo-50 to-slate-100',
  audio:                    'from-purple-50 via-fuchsia-50 to-pink-50',
  computers:                'from-slate-50 via-gray-50 to-zinc-100',
  watches_gifts:            'from-amber-50 via-yellow-50 to-orange-50',
  fashion_shoes:            'from-orange-50 via-red-50 to-rose-50',
  fashion_bags_accessories: 'from-rose-50 via-pink-50 to-fuchsia-50',
  computers_accessories:    'from-cyan-50 via-sky-50 to-blue-50',
  consoles_games:           'from-green-50 via-emerald-50 to-teal-50',
  health_beauty:            'from-pink-50 via-rose-50 to-red-50',
  sports_leisure:           'from-lime-50 via-green-50 to-emerald-50',
  furniture_decor:          'from-stone-50 via-amber-50 to-yellow-50',
  default:                  'from-[#FAF8F5] via-[#F5F0EA] to-[#EDE5D8]',
}

export const getRoutingReason = (request) => {
  const { suggestedPrice, marketPriceMin, marketPriceMax, requestType } = request
  if (requestType === 'DISPUTE') return null
  const isOutOfBounds =
    suggestedPrice != null &&
    marketPriceMin != null &&
    marketPriceMax != null &&
    (suggestedPrice < marketPriceMin || suggestedPrice > marketPriceMax)
  return isOutOfBounds ? 'Price outside category bounds' : 'Low AI confidence'
}
