import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { FiStar, FiHeart, FiShoppingCart, FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { fetchProduct } from '../store/slices/productSlice';
import { addToCart, toggleWishlist, selectIsWishlisted } from '../store/slices/cartSlice';
import { productAPI } from '../services/api';
import Button from '../components/Button';

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={`${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await productAPI.review(productId, { rating, comment });
      toast.success('Review added successfully!');
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <FiStar
                size={24}
                className={`${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>

      <Button type="submit" loading={loading} size="sm">
        Submit Review
      </Button>
    </form>
  );
}

function ReviewItem({ review }) {
  return (
    <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold text-gray-900">{review.user_name}</span>
            <StarRating rating={review.rating} size={14} />
          </div>
          <p className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: product, loading, error } = useSelector(state => state.products);
  const wishlisted = useSelector(selectIsWishlisted(id));
  const { user } = useSelector(state => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(0);
    }
  }, [product?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    toast.success('Added to cart!', {
      icon: '🛒',
      style: { borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '13px' },
    });
  };

  const handleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist(product));
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️', {
      style: { borderRadius: '14px', fontFamily: 'Inter, sans-serif', fontSize: '13px' },
    });
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const refreshProduct = () => {
    dispatch(fetchProduct(id));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-8">
          {error || "The product you're looking for doesn't exist."}
        </p>
        <Link to="/shop" className="btn-primary !py-3.5 !px-8">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const reviews = product.reviews || [];
  const avgRating = Number(product.avg_rating) || 0;
  const reviewCount = Number(product.review_count) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-700">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">📷</div>
                  <p>No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-indigo-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-gray-600">
              {avgRating.toFixed(1)} ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            ${product.price}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              product.stock > 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity & Actions */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWishlist}
                  variant={wishlisted ? 'secondary' : 'outline'}
                  size="lg"
                >
                  <FiHeart size={18} className={wishlisted ? 'fill-current' : ''} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-16 border-t border-gray-200">
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Customer Reviews ({reviewCount})
            </h2>
            {user && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                size="sm"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </Button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm productId={id} onReviewAdded={refreshProduct} />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewItem key={review.review_id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
