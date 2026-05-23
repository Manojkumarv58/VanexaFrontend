import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FiZap, FiSearch, FiArrowRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  'Best laptop under 50000', 'Trendy women dresses', 'Wireless earbuds',
  'Running shoes for men', 'Smartwatch with health tracking', 'Summer collection',
];

export default function AISearch() {
  const user = useSelector(s => s.auth.user);
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    if (!user) { toast.error('Please login to use AI Search'); return; }
    setLoading(true);
    setResults(null);
    try {
      const { data } = await productAPI.aiSearch({ query: q });
      setResults(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-200"
        >
          <FiZap size={36} className="text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-gray-900 mb-3"
        >
          AI-Powered Search
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-lg max-w-lg mx-auto"
        >
          Describe what you're looking for in natural language and let AI find the perfect products.
        </motion.p>
      </div>

      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 focus-within:border-indigo-500 focus-within:shadow-lg focus-within:shadow-indigo-100 transition-all">
            <FiSearch size={20} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 'Best laptop for students under ₹50,000'..."
              className="flex-1 text-base outline-none text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn-primary !px-8 !py-4 !text-base !rounded-2xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiZap size={18} /> Search</>
            )}
          </button>
        </div>

        {/* Suggestions */}
        {!results && !loading && (
          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <FiArrowRight size={12} /> {s}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Not logged in */}
      {!user && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">🔐</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
          <p className="text-gray-500 text-sm mb-6">Please login to use AI-powered search.</p>
          <Link to="/login" className="btn-primary">Login Now</Link>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div>
          <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50 rounded-2xl">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-indigo-700">AI is analyzing your query...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* AI Recommendation */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FiZap size={16} className="text-indigo-600" />
                  <span className="text-sm font-bold text-indigo-700">AI Recommendations</span>
                </div>
                <div className="space-y-2">
                  {results.recommendations.map((rec, idx) => (
                    <Link
                      key={rec.id || idx}
                      to={`/product/${rec.id}`}
                      className="flex items-start gap-2 p-2 rounded-xl hover:bg-white/60 transition-colors cursor-pointer group"
                    >
                      <span className="text-indigo-600 font-bold text-xs mt-0.5">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{rec.name}</p>
                        <p className="text-xs text-gray-600">{rec.reason}</p>
                      </div>
                      <FiArrowRight size={14} className="text-gray-400 group-hover:text-indigo-600 transition-colors mt-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900">
                {results.products?.length || 0} Results for "{query}"
              </h2>
            </div>

            {results.products?.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try a different search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {results.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


