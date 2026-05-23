import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiArrowLeft, FiShield } from 'react-icons/fi';
import { registerUser, clearError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const PERKS = ['Free delivery on first order', 'Exclusive member deals', 'Easy returns & refunds', 'Priority customer support'];

export default function Register() {
  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'User' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    // Remove auto-redirect on user state change for registration
    // Users should manually login after registration
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully! Please login to continue.', { 
        style: { borderRadius: '14px' },
        duration: 4000
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please login with your credentials.',
          email: form.email 
        }
      });
    } else {
      toast.error(result.payload || 'Registration failed', { style: { borderRadius: '14px' } });
    }
    setLoading(false);
  };

  const pwdStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl anim-float" />
          <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-white/10 rounded-full blur-3xl anim-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/30">
            <span className="text-white font-black text-4xl">V</span>
          </div>
          <h2 className="text-4xl font-black mb-4">Join Vanexa Today</h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-sm">
            Create your free account and unlock exclusive benefits.
          </p>
          <div className="space-y-3">
            {PERKS.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={12} className="text-white" />
                </div>
                <span className="text-sm text-indigo-100">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
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
                  <h1 className="text-2xl font-black text-gray-900 mb-1">Create account</h1>
                  <p className="text-gray-500 text-sm">Join 50,000+ happy shoppers today.</p>
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
                <label className="block text-xs font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                    minLength={3}
                    className="input input-icon"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-gray-700 mb-2">Account Type</label>
                <div className="relative">
                  <FiShield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.role}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    required
                    className="input input-icon appearance-none pr-10"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {form.role === 'Admin' ? 'Admin accounts can manage products and orders' : 'User accounts can shop and place orders'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
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
                {form.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= pwdStrength ? strengthColor[pwdStrength] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${pwdStrength === 1 ? 'text-red-500' : pwdStrength === 2 ? 'text-amber-500' : 'text-emerald-600'}`}>
                      {strengthLabel[pwdStrength]}
                    </span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !text-base">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <>Create Account <FiArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">Sign in</Link>
            </p>
            
            <div className="text-center mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> After registration, you'll be redirected to login page to sign in with your new account.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
