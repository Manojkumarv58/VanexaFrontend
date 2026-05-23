import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', { style: { borderRadius: '14px' } });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', { style: { borderRadius: '14px' } });
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      setSuccess(true);
      toast.success('Password reset successful!', { style: { borderRadius: '14px' } });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password', { style: { borderRadius: '14px' } });
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
          {success ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheck size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been updated successfully. Redirecting to login...
              </p>
              <Link to="/login" className="btn-primary">Go to Login</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-1">Reset Password</h1>
                <p className="text-gray-500 text-sm">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      className="input input-icon pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      className="input input-icon pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 mt-6 transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}