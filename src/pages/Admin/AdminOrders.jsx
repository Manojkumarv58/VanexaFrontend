import { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped:    'bg-blue-100 text-blue-700',
  Delivered:  'bg-emerald-100 text-emerald-700',
  Cancelled:  'bg-red-100 text-red-600',
};

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    orderAPI.getAll()
      .then(r => setOrders(r.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (orderId, status) => {
    try {
      await orderAPI.update(orderId, { status });
      toast.success('Status updated!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Order ID', 'Date', 'Customer', 'Amount', 'Status', 'Update'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-bold text-gray-700">#{order.id?.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{order.shipping_info?.full_name || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-gray-900">₹{Number(order.total_price).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={order.order_status}
                        onChange={e => handleStatus(order.id, e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <FiChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
}
