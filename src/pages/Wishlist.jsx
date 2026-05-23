import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { addToCart, toggleWishlist } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const dispatch  = useDispatch();
  const { wishlist } = useSelector(s => s.cart);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiHeart size={48} className="text-rose-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm">Save items you love and come back to them anytime.</p>
          <Link to="/shop" className="btn-primary !py-3.5 !px-8">
            Explore Products <FiArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-0.5">{wishlist.length} saved items</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlist.map((product, i) => {
            const img = product.images?.[0]?.url || `https://placehold.co/400x400/f3f4f6/9ca3af?text=V`;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-lift"
              >
                <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1' }}>
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=V`; }}
                    />
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(toggleWishlist(product));
                      toast('Removed from wishlist', { style: { borderRadius: '14px' } });
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 active:scale-90 transition-all"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`} className="text-sm font-bold text-gray-900 hover:text-indigo-600 clamp-2 block mb-3 transition-colors">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => {
                        dispatch(addToCart({ product, quantity: 1 }));
                        toast.success('Added to cart!', { icon: '🛒', style: { borderRadius: '14px' } });
                      }}
                      disabled={product.stock === 0}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart size={12} /> Add
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
