import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add frontendUrl query parameter
      const frontendUrl = window.location.origin;
      await authAPI.forgotPassword({ email }, frontendUrl);
      setSent(true);
      toast.success('Reset link sent!', { style: { borderRadius: '14px' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email', { style: { borderRadius: '14px' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <span className="text-2xl font-black text-gray-900">Vanexa</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiMail size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Check your inbox</h3>
              <p className="text-sm text-gray-500 mb-6">
                We've sent a password reset link to <strong className="text-gray-900">{email}</strong>
              </p>
              <p className="text-xs text-gray-400 mb-6">Didn't receive it? Check your spam folder.</p>
              <Link to="/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-1">Forgot Password?</h1>
                <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input input-icon"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
                  {loading ? 'Sending...' : <><FiSend size={16} /> Send Reset Link</>}
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 mt-6 transition-colors">
            <FiArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
