import { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiUser } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);

  const load = () => {
    adminAPI.getUsers({ page })
      .then(r => { setUsers(r.data.users || []); setTotal(r.data.totalUsers || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-3">
        {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-black text-gray-900">Users</h2>
        <p className="text-sm text-gray-500">{total} registered users</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-500">{user.email}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    user.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">No users found</div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">Page {page} of {Math.ceil(total / 10) || 1}</p>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
          <button disabled={users.length < 10} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
        </div>
      </div>
    </div>
  );
}
