import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp,
  FiPackage, FiAlertTriangle, FiArrowUp, FiArrowDown,
} from 'react-icons/fi';
import { adminAPI } from '../../services/api';

function StatCard({ title, value, icon: Icon, color, bg, change, prefix = '' }) {
  const isPositive = parseFloat(change) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
          <Icon size={22} className={color} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
            {Math.abs(parseFloat(change) || 0).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 mb-1">{prefix}{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    );
  }

  const orderStatus = stats?.orderStatusCount || {};

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${Number(stats?.totalRevenueAlltime || 0).toLocaleString('en-IN')}`}
          icon={FiDollarSign}
          color="text-indigo-600"
          bg="bg-indigo-50"
          change={stats?.revenueGrowthRate?.replace('%', '')}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsersCount || 0}
          icon={FiUsers}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${Number(stats?.todayRevenue || 0).toLocaleString('en-IN')}`}
          icon={FiTrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          title="New Users (Month)"
          value={stats?.newUsersThisMonth || 0}
          icon={FiUsers}
          color="text-violet-600"
          bg="bg-violet-50"
        />
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Processing', val: orderStatus.Processing || 0, color: 'bg-amber-500' },
          { label: 'Shipped',    val: orderStatus.Shipped    || 0, color: 'bg-blue-500' },
          { label: 'Delivered',  val: orderStatus.Delivered  || 0, color: 'bg-emerald-500' },
          { label: 'Cancelled',  val: orderStatus.Cancelled  || 0, color: 'bg-red-500' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${color} flex-shrink-0`} />
            <div>
              <p className="text-xl font-black text-gray-900">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {stats?.monthlySales?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.monthlySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontFamily: 'Inter' }}
                formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="totalSales" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        {stats?.topProducts?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 mb-5">Top Products</h3>
            <div className="space-y-4">
              {stats.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-6 text-xs font-black text-gray-400">#{i + 1}</span>
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-gray-50" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                    {p.total_sold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock */}
        {stats?.lowStockProducts?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FiAlertTriangle size={16} className="text-amber-500" />
              <h3 className="font-black text-gray-900">Low Stock Alert</h3>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-sm font-semibold text-gray-900 clamp-1 flex-1">{p.name}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ml-3 ${
                    p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Products', to: '/admin/products', icon: FiShoppingBag, color: 'bg-indigo-600' },
          { label: 'Manage Orders',   to: '/admin/orders',   icon: FiPackage,     color: 'bg-emerald-600' },
          { label: 'Manage Users',    to: '/admin/users',    icon: FiUsers,       color: 'bg-violet-600' },
        ].map(({ label, to, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
          >
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
              <Icon size={20} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
