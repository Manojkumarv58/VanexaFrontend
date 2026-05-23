import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiSearch } from 'react-icons/fi';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

function ProductModal({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    stock: product?.stock || '',
  });
  const [files,   setFiles]   = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('images', f));

      if (isEdit) {
        await productAPI.update(product.id, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { name: 'name',        label: 'Product Name', placeholder: 'e.g. Premium Sneakers' },
            { name: 'price',       label: 'Price (₹)',    placeholder: '999', type: 'number' },
            { name: 'category',    label: 'Category',     placeholder: 'e.g. Men, Electronics' },
            { name: 'stock',       label: 'Stock',        placeholder: '100', type: 'number' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                required
                className="input"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
              required
              className="input resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Images</label>
            <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <FiUpload size={24} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload images</span>
              <input type="file" multiple accept="image/*" onChange={e => setFiles(Array.from(e.target.files))} className="hidden" />
            </label>
            {files.length > 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-semibold">{files.length} file(s) selected</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary !rounded-2xl !py-3">
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | 'add' | product
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ page, limit: 10, search });
      setProducts(data.products || []);
      setTotal(data.totalProducts || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{total} total products</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary">
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all w-full max-w-sm">
        <FiSearch size={15} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="text-sm outline-none flex-1 text-gray-800 placeholder-gray-400 bg-transparent"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="text-right px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || `https://placehold.co/48x48/f3f4f6/9ca3af?text=V`}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                      />
                      <p className="text-sm font-semibold text-gray-900 clamp-1">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{p.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      p.stock === 0 ? 'bg-red-100 text-red-600' :
                      p.stock <= 5 ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModal(p)}
                        className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10) || 1}</p>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
          <button disabled={products.length < 10} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
