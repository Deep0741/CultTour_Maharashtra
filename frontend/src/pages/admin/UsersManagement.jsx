import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiSearch, FiTrash2 } from 'react-icons/fi';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await api.delete(`/admin/users/${id}`); setUsers(prev => prev.filter(u => u._id !== id)); }
    catch (err) { alert("Failed to delete user."); }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (roleFilter ? u.role === roleFilter : true);
  });

  const roleConfig = {
    admin: { color: "bg-accent-100 text-accent-700", icon: "🛡️" },
    guide: { color: "bg-emerald-100 text-emerald-700", icon: "🧭" },
    tourist: { color: "bg-blue-100 text-blue-700", icon: "✈️" },
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-surface-800 mb-8 animate-slide-up">
          Manage <span className="gradient-text">Users</span>
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 animate-slide-up stagger-1">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
            <input
              type="text" placeholder="Search by name or email..."
              className="input-field !pl-11" value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field !w-auto" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="tourist">Tourists</option>
            <option value="guide">Guides</option>
            <option value="admin">Admins</option>
          </select>
          <span className="text-surface-400 text-sm self-center">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="card border border-surface-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><div className="spinner" /></div>
          ) : filteredUsers.length === 0 ? (
            <p className="py-16 text-center text-surface-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 border-b border-surface-100">
                  <tr className="text-left text-surface-500 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-surface-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-xs font-bold">
                            {u.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-surface-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-500">{u.email}</td>
                      <td className="py-3 px-4 text-surface-500">{u.phone || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${roleConfig[u.role]?.color || 'bg-surface-100 text-surface-600'}`}>
                          {roleConfig[u.role]?.icon} {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-surface-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3 px-4">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => deleteUser(u._id, u.name)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
                          >
                            <FiTrash2 size={13} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
