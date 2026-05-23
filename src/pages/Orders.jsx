import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiChevronRight, FiClock, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import { orderAPI } from '../services/api';

const STATUS = {
  Processing: { color: 'bg-amber-100 text-amber-700',  icon: FiClock,  dot: 'bg-amber-500' },
  Shipped:    { color: 'bg-blue-100 text-blue-700',    icon: FiTruck,  dot: 'bg-blue-500' },
  Delivered:  { color: 'bg-emerald-100 text-emerald-700', icon: FiCheck, dot: 'bg-emerald-500' },
  Cancelled:  { color: 'bg-red-100 text-red-600',      icon: FiX,      dot: 'bg-red-500' },
};

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.myOrders()
      .then(r => setOrders(r.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="skeleton h-8 w-48 rounded-xl mb-8" />
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 mb-4">
            <div className="flex justify-between mb-4">
              <div className="skeleton h-4 w-32 rounded-lg" />
              <div className="skeleton h-6 w-24 rounded-xl" />
            </div>
            <div className="flex gap-3">
              {[1,2,3].map(j => <div key={j} className="skeleton w-14 h-14 rounded-xl" />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <FiPackage size={48} className="text-indigo-200" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Your order history will appear here once you make a purchase.</p>
        <Link to="/shop" className="btn-primary !py-3.5 !px-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <h1 className="text-2xl font-black text-gray-900 mb-10">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order, i) => {
          const cfg = STATUS[order.order_status] || STATUS.Processing;
          const Icon = cfg.icon;
          const items = order.order_items || [];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/orders/${order.id}`}
                className="block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Order ID</p>
                    <p className="text-sm font-mono font-bold text-gray-800">
                      #{order.id?.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl ${cfg.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {order.order_status}
                    </span>
                    <FiChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>

                {/* Item thumbnails */}
                {items.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {items.slice(0, 4).map((item, j) => (
                      <img
                        key={j}
                        src={item.image || `https://placehold.co/56x56/f3f4f6/9ca3af?text=V`}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100"
                      />
                    ))}
                    {items.length > 4 && (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{items.length - 4}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-3">
                    {order.order_status === 'Cancelled' && (
                      <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg">
                        Refund Processing
                      </span>
                    )}
                    <span className="font-black text-gray-900 text-base">
                      ₹{Number(order.total_price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
