import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowRight, FiShoppingBag, FiTruck, FiShield,
  FiRefreshCw, FiStar, FiZap, FiTrendingUp,
} from 'react-icons/fi';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = [
  { name: 'Men',         emoji: '👔', gradient: 'from-blue-500 to-indigo-600',   light: 'bg-blue-50',   text: 'text-blue-700' },
  { name: 'Women',       emoji: '👗', gradient: 'from-pink-500 to-rose-600',     light: 'bg-pink-50',   text: 'text-pink-700' },
  { name: 'Electronics', emoji: '💻', gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50', text: 'text-violet-700' },
  { name: 'Accessories', emoji: '⌚', gradient: 'from-amber-500 to-orange-500',  light: 'bg-amber-50',  text: 'text-amber-700' },
  { name: 'Sports',      emoji: '🏃', gradient: 'from-green-500 to-emerald-600', light: 'bg-green-50',  text: 'text-green-700' },
  { name: 'Beauty',      emoji: '💄', gradient: 'from-rose-400 to-pink-600',     light: 'bg-rose-50',   text: 'text-rose-700' },
];

const FEATURES = [
  { icon: FiTruck,       title: 'Free Delivery',   desc: 'On orders above ₹999',  color: 'text-indigo-600',  bg: 'bg-indigo-50' },
  { icon: FiShield,      title: 'Secure Payments', desc: '100% safe & encrypted', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: FiRefreshCw,   title: 'Easy Returns',    desc: '30-day hassle-free',    color: 'text-amber-600',   bg: 'bg-amber-50' },
  { icon: FiShoppingBag, title: 'Premium Quality', desc: 'Curated collections',   color: 'text-rose-600',    bg: 'bg-rose-50' },
];

/* Scroll-triggered section wrapper */
function FadeSection({ children, className = '' }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Section heading */
function SectionHead({ eyebrow, title, eyebrowColor = 'text-indigo-500', centered = false }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${eyebrowColor}`}>{eyebrow}</p>
      <h2 className="text-3xl font-black text-gray-900 leading-tight">{title}</h2>
    </div>
  );
}

export default function Home() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { list: products, topRated, newArrivals, loading } = useSelector(s => s.products);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    // If admin user, redirect to admin panel
    if (user?.role === 'Admin') {
      navigate('/admin', { replace: true });
      return;
    }
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gray-950 text-white min-h-[90vh] flex items-center">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl anim-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl anim-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-900/25 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left copy */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 text-sm font-medium px-5 py-2.5 rounded-full"
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                New Collection 2026 is Live
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.06] tracking-tight"
              >
                Upgrade Your
                <br />
                <span className="text-gradient">Style</span> with
                <br />
                Vanexa
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-400 leading-relaxed max-w-md"
              >
                Discover premium fashion and electronics curated for the modern generation. Quality meets style, delivered to your door.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-2.5 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 active:scale-95 transition-all shadow-2xl shadow-white/10 text-base"
                >
                  Shop Now <FiArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/ai-search')}
                  className="flex items-center gap-2.5 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 active:scale-95 transition-all text-base"
                >
                  <FiZap size={18} className="text-amber-400" /> AI Search
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-10 pt-6 border-t border-white/10"
              >
                {[['50K+', 'Happy Customers'], ['10K+', 'Products'], ['4.9★', 'Avg Rating'], ['99%', 'Satisfaction']].map(([val, label]) => (
                  <div key={label} className="space-y-1">
                    <p className="text-2xl font-black text-white">{val}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block relative h-[540px]"
            >
              {/* Main card */}
              <div className="absolute top-10 left-6 right-6 glass-dark rounded-3xl p-7 anim-float">
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl flex-shrink-0">
                    👟
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-base">Premium Sneakers</p>
                    <p className="text-gray-400 text-sm mt-0.5">Limited Edition</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-black text-xl">₹4,999</p>
                    <p className="text-emerald-400 text-xs font-semibold mt-0.5">30% OFF</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(s => <FiStar key={s} size={13} className="text-amber-400" fill="currentColor" />)}
                  <span className="text-gray-400 text-xs ml-1">4.9 · 2.4k reviews</span>
                </div>
              </div>

              {/* Small cards */}
              <div className="absolute bottom-20 left-4 glass-dark rounded-2xl p-5 w-44">
                <div className="text-3xl mb-3">💻</div>
                <p className="text-white text-sm font-semibold">MacBook Pro</p>
                <p className="text-indigo-400 text-xs font-bold mt-1.5">₹1,29,999</p>
              </div>

              <div className="absolute bottom-10 right-4 glass-dark rounded-2xl p-5 w-44 anim-float" style={{ animationDelay: '2.5s' }}>
                <div className="text-3xl mb-3">⌚</div>
                <p className="text-white text-sm font-semibold">Smart Watch</p>
                <p className="text-emerald-400 text-xs font-bold mt-1.5">₹12,499</p>
              </div>

              {/* Notification pill */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-4 right-0 glass-dark rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <FiShoppingBag size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">New Order!</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Just now</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURES BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 text-center lg:text-left"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════════════════════ */}
      <FadeSection className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <div className="text-center mb-12">
          <SectionHead eyebrow="Browse" title="Shop by Category" centered={true} />
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-4">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[160px]"
            >
              <Link
                to={`/shop?category=${cat.name}`}
                className={`group flex flex-col items-center gap-4 p-6 ${cat.light} rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 w-full h-full min-h-[120px] justify-center`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {cat.emoji}
                </div>
                <span className={`text-sm font-bold ${cat.text}`}>{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </FadeSection>

      {/* ══════════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white">
        <FadeSection className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <div className="text-center mb-12">
            <SectionHead eyebrow="Handpicked" title="Featured Products" centered={true} />
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-4">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="w-full max-w-[280px]">
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-28">
              <div className="text-6xl mb-5">🛍️</div>
              <p className="text-gray-500 text-base">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
              {products.map((p, i) => (
                <div key={p.id} className="w-full max-w-[280px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}
        </FadeSection>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TOP RATED
      ══════════════════════════════════════════════════════════ */}
      {topRated.length > 0 && (
        <FadeSection className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <div className="text-center mb-12">
            <SectionHead eyebrow="Best Sellers" title="Top Rated" eyebrowColor="text-amber-500" centered={true} />
            <Link to="/shop?sort=rating" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-4">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {topRated.slice(0, 8).map((p, i) => (
              <div key={p.id} className="w-full max-w-[280px]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </FadeSection>
      )}

      {/* ══════════════════════════════════════════════════════════
          NEW ARRIVALS
      ══════════════════════════════════════════════════════════ */}
      {newArrivals.length > 0 && (
        <section className="bg-white">
          <FadeSection className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-12">
              <SectionHead eyebrow="Just Dropped" title="New Arrivals" eyebrowColor="text-emerald-500" centered={true} />
              <Link to="/shop?sort=newest" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-4">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
              {newArrivals.slice(0, 8).map((p, i) => (
                <div key={p.id} className="w-full max-w-[280px]">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </FadeSection>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════════════════════════ */}
      <FadeSection className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-12 lg:p-20 text-white noise-overlay">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 text-center lg:text-left">
            <div className="max-w-lg space-y-4 flex-1">
              <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-sm font-semibold px-4 py-2 rounded-full">
                🎉 Limited Time Offer
              </span>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                Get 20% Off<br />Your First Order
              </h2>
              <div className="space-y-2">
                <p className="text-indigo-100 text-lg">
                  Use code{' '}
                  <strong className="text-white bg-white/20 px-3 py-1.5 rounded-lg font-mono text-xl">VANEXA20</strong>
                  {' '}at checkout
                </p>
                <p className="text-indigo-300 text-sm">
                  New customers only · Valid till 31st Dec 2025
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-3 px-10 py-5 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-2xl text-lg flex-shrink-0"
            >
              Shop Now <FiArrowRight size={20} />
            </button>
          </div>
        </div>
      </FadeSection>

    </div>
  );
}
