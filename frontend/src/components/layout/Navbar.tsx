import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationDrawer } from './NotificationDrawer';
import { api } from '../../services/api';
import { Bell, Search, User, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/notifications/unread-count')
        .then((res) => setUnreadCount(res.data.data))
        .catch(() => {});
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="h-16 glass-panel border-b border-slate-800/80 sticky top-0 z-30 px-6 flex items-center justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-72 md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search laptop, wallet, ID card, keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl glass-input text-xs"
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/items/report-lost"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-btn text-xs font-semibold text-white shadow-lg shadow-indigo-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/50 transition"
            >
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-indigo-500/40"
              />
              <span className="hidden lg:inline text-xs font-semibold text-slate-200">
                {user?.firstName}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-panel border border-slate-800 rounded-xl shadow-xl py-1 z-40">
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white"
                >
                  <User className="w-4 h-4 text-indigo-400" /> Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
