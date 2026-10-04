import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileQuestion,
  Megaphone,
  PlusCircle,
  Search,
  Sparkles,
  UserCheck,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Claim, StudentDashboardData } from '../types';

import { StatCard } from '../components/dashboard/StatCard';
import { ItemCard } from '../components/items/ItemCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { ErrorState } from '../components/ui/ErrorState';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState<StudentDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const requestIdRef = useRef(0);

  /*
   * Fetch dashboard data
   */
  const fetchDashboard = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(false);

    try {
      const response = await api.get('/dashboard/student', {
        signal,
      });

      if (
        signal?.aborted ||
        requestId !== requestIdRef.current
      ) {
        return;
      }

      const rawData = response.data?.data;

      if (!rawData || typeof rawData !== 'object') {
        setDashboardData(null);
        setError(true);
        return;
      }

      const safeData: StudentDashboardData = {
        myReportedItemsCount: Number(
          rawData.myReportedItemsCount ?? 0
        ),

        myClaimsCount: Number(
          rawData.myClaimsCount ?? 0
        ),

        pendingClaimsCount: Number(
          rawData.pendingClaimsCount ?? 0
        ),

        approvedClaimsCount: Number(
          rawData.approvedClaimsCount ?? 0
        ),

        recentFoundItems: Array.isArray(
          rawData.recentFoundItems
        )
          ? rawData.recentFoundItems
          : [],

        myActiveClaims: Array.isArray(
          rawData.myActiveClaims
        )
          ? rawData.myActiveClaims
          : [],

        announcements: Array.isArray(
          rawData.announcements
        )
          ? rawData.announcements
          : [],
      };

      setDashboardData(safeData);
    } catch (err) {
      if (
        signal?.aborted ||
        requestId !== requestIdRef.current
      ) {
        return;
      }

      setDashboardData(null);
      setError(true);
    } finally {
      if (
        requestId === requestIdRef.current &&
        !signal?.aborted
      ) {
        setLoading(false);
      }
    }
  }, []);

  /*
   * Initial dashboard load
   */
  useEffect(() => {
    const controller = new AbortController();

    fetchDashboard(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDashboard]);

  /*
   * Claim status configuration
   */
  const getClaimStatus = (claim: Claim) => {
    const status = claim?.claimStatus;

    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          className:
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
          icon: CheckCircle2,
        };

      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          className:
            'border-sky-500/30 bg-sky-500/10 text-sky-400',
          icon: UserCheck,
        };

      case 'PENDING':
        return {
          label: 'Pending Review',
          className:
            'border-amber-500/30 bg-amber-500/10 text-amber-400',
          icon: Clock,
        };

      case 'COLLECTED':
        return {
          label: 'Collected',
          className:
            'border-violet-500/30 bg-violet-500/10 text-violet-400',
          icon: CheckCircle2,
        };

      case 'REJECTED':
        return {
          label: 'Rejected',
          className:
            'border-rose-500/30 bg-rose-500/10 text-rose-400',
          icon: AlertCircle,
        };

      default:
        return {
          label: 'Processing',
          className:
            'border-slate-600 bg-slate-800/60 text-slate-300',
          icon: Clock,
        };
    }
  };

  /*
   * Format announcement date safely
   */
  const formatAnnouncementDate = (
    date?: string
  ): string | null => {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-w-0 space-y-6 sm:space-y-8">
        {/* Hero skeleton */}
        <div className="h-48 animate-pulse rounded-3xl bg-slate-900/60 sm:h-56 lg:h-60" />

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-800" />
            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-800/70" />
          </div>

          <SkeletonLoader
            count={4}
            variant="stat"
          />
        </section>

        {/* Recent items */}
        <section>
          <div className="mb-4">
            <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />
            <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-800/70" />
          </div>

          <SkeletonLoader
            count={3}
            variant="card"
          />
        </section>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error || !dashboardData) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description="We couldn't load your student dashboard right now. Please try again."
        actionLabel="Reload Dashboard"
        onAction={() => fetchDashboard()}
      />
    );
  }

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-slate-900/50 p-5 shadow-[0_32px_70px_-34px_rgba(14,165,233,0.38)] sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="relative z-10 flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold text-sky-200">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                Campus Recovery Operations
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
              Welcome back,{' '}
              {user?.firstName || 'Student'}!
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">
              Track your reported lost belongings,
              manage ownership claim requests, and
              monitor campus item recovery workflows.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto">
            <Link
              to="/items/report-lost"
              className="
                gradient-btn
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-3
                text-xs
                font-bold
                text-white
                transition
                focus:outline-none
                focus:ring-2
                focus:ring-sky-400/50
                sm:rounded-2xl
                sm:px-5
              "
            >
              <PlusCircle className="h-4 w-4" />
              Report Lost Item
            </Link>

            <Link
              to="/items"
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-800/50
                px-4
                py-3
                text-xs
                font-bold
                text-slate-200
                transition
                hover:border-sky-500/40
                hover:bg-sky-500/10
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-sky-400/50
                sm:rounded-2xl
                sm:px-5
              "
            >
              <Search className="h-4 w-4 text-sky-300" />
              Search Items
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          OVERVIEW
      ========================================================= */}
      <section>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-100">
            Overview
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Your current recovery activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="My Lost Reports"
            value={dashboardData.myReportedItemsCount}
            icon={FileQuestion}
            color="indigo"
            subtitle="Items you reported lost"
          />

          <StatCard
            title="Total Claims"
            value={dashboardData.myClaimsCount}
            icon={Clock}
            color="violet"
            subtitle="Submitted ownership claims"
          />

          <StatCard
            title="Pending Review"
            value={dashboardData.pendingClaimsCount}
            icon={Clock}
            color="amber"
            subtitle="Awaiting admin verification"
          />

          <StatCard
            title="Approved Claims"
            value={dashboardData.approvedClaimsCount}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Ready for pickup"
          />
        </div>
      </section>

      {/* =========================================================
          ANNOUNCEMENTS
      ========================================================= */}
      {dashboardData.announcements.length > 0 && (
        <section className="rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5 text-sm font-bold text-indigo-300">
            <Megaphone className="h-5 w-5 shrink-0" />
            <span>Campus Notice Board</span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {dashboardData.announcements
              .slice(0, 4)
              .map((announcement) => {
                const date = formatAnnouncementDate(
                  announcement.createdAt
                );

                return (
                  <article
                    key={announcement.announcementId}
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-900/60
                      p-4
                      transition
                      hover:border-indigo-500/30
                      hover:bg-slate-900/80
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="min-w-0 text-sm font-bold text-slate-200">
                        {announcement.title}
                      </h4>

                      {announcement.isPinned && (
                        <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-indigo-300">
                          Pinned
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {announcement.message}
                    </p>

                    {date && (
                      <p className="mt-3 text-[10px] font-medium text-slate-600">
                        Posted {date}
                      </p>
                    )}
                  </article>
                );
              })}
          </div>
        </section>
      )}

      {/* =========================================================
          RECENT FOUND ITEMS
      ========================================================= */}
      <section>
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 sm:text-xl">
              Recently Turned-in Items
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Items found by campus security and staff.
            </p>
          </div>

          <Link
            to="/items"
            className="
              w-fit
              text-xs
              font-semibold
              text-sky-400
              transition
              hover:text-sky-300
            "
          >
            View All (
            {dashboardData.recentFoundItems.length}
            ) →
          </Link>
        </div>

        {dashboardData.recentFoundItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <FileQuestion className="h-5 w-5 text-slate-500" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-300">
              No recently found items
            </h3>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              There are no newly turned-in items available right
              now. Check back later or browse all available items.
            </p>

            <Link
              to="/items"
              className="
                mt-4
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-800/60
                px-4
                py-2.5
                text-xs
                font-bold
                text-slate-200
                transition
                hover:border-sky-500/40
                hover:bg-sky-500/10
                hover:text-white
              "
            >
              <Search className="h-4 w-4" />
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardData.recentFoundItems
              .slice(0, 6)
              .map((item) => (
                <ItemCard
                  key={item.itemId}
                  item={item}
                />
              ))}
          </div>
        )}
      </section>

      {/* =========================================================
          CLAIM TRACKER
      ========================================================= */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 sm:text-lg">
              My Claim Request Tracker
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Track the current status of your ownership claims.
            </p>
          </div>

          {dashboardData.myActiveClaims.length > 0 && (
            <span className="w-fit rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-[10px] font-bold text-slate-400">
              {dashboardData.myActiveClaims.length}{' '}
              {dashboardData.myActiveClaims.length === 1
                ? 'request'
                : 'requests'}
            </span>
          )}
        </div>

        {dashboardData.myActiveClaims.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
              <Clock className="h-5 w-5 text-slate-500" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-300">
              No active claims
            </h3>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-500">
              You don't have any active ownership claims right
              now. Found something that belongs to you? Search the
              available items and submit a claim.
            </p>

            <Link
              to="/items"
              className="
                mt-4
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-sky-500
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                transition
                hover:bg-sky-400
                focus:outline-none
                focus:ring-2
                focus:ring-sky-400/50
              "
            >
              <Search className="h-4 w-4" />
              Find an Item
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {dashboardData.myActiveClaims.map((claim) => {
              const status = getClaimStatus(claim);
              const StatusIcon = status.icon;

              return (
                <div
                  key={claim.claimId}
                  className="
                    flex
                    flex-col
                    gap-4
                    py-4
                    first:pt-1
                    last:pb-1
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <h4 className="truncate text-sm font-bold text-slate-200">
                        {claim.item?.title || 'Item'}
                      </h4>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {claim.proofDescription ||
                        'No proof description provided.'}
                    </p>

                    {claim.reviewedAt && (
                      <p className="mt-2 text-[10px] text-slate-600">
                        Reviewed{' '}
                        {formatAnnouncementDate(
                          claim.reviewedAt
                        ) || 'recently'}
                      </p>
                    )}

                    {claim.reviewerRemarks && (
                      <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Reviewer Remarks
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {claim.reviewerRemarks}
                        </p>
                      </div>
                    )}
                  </div>

                  <span
                    className={`
                      inline-flex
                      w-fit
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      ${status.className}
                    `}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboardPage;