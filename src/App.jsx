import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';

import Navbar         from './components/Navbar';
import Footer         from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerRoute  from './components/CustomerRoute';
import BackendStatus  from './components/BackendStatus';

import Home           from './pages/Home';
import Shop           from './pages/Shop';
import ProductDetail  from './pages/ProductDetail';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import OrderSuccess   from './pages/OrderSuccess';
import Orders         from './pages/Orders';
import OrderDetail    from './pages/OrderDetail';
import Wishlist       from './pages/Wishlist';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Profile        from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AISearch       from './pages/AISearch';

// Admin Pages
import AdminLayout    from './pages/Admin/AdminLayout';
import Dashboard      from './pages/Admin/Dashboard';
import AdminProducts  from './pages/Admin/AdminProducts';
import AdminOrders    from './pages/Admin/AdminOrders';
import AdminUsers     from './pages/Admin/AdminUsers';

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppInit() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        }}
      />
      <Routes>
        {/* ── Public ── */}
        <Route path="/"               element={<CustomerRoute><StoreLayout><Home /></StoreLayout></CustomerRoute>} />
        <Route path="/shop"           element={<CustomerRoute><StoreLayout><Shop /></StoreLayout></CustomerRoute>} />
        <Route path="/product/:id"    element={<CustomerRoute><StoreLayout><ProductDetail /></StoreLayout></CustomerRoute>} />
        <Route path="/cart"           element={<CustomerRoute><StoreLayout><Cart /></StoreLayout></CustomerRoute>} />
        <Route path="/wishlist"       element={<CustomerRoute><StoreLayout><Wishlist /></StoreLayout></CustomerRoute>} />
        <Route path="/ai-search"      element={<CustomerRoute><StoreLayout><AISearch /></StoreLayout></CustomerRoute>} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* ── Protected ── */}
        <Route path="/checkout"      element={<ProtectedRoute><CustomerRoute><StoreLayout><Checkout /></StoreLayout></CustomerRoute></ProtectedRoute>} />
        <Route path="/orders"        element={<ProtectedRoute><CustomerRoute><StoreLayout><Orders /></StoreLayout></CustomerRoute></ProtectedRoute>} />
        <Route path="/orders/:id"    element={<ProtectedRoute><CustomerRoute><StoreLayout><OrderDetail /></StoreLayout></CustomerRoute></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><CustomerRoute><StoreLayout><OrderSuccess /></StoreLayout></CustomerRoute></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><StoreLayout><Profile /></StoreLayout></ProtectedRoute>} />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={
          <StoreLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
              <p className="text-9xl font-black text-gray-100 mb-4 select-none">404</p>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Page not found</h2>
              <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary !py-3.5 !px-8">Go Home</a>
            </div>
          </StoreLayout>
        } />
      </Routes>
      
      {/* Backend Connection Status - Only in development */}
      {import.meta.env.DEV && <BackendStatus />}
    </BrowserRouter>
  );
}
