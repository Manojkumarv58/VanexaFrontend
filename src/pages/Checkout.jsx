import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiMapPin, FiCreditCard, FiCheck, FiLock } from 'react-icons/fi';
import { clearCart, selectCartTotal } from '../store/slices/cartSlice';
import { orderAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

const RAZORPAY_KEY = 'rzp_test_SefMUbayOgv1wD';

const FIELDS = [
  { name: 'full_name', label: 'Full Name',    placeholder: 'John Doe',        span: 2 },
  { name: 'phone',     label: 'Phone Number', placeholder: '+91 9876543210',  span: 2 },
  { name: 'address',   label: 'Address',      placeholder: '123 Main Street', span: 2 },
  { name: 'city',      label: 'City',         placeholder: 'Mumbai',          span: 1 },
  { name: 'state',     label: 'State',        placeholder: 'Maharashtra',     span: 1 },
  { name: 'pincode',   label: 'Pincode',      placeholder: '400001',          span: 1 },
  { name: 'country',   label: 'Country',      placeholder: 'India',           span: 1 },
];

export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector(s => s.cart);
  const user      = useSelector(s => s.auth.user);
  const cartTotal = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.name || '', phone: '', address: '',
    city: '', state: '', country: 'India', pincode: '',
  });

  const tax      = Math.round(cartTotal * 0.08);
  const shipping = cartTotal > 999 ? 0 : 50;
  const total    = cartTotal + tax + shipping;

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway unavailable'); setLoading(false); return; }

      const { data } = await orderAPI.place({ ...form, orderdItems: items });
      const { razorpayOrder, orderId } = data;

      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Vanexa',
        description: 'Order Payment',
        image: 'https://placehold.co/80x80/6366f1/ffffff?text=V',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            dispatch(clearCart());
            navigate('/order-success', { state: { orderId } });
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: form.full_name, contact: form.phone, email: user?.email },
        theme: { color: '#6366f1' },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <h1 className="text-2xl font-black text-gray-900 mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <FiMapPin size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Shipping Address</h2>
                  <p className="text-xs text-gray-500">Where should we deliver?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.map(field => (
                  <div key={field.name} className={field.span === 2 ? 'col-span-2' : ''}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={form[field.name]}
                      onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                      placeholder={field.placeholder}
                      required
                      className="input !py-3"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <FiCreditCard size={18} className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Payment Method</h2>
                  <p className="text-xs text-gray-500">Secure & encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-2 border-indigo-500 rounded-2xl bg-indigo-50">
                <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Razorpay</p>
                  <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <FiLock size={11} /> Secured
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-black text-gray-900 mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto no-scrollbar">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.images?.[0]?.url || `https://placehold.co/60x60/f3f4f6/9ca3af?text=V`}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">Qty: {quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="divider mb-4" />
              <div className="space-y-2.5 text-sm mb-6">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax (8%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between font-black text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-4 !text-base">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                ) : (
                  <><FiCheck size={18} /> Pay ₹{total.toLocaleString('en-IN')}</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                <FiLock size={11} /> 256-bit SSL encrypted payment
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
