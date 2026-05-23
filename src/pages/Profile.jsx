import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCamera, FiSave, FiLock, FiEye, FiEyeOff, FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { updateUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || null,
  });

  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePwdChange = (e) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, avatar: { url: reader.result, file } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (form.avatar?.file) {
        formData.append('avatar', form.avatar.file);
      }

      const { data } = await authAPI.updateProfile(formData);
      dispatch(updateUser(data.user));
      toast.success('Profile updated!', { style: { borderRadius: '14px' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed', { style: { borderRadius: '14px' } });
    } finally {
      setSaving(false);
    }
  };

  const handlePwdSave = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPwd(true);
    try {
      await authAPI.updatePassword(pwdForm);
      toast.success('Password updated!', { style: { borderRadius: '14px' } });
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed', { style: { borderRadius: '14px' } });
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-black text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                {form.avatar?.url ? (
                  <img 
                    src={form.avatar.url} 
                    alt={user?.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <FiCamera size={14} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
            <p className="text-gray-500 text-sm mb-3">{user?.email}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              user?.role === 'Admin' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role}
            </span>

            {/* Stats - Hide for Admin */}
            {user?.role !== 'Admin' && (
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FiShoppingBag className="text-blue-600" size={16} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FiHeart className="text-rose-600" size={16} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">8</p>
                  <p className="text-xs text-gray-500">Wishlist</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FiStar className="text-amber-600" size={16} />
                  </div>
                  <p className="text-lg font-bold text-gray-900">5</p>
                  <p className="text-xs text-gray-500">Reviews</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Profile Information</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      {/* <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Password Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Change Password</h3>
              <form onSubmit={handlePwdSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    {/* <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
                    <input
                      type={showOldPwd ? 'text' : 'password'}
                      name="oldPassword"
                      value={pwdForm.oldPassword}
                      onChange={handlePwdChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPwd(!showOldPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      {/* <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        name="newPassword"
                        value={pwdForm.newPassword}
                        onChange={handlePwdChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      {/* <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        name="confirmPassword"
                        value={pwdForm.confirmPassword}
                        onChange={handlePwdChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingPwd ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiLock size={16} />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}