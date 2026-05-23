import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['Processing', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(r => setOrder(r.data.order))
      .catch(() => { toast.error('Order not found'); navigate('/orders'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Refund will be processed automatically to your original payment method.')) {
      return;
    }

    setCancelling(true);
    try {
      const response = await orderAPI.cancel(id);
      const { refund } = response.data;
      
      if (refund?.status === 'Processed') {
        toast.success('Order cancelled successfully! Refund has been processed and will reflect in your account within 5-7 business days.');
      } else {
        toast.success('Order cancelled successfully! Refund will be processed manually within 5-7 business days.');
      }
      
      setOrder({ 
        ...order, 
        order_status: 'Cancelled',
        refund_info: refund
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = order && order.order_status === 'Processing';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    );
  }

  if (!order) return null;

  const stepIdx = STEPS.indexOf(order.order_status);
  const shipping = order.shipping_info;
  const items    = order.order_items || [];

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <FiArrowLeft size={16} /> Back to Orders
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Order Details</h1>
          <p className="text-sm font-mono text-gray-400 mt-1">#{order.id?.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {/* Status Tracker */}
      {order.order_status === 'Cancelled' ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center">
              <span className="text-white text-2xl">✕</span>
            </div>
            <div>
              <h3 className="font-black text-red-900">Order Cancelled</h3>
              <p className="text-sm text-red-700">This order has been cancelled</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Refund Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  order.refund_info?.status === 'Processed' 
                    ? 'bg-green-100 text-green-800' 
                    : order.refund_info?.status?.includes('Failed')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.refund_info?.status || 'Processing'}
                </span>
              </p>
              {order.refund_info?.refund_id && (
                <p className="text-xs text-gray-500 font-mono">
                  ID: {order.refund_info.refund_id}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">
              <strong className="text-gray-900">Refund Amount:</strong> ₹{Number(order.total_price).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-600">
              {order.refund_info?.status === 'Processed' 
                ? 'Your refund has been processed successfully and will reflect in your account within 5-7 business days.'
                : order.refund_info?.status?.includes('Failed')
                ? 'Refund processing failed automatically. Our team will process it manually within 5-7 business days.'
                : 'Your refund is being processed and will reflect in your account within 5-7 business days.'
              }
            </p>
            {order.refund_info?.estimated_days && (
              <p className="text-xs text-indigo-600 mt-2 font-medium">
                Expected in: {order.refund_info.estimated_days}
              </p>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <h3 className="font-bold text-gray-900 mb-6">Order Status</h3>
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                    i < stepIdx ? 'bg-emerald-500 text-white' :
                    i === stepIdx ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i < stepIdx ? <FiCheck size={16} /> : i + 1}
                  </div>
                  <p className={`text-xs mt-2 font-semibold ${
                    i <= stepIdx ? 'text-gray-900' : 'text-gray-400'
                  }`}>{step}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                    i < stepIdx ? 'bg-emerald-500' : 'bg-gray-100'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        {shipping?.full_name && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FiMapPin size={16} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">{shipping.full_name}</p>
              <p>{shipping.address}</p>
              <p>{shipping.city}, {shipping.state} — {shipping.pincode}</p>
              <p>{shipping.country}</p>
              <p className="text-indigo-600 font-medium">{shipping.phone}</p>
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard size={16} className="text-emerald-600" />
            <h3 className="font-bold text-gray-900">Payment Summary</h3>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{(order.total_price - order.tax_price - order.shipping_price).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span><span>₹{Number(order.tax_price).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span><span>₹{Number(order.shipping_price).toLocaleString('en-IN')}</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between font-black text-gray-900 text-base">
              <span>Total</span><span>₹{Number(order.total_price).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <FiPackage size={16} className="text-indigo-600" />
          <h3 className="font-bold text-gray-900">Order Items ({items.length})</h3>
        </div>
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <img
                src={item.image || `https://placehold.co/80x80/f3f4f6/9ca3af?text=V`}
                alt={item.title}
                className="w-16 h-16 rounded-2xl object-cover bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 clamp-1">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                </p>
              </div>
              <p className="font-black text-gray-900 text-sm flex-shrink-0">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
