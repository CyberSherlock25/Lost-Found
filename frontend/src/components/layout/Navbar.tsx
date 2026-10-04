import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  User,
  UserPlus,
  X,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { NotificationDrawer } from './NotificationDrawer';
import { api } from '../../services/api';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    api
      .get('/notifications/unread-count')
      .then((res) => {
        setUnreadCount(Number(res.data.data) || 0);
      })
      .catch(() => {
        setUnreadCount(0);
      });
  }, [user]);

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setIsSearchOpen(false);

    navigate(`/items?query=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-30
          flex
          min-h-16
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          border-b
          border-slate-800/80
          bg-slate-950/85
          px-3
          backdrop-blur-xl
          sm:px-4
          md:min-h-[4.5rem]
          md:px-6
        "
      >
        {/* Left section */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="
              inline-flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-800
              bg-slate-900/80
              text-slate-300
              transition
              hover:border-sky-500/40
              hover:text-white
              md:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop / tablet search */}
          <form
            onSubmit={handleSearchSubmit}
            className="
              relative
              hidden
              min-w-0
              flex-1
              sm:block
              sm:max-w-sm
              md:max-w-md
              lg:max-w-xl
            "
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search items, categories..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              className="
                glass-input
                h-10
                w-full
                rounded-xl
                pl-9
                pr-4
                text-xs
                placeholder:text-slate-500
              "
              aria-label="Search lost and found items"
            />
          </form>

          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
            className="
              inline-flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-slate-800
              bg-slate-900/80
              text-slate-300
              transition
              hover:border-sky-500/40
              hover:text-white
              sm:hidden
            "
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          {!user ? (
            <>
              {/* Guest login */}
              <Link
                to="/login"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900/80
                  px-3
                  text-xs
                  font-semibold
                  text-slate-100
                  transition
                  hover:border-sky-500/60
                  sm:px-4
                "
              >
                <LogIn className="h-4 w-4 text-sky-300" />

                <span className="hidden xs:inline">
                  Login
                </span>
              </Link>

              {/* Guest register */}
              <Link
                to="/register"
                className="
                  gradient-btn
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-3
                  text-xs
                  font-semibold
                  text-white
                  sm:px-4
                "
              >
                <UserPlus className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Register
                </span>
              </Link>
            </>
          ) : (
            <>
              {/* Report Lost */}
              <Link
                to="/items/report-lost"
                className="
                  gradient-btn
                  hidden
                  h-10
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  px-3
                  text-xs
                  font-semibold
                  text-white
                  transition
                  sm:flex
                "
              >
                <PlusCircle className="h-4 w-4" />

                <span className="hidden md:inline">
                  Report Lost
                </span>
              </Link>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label={
                  unreadCount > 0
                    ? `${unreadCount} unread notifications`
                    : 'Notifications'
                }
                className="
                  relative
                  inline-flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/80
                  text-slate-300
                  transition
                  hover:border-sky-500/40
                  hover:text-white
                "
              >
                <Bell className="h-4 w-4" />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-rose-500
                      px-1
                      text-[9px]
                      font-bold
                      leading-none
                      text-white
                      shadow-lg
                    "
                  >
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsProfileOpen(
                      (previous) => !previous
                    )
                  }
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                  className="
                    flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    p-1
                    transition
                    hover:bg-slate-800/60
                  "
                >
                  <img
                    src={
                      user.profileImage ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    }
                    alt="Profile"
                    className="
                      h-8
                      w-8
                      rounded-full
                      border
                      border-sky-500/40
                      object-cover
                      sm:h-9
                      sm:w-9
                    "
                  />

                  <span className="hidden max-w-24 truncate text-xs font-semibold text-slate-200 lg:inline">
                    {user.firstName}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    {/* Mobile backdrop */}
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      onClick={() =>
                        setIsProfileOpen(false)
                      }
                      className="
                        fixed
                        inset-0
                        z-30
                        cursor-default
                        bg-transparent
                      "
                    />

                    <div
                      className="
                        glass-panel
                        absolute
                        right-0
                        top-full
                        z-40
                        mt-2
                        w-52
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-800
                        shadow-2xl
                      "
                    >
                      <div className="border-b border-slate-800/80 px-4 py-3">
                        <p className="truncate text-xs font-semibold text-slate-100">
                          {user.firstName} {user.lastName}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-500">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() =>
                          setIsProfileOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-2
                          px-4
                          py-3
                          text-xs
                          text-slate-300
                          transition
                          hover:bg-slate-800/60
                          hover:text-white
                        "
                      >
                        <User className="h-4 w-4 text-sky-300" />
                        Profile Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex
                          w-full
                          items-center
                          gap-2
                          px-4
                          py-3
                          text-left
                          text-xs
                          text-rose-400
                          transition
                          hover:bg-rose-500/10
                        "
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 p-3 backdrop-blur-xl sm:hidden">
          <div className="flex items-center gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative min-w-0 flex-1"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                autoFocus
                type="text"
                placeholder="Search lost & found items..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="
                  glass-input
                  h-11
                  w-full
                  rounded-xl
                  pl-9
                  pr-4
                  text-sm
                  placeholder:text-slate-500
                "
                aria-label="Search lost and found items"
              />
            </form>

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="
                inline-flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-slate-800
                bg-slate-900
                text-slate-300
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

{user && (
  <NotificationDrawer
    isOpen={isDrawerOpen}
    onClose={() => setIsDrawerOpen(false)}
    onUnreadCountChange={setUnreadCount}
  />
)}
    </>
  );
};