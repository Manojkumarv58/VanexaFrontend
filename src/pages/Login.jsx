import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { loginUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useSelector(s => s.auth);
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      // If admin, redirect to admin panel, else redirect to intended page
      if (user.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
    
    // Show registration success message if coming from registration
    if (location.state?.message) {
      toast.success(location.state.message, { 
        style: { borderRadius: '14px' },
        duration: 4000
      });
      
      // Pre-fill email if provided
      if (location.state?.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
      
      // Clear the state to prevent showing message again
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    return () => dispatch(clearError());
  }, [user, navigate, from, dispatch, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back! 👋', { style: { borderRadius: '14px' } });
      
      // Check if user is Admin - redirect to admin panel
      if (result.payload.user.role === 'Admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      toast.error(result.payload || 'Login failed', { style: { borderRadius: '14px' } });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl anim-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl anim-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative text-white text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/30">
            <span className="text-white font-black text-4xl">V</span>
          </div>
          <h2 className="text-4xl font-black mb-4">Welcome to Vanexa</h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
            Premium shopping experience for the modern generation.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {['50K+ Customers', '10K+ Products', '4.9★ Rating'].map(s => (
              <span key={s} className="bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <span className="text-2xl font-black text-gray-900">Vanexa</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 mb-1">Sign in</h1>
                  <p className="text-gray-500 text-sm">Welcome back! Enter your details.</p>
                </div>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft size={14} />
                  <span className="hidden sm:inline">Back to Home</span>
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                    className="input input-icon"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    className="input input-icon pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-base">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <FiArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="divider" />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">
                or
              </span>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
                Create one free
              </Link>
            </p>

            {/* Admin Panel Link */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">
                Admin user?{' '}
                <Link 
                  to="/admin/dashboard"
                  className="font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Go to Admin Panel →
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
