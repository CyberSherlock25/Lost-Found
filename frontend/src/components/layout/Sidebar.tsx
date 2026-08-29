import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  PackageCheck,
  FileCheck,
  Megaphone,
  Users,
  Layers,
  MapPin,
  ClipboardList,
  User,
  ShieldAlert,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();

  const getDashboardPath = () => {
    if (role === 'ADMIN' || role === 'STAFF') return '/dashboard/admin';
    return '/dashboard/student';
  };

  const navItems = [
    { label: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Browse & Search', path: '/items', icon: Search, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Report Lost Item', path: '/items/report-lost', icon: PlusCircle, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Report Found Item', path: '/items/report-found', icon: PackageCheck, roles: ['ADMIN', 'STAFF'] },
    { label: 'Claims Verification', path: '/claims', icon: FileCheck, roles: ['ADMIN', 'STAFF', 'TEACHER'] },
    { label: 'Pending Approvals', path: '/approvals', icon: ShieldAlert, roles: ['ADMIN', 'STAFF', 'TEACHER'] },
    { label: 'My Claims History', path: '/my-claims', icon: FileCheck, roles: ['STUDENT', 'TEACHER'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'User Directory', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { label: 'Categories & Locations', path: '/admin/master', icon: Layers, roles: ['ADMIN'] },
    { label: 'System Audit Logs', path: '/admin/audit-logs', icon: ClipboardList, roles: ['ADMIN'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
  ];

  const filteredNav = navItems.filter(item => !role || item.roles.includes(role));

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
            LF
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-100 tracking-wide">LOST & FOUND</h1>
            <p className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Smart University</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 text-white border border-indigo-500/30 shadow-md shadow-indigo-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
              <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {role || 'STUDENT'}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
