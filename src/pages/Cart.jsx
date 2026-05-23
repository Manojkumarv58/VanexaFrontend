import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import { removeFromCart, updateQuantity, selectCartTotal } from '../store/slices/cartSlice';

export default function Cart() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const user      = useSelector(s => s.auth.user);
  const cartTotal = useSelector(selectCartTotal);

  const tax      = Math.round(cartTotal * 0.08);
  const shipping = cartTotal > 999 ? 0 : 50;
  const total    = cartTotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="w-36 h-36 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiShoppingBag size={56} className="text-indigo-200" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 max-w-sm text-base">
            Looks like you haven't added anything yet. Start exploring our collection!
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary !py-4 !px-10 !text-base"
          >
            Start Shopping <FiArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-black text-gray-900">
          Shopping Cart <span className="text-gray-400 font-normal text-lg">({items.length})</span>
        </h1>
        <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Continue Shopping →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map(({ product, quantity }) => {
              const img = product.images?.[0]?.url || `https://placehold.co/200x200/f3f4f6/9ca3af?text=V`;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-5"
                >
                  <Link to={`/product/${product.id}`} className="flex-shrink-0">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-24 h-24 rounded-2xl object-cover bg-gray-50"
                      onError={e => { e.target.src = `https://placehold.co/200x200/f3f4f6/9ca3af?text=V`; }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
                        <Link to={`/product/${product.id}`} className="text-sm font-bold text-gray-900 hover:text-indigo-600 clamp-2 transition-colors">
                          {product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(product.id))}
                        className="p-2 rounded-xl text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all flex-shrink-0"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">{quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                          disabled={quantity >= product.stock}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all disabled:opacity-40"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <p className="font-black text-gray-900 text-base">
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-black text-gray-900 mb-6 text-lg">Order Summary</h3>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5">
                <FiTag size={14} className="text-gray-400" />
                <input type="text" placeholder="Coupon code" className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400" />
              </div>
              <button className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-emerald-600' : ''}`}>
                  {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                  Add ₹{(999 - cartTotal).toLocaleString('en-IN')} more for free shipping!
                </p>
              )}
              <div className="divider" />
              <div className="flex justify-between font-black text-gray-900 text-lg pt-1">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
              className="btn-primary w-full !py-4 !text-base"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
              <FiArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-4 mt-5">
              {['visa', 'mastercard', 'upi', 'razorpay'].map(p => (
                <span key={p} className="text-xs text-gray-400 font-medium capitalize">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
