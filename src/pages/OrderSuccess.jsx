import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiArrowRight, FiHome } from 'react-icons/fi';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId  = location.state?.orderId;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-indigo-50">
      <div className="text-center max-w-lg w-full">
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-emerald-100" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="absolute"
          >
            <FiCheckCircle size={72} className="text-emerald-500" />
          </motion.div>
          {/* Rings */}
          {[1,2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 1 }}
              className="absolute w-32 h-32 rounded-full border-2 border-emerald-300"
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-3">Order Placed! 🎉</h1>
          <p className="text-gray-500 text-lg mb-2">
            Your payment was successful and order is confirmed.
          </p>
          {orderId && (
            <p className="text-sm text-gray-400 font-mono bg-gray-100 inline-block px-4 py-2 rounded-xl mb-8">
              Order #{String(orderId).slice(0, 8).toUpperCase()}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 text-left"
        >
          <h3 className="font-bold text-gray-900 mb-4">What happens next?</h3>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Confirmation Email', desc: 'Check your inbox for order details', color: 'bg-indigo-100 text-indigo-600' },
              { step: '2', title: 'Processing',         desc: 'Your order will be packed within 24 hours', color: 'bg-amber-100 text-amber-600' },
              { step: '3', title: 'Delivery',           desc: 'Track your shipment in My Orders', color: 'bg-emerald-100 text-emerald-600' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl ${color} text-sm font-black flex items-center justify-center flex-shrink-0`}>
                  {step}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/orders"
            className="btn-primary !py-4 !px-8 !text-base"
          >
            <FiPackage size={20} /> Track Order
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-base"
          >
            <FiHome size={20} /> Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
