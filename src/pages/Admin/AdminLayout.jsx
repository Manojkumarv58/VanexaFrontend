import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiShoppingBag, FiPackage, FiUsers,
  FiMenu, FiX, FiArrowLeft, FiLogOut, FiSettings,
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const NAV = [
  { label: 'Dashboard', to: '/admin',          icon: FiGrid,        color: 'indigo' },
  { label: 'Products',  to: '/admin/products', icon: FiShoppingBag, color: 'violet' },
  { label: 'Orders',    to: '/admin/orders',   icon: FiPackage,     color: 'blue' },
  { label: 'Users',     to: '/admin/users',    icon: FiUsers,       color: 'emerald' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <div>
            <p className="font-black text-gray-900">Vanexa</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          {user?.avatar?.url ? (
            <img src={user.avatar.url} alt={user.name} className="w-9 h-9 rounded-lg object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiSettings size={14} />
            Settings
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft size={14} />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <FiLogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl lg:hidden"
            >
              <div className="absolute top-4 right-4 lg:hidden">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FiX size={18} />
                </button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h2 className="font-black text-gray-900">
                {NAV.find(n => n.to === location.pathname)?.label || 'Admin Panel'}
              </h2>
              <p className="text-xs text-gray-500">Manage your store</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              View Store
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
