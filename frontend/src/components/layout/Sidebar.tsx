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
  ClipboardList,
  User,
  ShieldAlert,
  LogOut,
  LogIn
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const isGuest = !user && !role;

  const getDashboardPath = () => {
    if (role === 'ADMIN' || role === 'STAFF') return '/dashboard/admin';
    return '/dashboard/student';
  };

  const guestNavItems = [
    { label: 'Home / Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Browse & Search', path: '/items', icon: Search },
    { label: 'Public Announcements', path: '/announcements', icon: Megaphone },
    { label: 'Login', path: '/login', icon: LogIn },
    { label: 'Register', path: '/register', icon: Users },
  ];

  const authNavItems = [
    { label: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Browse & Search', path: '/items', icon: Search, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Report Lost Item', path: '/items/report-lost', icon: PlusCircle, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Report Found Item', path: '/items/report-found', icon: PackageCheck, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'Claims Verification', path: '/claims', icon: FileCheck, roles: ['ADMIN', 'STAFF', 'TEACHER'] },
    { label: 'Pending Approvals', path: '/approvals', icon: ShieldAlert, roles: ['ADMIN', 'STAFF', 'TEACHER'] },
    { label: 'My Claims History', path: '/my-claims', icon: FileCheck, roles: ['STUDENT', 'TEACHER'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
    { label: 'User Directory', path: '/admin/users', icon: Users, roles: ['ADMIN'] },
    { label: 'Categories & Locations', path: '/admin/master', icon: Layers, roles: ['ADMIN'] },
    { label: 'System Audit Logs', path: '/admin/audit-logs', icon: ClipboardList, roles: ['ADMIN'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['ADMIN', 'STAFF', 'TEACHER', 'STUDENT'] },
  ];

  const filteredNav = isGuest ? guestNavItems : authNavItems.filter(item => !role || item.roles.includes(role));

  return (
    <aside className="w-72 glass-panel border-r border-slate-800/80 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 bg-slate-950/30">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-lg">
            LF
          </div>
          <div>
            <h1 className="font-black text-sm text-slate-100 tracking-[0.12em]">LOST & FOUND</h1>
            <p className="text-[10px] text-sky-300 font-semibold tracking-[0.2em] uppercase">ERP Portal</p>
          </div>
        </div>

        <div className="p-4 space-y-1.5">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-2">Operations</p>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-100 border border-sky-400/25 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-sky-300" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        {isGuest ? (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 text-xs text-slate-300">
            <p className="font-bold text-slate-100">Guest access</p>
            <p className="mt-1 text-slate-400">Browse the public item registry.</p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="User Avatar"
                className="w-9 h-9 rounded-full object-cover border border-sky-500/40"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user ? `${user.firstName} ${user.lastName}` : 'User'}</p>
                {role && (
                  <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-sky-500/10 text-sky-200 border border-sky-500/20">
                    {role}
                  </span>
                )}
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
        )}
      </div>
    </aside>
  );
};
