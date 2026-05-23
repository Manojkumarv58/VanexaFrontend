import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX,
  FiLogOut, FiPackage, FiSettings, FiChevronDown, FiZap,
} from 'react-icons/fi';
import { logoutUser } from '../store/slices/authSlice';
import { selectCartCount } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'Shop',        to: '/shop' },
  { label: 'New Arrivals',to: '/shop?sort=newest' },
  { label: 'Deals',       to: '/shop?sort=discount' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query,       setQuery]       = useState('');
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = useSelector(s => s.auth.user);
  const cartCount = useSelector(selectCartCount);
  const wishCount = useSelector(s => s.cart.wishlist.length);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    // Close mobile menu and profile dropdown when route changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('See you soon! 👋');
    navigate('/');
  };

  const isActive = (to) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to.split('?')[0]));

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-glass shadow-sm' : 'bg-white/95'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
                <span className="text-white font-black text-lg leading-none">V</span>
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Vanexa
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-indigo-50 rounded-xl -z-10"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* ── Desktop Search ── */}
            <div ref={searchRef} className="hidden md:block relative flex-1 max-w-sm mx-4">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200/70 rounded-2xl px-4 py-2.5 transition-colors focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:shadow-sm">
                  <FiSearch size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none w-full"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── Right Icons ── */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FiSearch size={19} />
              </button>

              {/* AI Search */}
              <Link
                to="/ai-search"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors"
              >
                <FiZap size={14} /> AI Search
              </Link>

              {/* Wishlist - Hide for Admin */}
              {user?.role !== 'Admin' && (
                <Link to="/wishlist" className="relative p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiHeart size={19} />
                  <AnimatePresence>
                    {wishCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {wishCount > 9 ? '9+' : wishCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Cart - Hide for Admin */}
              {user?.role !== 'Admin' && (
                <Link to="/cart" className="relative p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                  <FiShoppingCart size={19} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {cartCount > 9 ? '9+' : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {/* Profile */}
              {user ? (
                <div className="relative ml-2" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <FiChevronDown size={14} className={`text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900 clamp-1">{user.name}</p>
                          <p className="text-xs text-gray-500 clamp-1">{user.email}</p>
                        </div>
                        {[
                          { icon: FiSettings, label: 'My Profile',  to: '/profile' },
                          ...(user.role !== 'Admin' ? [{ icon: FiPackage,  label: 'My Orders',   to: '/orders' }] : []),
                          ...(user.role === 'Admin' ? [{ icon: FiSettings, label: 'Admin Panel', to: '/admin' }] : []),
                        ].map(item => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <item.icon size={15} className="text-gray-400" />
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <FiLogOut size={15} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <Link to="/login" className="hidden sm:block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl !shadow-none">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors ml-2"
              >
                {mobileOpen ? <FiX size={19} /> : <FiMenu size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Search ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100"
            >
              <form onSubmit={handleSearch} className="px-4 py-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                  <FiSearch size={15} className="text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none flex-1"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.to) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="flex gap-3 pt-3">
                    <Link to="/login" className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700">Login</Link>
                    <Link to="/register" className="flex-1 text-center py-3 bg-indigo-600 rounded-xl text-sm font-semibold text-white">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
