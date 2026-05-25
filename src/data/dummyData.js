import catPhones from '../assets/cat-phones1.jpg'
import catComputers from '../assets/cat-computers.jpg'
import catFashion from '../assets/cat-fashion2.jpg'
import catWatches from '../assets/cat-watches1.jpg'
import productHeadphones from '../assets/product-headphones.jpg'
import productHeadphones1 from '../assets/product-headphones1.jpg'
import productPs5 from '../assets/product-ps5.jpg'
import productBag from '../assets/product-bag.jpg'
import productWatch from '../assets/product-watch.jpg'

export const DUMMY_PRODUCTS = [
  { productId: 1,  name: 'iPhone 17 Pro Max',          category: 'telephony',                brand: 'Apple',   price: 977,   sellerName: 'Tech Store',      weight: 221,  photosQty: 1, description: 'The latest iPhone with A19 Pro chip and titanium design.',                          createdAt: '2026-05-20T10:00:00.000Z', imageUrls: [catPhones] },
  { productId: 2,  name: 'Sony WH-1000XM5 Headphones', category: 'audio',                    brand: 'Sony',    price: 280,   sellerName: 'Audio World',     weight: 250,  photosQty: 2, description: 'Industry-leading noise canceling with 30-hour battery life.',                    createdAt: '2026-05-19T10:00:00.000Z', imageUrls: [productHeadphones, productHeadphones1] },
  { productId: 3,  name: 'MacBook Pro 14 M3',           category: 'computers',                brand: 'Apple',   price: 1999,  sellerName: 'Apple Store',     weight: 1550, photosQty: 1, description: 'M3 chip with Liquid Retina XDR display and all-day battery.',                   createdAt: '2026-05-18T10:00:00.000Z', imageUrls: [catComputers] },
  { productId: 4,  name: 'Rolex Submariner',            category: 'watches_gifts',            brand: 'Rolex',   price: 7500,  sellerName: 'Luxury Watch Co', weight: 155,  photosQty: 2, description: 'Iconic divers watch waterproof to 300 metres with rotatable bezel.',            createdAt: '2026-05-17T10:00:00.000Z', imageUrls: [productWatch, catWatches] },
  { productId: 5,  name: 'Nike Air Force 1 White',      category: 'fashion_shoes',            brand: 'Nike',    price: 120,   sellerName: 'Sneaker Hub',     weight: 400,  photosQty: 1, description: 'Classic basketball shoe with clean white leather and Air cushioning.',          createdAt: '2026-05-16T10:00:00.000Z', imageUrls: [catFashion] },
  { productId: 6,  name: 'PlayStation 5 Console',       category: 'consoles_games',           brand: 'Sony',    price: 499,   sellerName: 'Game Zone',       weight: 4500, photosQty: 1, description: 'Next-gen gaming with ultra-high speed SSD and ray tracing.',                   createdAt: '2026-05-15T10:00:00.000Z', imageUrls: [productPs5] },
  { productId: 7,  name: 'Samsung Galaxy S25 Ultra',    category: 'telephony',                brand: 'Samsung', price: 850,   sellerName: 'Mobile World',    weight: 205,  photosQty: 1, description: 'Flagship Android phone with S Pen and 200MP camera system.',                   createdAt: '2026-05-14T10:00:00.000Z', imageUrls: [catPhones] },
  { productId: 8,  name: 'Apple Watch Series 10',       category: 'watches_gifts',            brand: 'Apple',   price: 399,   sellerName: 'Tech Store',      weight: 51,   photosQty: 1, description: 'Thinnest Apple Watch ever with advanced health monitoring features.',          createdAt: '2026-05-13T10:00:00.000Z', imageUrls: [catWatches] },
  { productId: 9,  name: 'Premium Leather Bag',         category: 'fashion_bags_accessories', brand: 'Gucci',   price: 320,   sellerName: 'Fashion Hub',     weight: 600,  photosQty: 2, description: 'Handcrafted Italian leather bag with gold hardware and signature lining.',     createdAt: '2026-05-12T10:00:00.000Z', imageUrls: [productBag] },
  { productId: 10, name: 'AirPods Pro 3rd Gen',         category: 'audio',                    brand: 'Apple',   price: 249,   sellerName: 'Tech Store',      weight: 56,   photosQty: 1, description: 'Active noise cancellation with Adaptive Audio and USB-C charging.',           createdAt: '2026-05-11T10:00:00.000Z', imageUrls: [productHeadphones1] },
  { productId: 11, name: 'Adidas Ultraboost 22',        category: 'fashion_shoes',            brand: 'Adidas',  price: 180,   sellerName: 'Sneaker Hub',     weight: 380,  photosQty: 1, description: 'Responsive Boost midsole with Primeknit upper for ultimate comfort.',         createdAt: '2026-05-10T10:00:00.000Z', imageUrls: [catFashion] },
  { productId: 12, name: 'Dyson V15 Vacuum',            category: 'health_beauty',            brand: 'Dyson',   price: 650,   sellerName: 'Home Essentials', weight: 3100, photosQty: 1, description: 'Laser dust detection with intelligent suction auto-adjustment.',              createdAt: '2026-05-09T10:00:00.000Z', imageUrls: [] },
]

export const preloadImages = () => {
  DUMMY_PRODUCTS.forEach(p => {
    p.imageUrls.forEach(src => {
      const img = new window.Image()
      img.src = src
    })
  })
}

preloadImages()
