import React from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<
  ProtectedRouteProps
> = ({ allowedRoles }) => {
  const {
    isAuthenticated,
    role,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="
              h-10
              w-10
              animate-spin
              rounded-full
              border-2
              border-slate-700
              border-t-sky-400
            "
            aria-label="Loading"
          />

          <p className="text-xs text-slate-400">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: `${location.pathname}${location.search}`,
        }}
        replace
      />
    );
  }

  if (
    allowedRoles &&
    role &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};