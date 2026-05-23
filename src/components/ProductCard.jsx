import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, toggleWishlist, selectIsWishlisted } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch   = useDispatch();
  const wishlisted = useSelector(selectIsWishlisted(product.id));

  const img = product.images?.[0]?.url
    || `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(product.name?.[0] || 'V')}`;

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart!', {
      icon: '🛒',
      style: { borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '13px' },
    });
  };

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', {
      style: { borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '13px' },
    });
  };

  const stars = Math.round(Number(product.ratings) || 0);

  return (
    <div className="w-full">
      <Link to={`/product/${product.id}`} className="group block h-full">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/80 card-lift h-full flex flex-col w-full">

          {/* ── Image ── */}
          <div className="relative overflow-hidden bg-gray-50 flex-shrink-0 w-full" style={{ aspectRatio: '1' }}>
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              style={{ '--tw-scale-x': 1.08, '--tw-scale-y': 1.08 }}
              onError={e => { e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=V`; }}
            />

            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.stock === 0 && (
                <span className="badge bg-gray-900/90 text-white text-[10px] backdrop-blur-sm">Sold Out</span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="badge bg-amber-500 text-white text-[10px]">Only {product.stock} left</span>
              )}
            </div>

            {/* Wishlist button */}
            <button
              onClick={handleWish}
              className={`absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 ${
                wishlisted
                  ? 'bg-rose-500 text-white shadow-rose-200/60'
                  : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-rose-500 hover:bg-white hover:shadow-md'
              }`}
            >
              <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>

            {/* Quick action bar — slides up on hover */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <button
                onClick={handleCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FiShoppingCart size={13} />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                className="w-10 flex items-center justify-center bg-white/95 backdrop-blur-sm text-gray-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-lg"
              >
                <FiEye size={14} />
              </button>
            </div>
          </div>

          {/* ── Info ── */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            {/* Category */}
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              {product.category}
            </span>

            {/* Name */}
            <h3 className="text-sm font-semibold text-gray-900 clamp-2 leading-relaxed -mt-1">
              {product.name}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <FiStar
                    key={s}
                    size={12}
                    className={s <= stars ? 'text-amber-400' : 'text-gray-200'}
                    fill={s <= stars ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-400 font-medium leading-none">
                {Number(product.ratings || 0).toFixed(1)}
                {product.review_count > 0 && (
                  <span className="text-gray-300"> · {product.review_count}</span>
                )}
              </span>
            </div>

            {/* Price row */}
            <div className="flex items-center justify-between pt-1 mt-auto">
              <span className="text-base font-bold text-gray-900 tracking-tight">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                product.stock > 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
