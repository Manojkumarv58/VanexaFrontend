import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiArrowRight } from 'react-icons/fi';

const LINKS = {
  Shop:    ['All Products', 'Men', 'Women', 'Electronics', 'Accessories', 'New Arrivals'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact Us'],
  Support: ['Help Center', 'Track Order', 'Returns', 'Shipping Info', 'Privacy Policy'],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-0">
      {/* Top CTA */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-gray-400 text-sm">Get exclusive deals, new arrivals & style tips.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 flex-1 md:w-72 focus-within:border-indigo-500 transition-colors">
                <FiMail size={15} className="text-gray-500 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-2xl hover:bg-indigo-500 transition-colors"
              >
                Subscribe <FiArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <span className="text-xl font-black text-white">Vanexa</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-6 max-w-xs">
              Premium shopping experience for the modern generation. Quality products, seamless delivery, and unmatched style.
            </p>
            <div className="flex items-center gap-2">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <Link
                      to={title === 'Shop' ? `/shop?category=${item.toLowerCase().replace(' ', '-')}` : '#'}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 Vanexa Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(t => (
              <a key={t} href="#" className="hover:text-gray-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
