import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import {
  ClipboardList,
  FileCheck,
  Layers,
  LayoutDashboard,
  LogIn,
  LogOut,
  Megaphone,
  PackageCheck,
  PlusCircle,
  Search,
  ShieldAlert,
  User,
  Users,
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { user, role, logout } = useAuth();

  const isGuest = !user && !role;

  const getDashboardPath = () => {
    if (role === 'ADMIN' || role === 'STAFF') {
      return '/dashboard/admin';
    }

    return '/dashboard/student';
  };

  const guestNavItems: NavigationItem[] = [
    {
      label: 'Home / Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Browse & Search',
      path: '/items',
      icon: Search,
    },
    {
      label: 'Public Announcements',
      path: '/announcements',
      icon: Megaphone,
    },
    {
      label: 'Login',
      path: '/login',
      icon: LogIn,
    },
    {
      label: 'Register',
      path: '/register',
      icon: Users,
    },
  ];

  const authNavItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: getDashboardPath(),
      icon: LayoutDashboard,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
    {
      label: 'Browse & Search',
      path: '/items',
      icon: Search,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
    {
      label: 'Report Lost Item',
      path: '/items/report-lost',
      icon: PlusCircle,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
    {
      label: 'Report Found Item',
      path: '/items/report-found',
      icon: PackageCheck,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
    {
      label: 'Claims Verification',
      path: '/claims',
      icon: FileCheck,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
      ],
    },
    {
      label: 'Pending Approvals',
      path: '/approvals',
      icon: ShieldAlert,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
      ],
    },
    {
      label: 'My Claims History',
      path: '/my-claims',
      icon: FileCheck,
      roles: ['STUDENT', 'TEACHER'],
    },
    {
      label: 'Announcements',
      path: '/announcements',
      icon: Megaphone,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
    {
      label: 'User Directory',
      path: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      label: 'Categories & Locations',
      path: '/admin/master',
      icon: Layers,
      roles: ['ADMIN'],
    },
    {
      label: 'System Audit Logs',
      path: '/admin/audit-logs',
      icon: ClipboardList,
      roles: ['ADMIN'],
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: User,
      roles: [
        'ADMIN',
        'STAFF',
        'TEACHER',
        'STUDENT',
      ],
    },
  ];

  const filteredNav = isGuest
    ? guestNavItems
    : authNavItems.filter(
        (item) =>
          !role ||
          !item.roles ||
          item.roles.includes(role)
      );

  /*
   * Close mobile navigation whenever the user presses Escape.
   */
  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onMobileClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [isMobileOpen, onMobileClose]);

  const handleNavigation = () => {
    onMobileClose?.();
  };

  const handleLogout = () => {
    onMobileClose?.();
    logout();
  };

  const renderNavigation = (mobile = false) => (
    <div className="space-y-1.5">
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Operations
      </p>

      {filteredNav.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={mobile ? handleNavigation : undefined}
            className={({ isActive }) =>
              `
                flex
                min-h-11
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-xs
                font-semibold
                transition-all
                duration-200
                ${
                  isActive
                    ? 'border border-sky-400/25 bg-sky-500/10 text-sky-100 shadow-[0_0_0_1px_rgba(14,165,233,0.2)]'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'
                }
              `
            }
          >
            <Icon className="h-4 w-4 shrink-0 text-sky-300" />

            <span className="min-w-0 truncate">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );

  const renderFooter = (mobile = false) => (
    <div className="border-t border-slate-800/80 p-4">
      {isGuest ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
          <p className="font-bold text-slate-100">
            Guest access
          </p>

          <p className="mt-1 text-slate-400">
            Browse the public item registry.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={
                user?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
              }
              alt="User Avatar"
              className="h-9 w-9 shrink-0 rounded-full border border-sky-500/40 object-cover"
            />

            <div className="min-w-0 truncate">
              <p className="truncate text-xs font-semibold text-slate-200">
                {user
                  ? `${user.firstName} ${user.lastName}`
                  : 'User'}
              </p>

              {role && (
                <span className="mt-1 inline-block max-w-full truncate rounded border border-sky-500/20 bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold text-sky-200">
                  {role}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="
              shrink-0
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-rose-500/10
              hover:text-rose-400
            "
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="
          hidden
          min-h-screen
          w-64
          shrink-0
          flex-col
          justify-between
          border-r
          border-slate-800/80
          md:flex
          lg:w-72
        "
      >
        <div className="glass-panel flex min-h-screen flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/30 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 text-lg font-black text-white shadow-lg shadow-sky-500/20">
                LF
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-black tracking-[0.12em] text-slate-100">
                  LOST & FOUND
                </h1>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">
                  ERP Portal
                </p>
              </div>
            </div>

            <div className="p-4">
              {renderNavigation()}
            </div>
          </div>

          {renderFooter()}
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onMobileClose}
          className="
            mobile-overlay
            fixed
            inset-0
            z-40
            bg-slate-950/70
            backdrop-blur-sm
            md:hidden
          "
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        aria-hidden={!isMobileOpen}
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[min(86vw,20rem)]
          flex-col
          border-r
          border-slate-800/80
          bg-slate-950
          shadow-2xl
          md:hidden
          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          transition-transform
          duration-300
          ease-out
        `}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Mobile sidebar header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/90 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-teal-500 text-base font-black text-white shadow-lg shadow-sky-500/20">
                LF
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-sm font-black tracking-[0.1em] text-slate-100">
                  LOST & FOUND
                </h1>

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                  ERP Portal
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close navigation menu"
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
                bg-slate-900
                text-slate-300
                transition
                hover:border-sky-500/40
                hover:text-white
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto p-4">
            {renderNavigation(true)}
          </nav>

          {/* Mobile footer */}
          <div className="shrink-0">
            {renderFooter(true)}
          </div>
        </div>
      </aside>
    </>
  );
};