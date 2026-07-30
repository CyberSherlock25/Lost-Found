import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';
import { Users, Search, Shield, CheckCircle, XCircle } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then((res) => setUsers(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    try {
      await api.patch(`/users/${userId}/status`);
      toast.success('User status updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      await api.patch(`/users/${userId}/role?roleId=${roleId}`);
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.universityId}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <SkeletonLoader count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">User Management Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage system access roles and account activations</p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">University ID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={u.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="font-bold text-slate-200">{u.firstName} {u.lastName}</p>
                      <p className="text-slate-400 text-[10px]">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{u.universityId}</td>
                  <td className="p-4">
                    <select
                      value={u.roleId}
                      onChange={(e) => handleRoleChange(u.userId, Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
                    >
                      <option value={1}>ADMIN</option>
                      <option value={2}>STAFF</option>
                      <option value={3}>TEACHER</option>
                      <option value={4}>STUDENT</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-400">{u.departmentName || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.userId)}
                      className="px-3 py-1 rounded-lg text-xs font-medium glass-panel hover:bg-slate-800 text-slate-300"
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
