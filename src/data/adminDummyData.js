import catPhones from '../assets/cat-phones1.jpg'
import catComputers from '../assets/cat-computers.jpg'
import catFashion from '../assets/cat-fashion2.jpg'
import catWatches from '../assets/cat-watches1.jpg'
import productHeadphones from '../assets/product-headphones.jpg'
import productHeadphones1 from '../assets/product-headphones1.jpg'
import productPs5 from '../assets/product-ps5.jpg'
import productBag from '../assets/product-bag.jpg'
import productWatch from '../assets/product-watch.jpg'

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

export const DUMMY_REQUESTS = [
  {
    requestId: 1,
    productId: 101,
    productName: 'Rolex Submariner Date',
    category: 'watches_gifts',
    brand: 'Rolex',
    sellerName: 'Ahmed Hassan',
    sellerEmail: 'ahmed@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 7500.00,
    sellerPrice: null,
    sellerReasoning: null,
    marketPriceMin: 6800.00,
    marketPriceMax: 8200.00,
    llmConfidence: 'LOW',
    mlBaselinePrice: 7200.00,
    createdAt: '2026-05-25T10:30:00',
    requestType: 'NEW_LISTING',
    imageUrls: [productWatch, catWatches],
  },
  {
    requestId: 2,
    productId: 102,
    productName: 'Sony WH-1000XM5 Headphones',
    category: 'audio',
    brand: 'Sony',
    sellerName: 'Sara Mohamed',
    sellerEmail: 'sara@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 280.00,
    sellerPrice: 400.00,
    sellerReasoning: 'My pair is brand new sealed in box, purchased 2 weeks ago. Current retail is $399. The AI underpriced this significantly.',
    marketPriceMin: 260.00,
    marketPriceMax: 320.00,
    llmConfidence: 'MEDIUM',
    mlBaselinePrice: 275.00,
    createdAt: '2026-05-25T11:00:00',
    requestType: 'DISPUTE',
    imageUrls: [productHeadphones, productHeadphones1],
  },
  {
    requestId: 3,
    productId: 103,
    productName: 'MacBook Pro 14" M3 Pro',
    category: 'computers',
    brand: 'Apple',
    sellerName: 'Omar Khaled',
    sellerEmail: 'omar@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 1999.00,
    sellerPrice: 2200.00,
    sellerReasoning: 'This model has upgraded 18GB RAM which commands a premium. AI did not account for the spec difference.',
    marketPriceMin: 1900.00,
    marketPriceMax: 2100.00,
    llmConfidence: 'HIGH',
    mlBaselinePrice: 1980.00,
    createdAt: '2026-05-24T14:45:00',
    requestType: 'DISPUTE',
    imageUrls: [catComputers],
  },
  {
    requestId: 4,
    productId: 104,
    productName: 'iPhone 15 Pro Max 256GB',
    category: 'telephony',
    brand: 'Apple',
    sellerName: 'Nour Tarek',
    sellerEmail: 'nour@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 1100.00,
    sellerPrice: null,
    sellerReasoning: null,
    marketPriceMin: 1050.00,
    marketPriceMax: 1200.00,
    llmConfidence: 'LOW',
    mlBaselinePrice: 1080.00,
    createdAt: '2026-05-23T16:20:00',
    requestType: 'NEW_LISTING',
    imageUrls: [catPhones],
  },
  {
    requestId: 5,
    productId: 105,
    productName: 'PlayStation 5 Console',
    category: 'consoles_games',
    brand: 'Sony',
    sellerName: 'Youssef Ali',
    sellerEmail: 'youssef@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 499.00,
    sellerPrice: null,
    sellerReasoning: null,
    marketPriceMin: 450.00,
    marketPriceMax: 550.00,
    llmConfidence: 'LOW',
    mlBaselinePrice: 480.00,
    createdAt: '2026-05-23T12:00:00',
    requestType: 'NEW_LISTING',
    imageUrls: [productPs5],
  },
  {
    requestId: 6,
    productId: 106,
    productName: 'Premium Leather Bag',
    category: 'fashion_bags_accessories',
    brand: 'Gucci',
    sellerName: 'Layla Ibrahim',
    sellerEmail: 'layla@example.com',
    sellerProfilePictureUrl: null,
    suggestedPrice: 950.00,
    sellerPrice: 1050.00,
    sellerReasoning: 'Bag is brand new with tags and authenticity card. Retail price is $1200. AI undervalued significantly.',
    marketPriceMin: 900.00,
    marketPriceMax: 1000.00,
    llmConfidence: 'MEDIUM',
    mlBaselinePrice: 940.00,
    createdAt: '2026-05-23T09:10:00',
    requestType: 'DISPUTE',
    imageUrls: [productBag, catFashion],
  },
]
