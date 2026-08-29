import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { UploadLostReportPage } from './pages/UploadLostReportPage';
import { UploadFoundItemPage } from './pages/UploadFoundItemPage';
import { ClaimsManagementPage } from './pages/ClaimsManagementPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { CategoryLocationManagementPage } from './pages/CategoryLocationManagementPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { PendingApprovalsPage } from './pages/PendingApprovalsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                borderRadius: '12px',
              },
            }}
          />

          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Error Pages */}
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* The first screen is always a guest-friendly introduction. */}
            <Route path="/" element={<PublicLandingPage />} />

            {/* Public browsing remains available without authentication. */}
            <Route element={<AppLayout />}>
              <Route path="/items" element={<BrowseItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailsPage />} />
            </Route>

            {/* Protected enterprise actions and dashboards */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard/student" element={<StudentDashboardPage />} />
                <Route path="/dashboard/admin" element={<AdminDashboardPage />} />

                <Route path="/items/report-lost" element={<UploadLostReportPage />} />
                <Route path="/items/report-found" element={<UploadFoundItemPage />} />

                <Route path="/my-claims" element={<MyClaimsPage />} />
                <Route path="/claims" element={<ClaimsManagementPage />} />
                <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'TEACHER']} />}>
                  <Route path="/approvals" element={<PendingApprovalsPage />} />
                </Route>

                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin Only Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route path="/admin/master" element={<CategoryLocationManagementPage />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};
