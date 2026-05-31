import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiMail, FiPhone } from 'react-icons/fi'
import dynamartLogo from '../assets/dynamartlogo_final.png'
import { useState } from 'react'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-gray-950 border-t border-gray-900 text-gray-400">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1 — Brand Info */}
          <div>
            <div className="mb-4">
              <img
                src={dynamartLogo}
                alt="DynaMart"
                className="h-14 w-auto object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(85%) sepia(30%) saturate(400%) hue-rotate(5deg)' }}
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              A smarter marketplace where every price is AI-verified and fair.
              Buy with confidence. Sell with ease.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <FiMail className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>support@dynamart.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FiPhone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <span>+20 100 000 0000</span>
              </div>
            </div>
          </div>

          {/* Column 2 — Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-6">
              Categories
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Phones & Tablets', to: '/products' },
                { label: 'Computers', to: '/products' },
                { label: 'Fashion', to: '/products' },
                { label: 'Gaming', to: '/products' },
                { label: 'Home & Living', to: '/products' },
                { label: 'Watches & Accessories', to: '/products' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-gray-500 hover:text-[#C9A96E] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Further Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-6">
              Further Info
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Products', to: '/products' },
                { label: 'About DynaMart', to: '/' },
                { label: 'How It Works', to: '/how-it-works' },
                { label: 'FAQs', to: '/' },
                { label: 'Contact Us', to: '/' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-gray-500 hover:text-[#C9A96E] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SOCIAL + NEWSLETTER */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <FiFacebook className="w-4 h-4" />, href: '#' },
                { icon: <FiInstagram className="w-4 h-4" />, href: '#' },
                { icon: <FiTwitter className="w-4 h-4" />, href: '#' },
                { icon: <FiLinkedin className="w-4 h-4" />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 bg-gray-900 border border-gray-800 hover:border-gray-600 hover:text-[#C9A96E] rounded-full flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-3">
              {subscribed ? (
                <p className="text-green-400 text-sm font-medium">
                  ✓ Subscribed! Thanks for joining.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-gray-900 border border-gray-800 focus:border-[#C9A96E] text-white text-sm px-4 py-2.5 rounded-full outline-none w-60 placeholder-gray-600 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-[#C9A96E] hover:bg-[#A07840] text-white text-sm px-5 py-2.5 rounded-full font-semibold transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-center text-gray-600 text-xs">
            © 2026 DynaMart. All rights reserved. | Graduation Project
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
