import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiFilter, FiX, FiSearch, FiChevronDown, FiChevronUp,
  FiGrid, FiList, FiSliders,
} from 'react-icons/fi';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIES = ['All', 'Men', 'Women', 'Electronics', 'Accessories', 'Sports', 'Beauty'];
const SORT_OPTIONS = [
  { label: 'Newest First',    value: 'newest' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Top Rated',       value: 'rating' },
  { label: 'Most Popular',    value: 'popular' },
];

function Accordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-bold text-gray-900 mb-3"
      >
        {title}
        {open ? <FiChevronUp size={15} className="text-gray-400" /> : <FiChevronDown size={15} className="text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { list: products, total, loading } = useSelector(s => s.products);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search:       searchParams.get('search')       || '',
    category:     searchParams.get('category')     || 'All',
    minPrice:     searchParams.get('minPrice')     || '',
    maxPrice:     searchParams.get('maxPrice')     || '',
    rating:       parseInt(searchParams.get('rating') || '0'),
    availability: searchParams.get('availability') || '',
    sort:         searchParams.get('sort')         || 'newest',
    page:         parseInt(searchParams.get('page') || '1'),
  });

  const load = useCallback(() => {
    const params = { limit: 12, page: filters.page, sort: filters.sort };
    if (filters.search)                    params.search   = filters.search;
    if (filters.category !== 'All')        params.category = filters.category;
    
    // Price filter - handle min/max separately
    if (filters.minPrice || filters.maxPrice) {
      const minPrice = filters.minPrice || '0';
      const maxPrice = filters.maxPrice || '999999';
      params.price = `${minPrice}-${maxPrice}`;
    }
    
    if (filters.rating)                    params.ratings  = filters.rating;
    if (filters.availability)              params.availability = filters.availability;
    
    // Update URL params
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== 0) {
        urlParams.set(key, value);
      }
    });
    setSearchParams(urlParams);
    
    dispatch(fetchProducts(params));
  }, [dispatch, filters, setSearchParams]);

  useEffect(() => { load(); }, [load]);

  const set = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }));

  const clear = () => {
    setFilters({ 
      search: '', 
      category: 'All', 
      minPrice: '', 
      maxPrice: '', 
      rating: 0, 
      availability: '', 
      sort: 'newest', 
      page: 1 
    });
    setSearchParams({});
  };

  const activeFilters = [
    filters.search && `"${filters.search}"`,
    filters.category !== 'All' && filters.category,
    (filters.minPrice || filters.maxPrice) && `₹${filters.minPrice || 0}–₹${filters.maxPrice || '∞'}`,
    filters.rating && `${filters.rating}★+`,
    filters.availability && getAvailabilityLabel(filters.availability),
  ].filter(Boolean);

  function getAvailabilityLabel(availability) {
    switch(availability) {
      case 'in_stock': return 'In Stock';
      case 'limited': return 'Limited Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return '';
    }
  }

  const SidebarContent = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-gray-900 flex items-center gap-2">
          <FiSliders size={16} /> Filters
        </h3>
        {activeFilters.length > 0 && (
          <button onClick={clear} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Clear all
          </button>
        )}
      </div>

      <Accordion title="Category">
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => set('category', cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                filters.category === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {cat}
              {filters.category === cat && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Price Range">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={e => set('minPrice', e.target.value)}
                className="input !py-2 !text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxPrice}
                onChange={e => set('maxPrice', e.target.value)}
                className="input !py-2 !text-sm"
              />
            </div>
            {(filters.minPrice || filters.maxPrice) && (
              <button
                onClick={() => setFilters(p => ({ ...p, minPrice: '', maxPrice: '', page: 1 }))}
                className="self-end p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear price range"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-1.5">
            {[['0-500','Under ₹500'],['500-2000','₹500–2K'],['2000-10000','₹2K–10K'],['10000-999999','₹10K+']].map(([range, label]) => (
              <button
                key={range}
                onClick={() => { 
                  const [min, max] = range.split('-'); 
                  setFilters(p => ({...p, minPrice: min, maxPrice: max, page: 1})); 
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filters.minPrice === range.split('-')[0] && filters.maxPrice === range.split('-')[1]
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      <Accordion title="Minimum Rating">
        <div className="space-y-1">
          {[4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => set('rating', filters.rating === r ? 0 : r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                filters.rating === r ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{'⭐'.repeat(r)}</span>
              <span>& above</span>
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion title="Availability" defaultOpen={false}>
        <div className="space-y-1">
          {[['in_stock','In Stock'],['limited','Limited Stock'],['out_of_stock','Out of Stock']].map(([val, label]) => (
            <button 
              key={val} 
              onClick={() => set('availability', filters.availability === val ? '' : val)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                filters.availability === val 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                filters.availability === val 
                  ? 'border-emerald-500 bg-emerald-500' 
                  : 'border-gray-300'
              }`}>
                {filters.availability === val && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {label}
            </button>
          ))}
        </div>
      </Accordion>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {filters.category !== 'All' ? filters.category : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading...' : `${total} products found`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <FiSearch size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={e => set('search', e.target.value)}
              className="text-sm outline-none w-36 text-gray-800 placeholder-gray-400 bg-transparent"
            />
            {filters.search && (
              <button onClick={() => set('search', '')} className="text-gray-400 hover:text-gray-600">
                <FiX size={13} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={e => set('sort', e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-2xl pl-4 pr-9 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Mobile filter */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-2xl"
          >
            <FiFilter size={14} /> Filters
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 bg-white text-indigo-600 text-xs font-black rounded-full flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {activeFilters.map(f => (
            <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl">
              {f}
              <button onClick={clear} className="hover:text-indigo-900"><FiX size={11} /></button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-10">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm sticky top-24">
            <SidebarContent />
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-gray-900">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                    <FiX size={18} />
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Products ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-28"
            >
              <div className="text-7xl mb-5">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-8">Try adjusting your filters or search term</p>
              <button onClick={clear} className="btn-primary">Clear All Filters</button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, Math.ceil(total / 12)) }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        filters.page === p
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={products.length < 12}
                  onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
