import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { StudentDashboardData } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { ItemCard } from '../components/items/ItemCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { FileQuestion, CheckCircle2, Clock, Megaphone, PlusCircle, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/student')
      .then((res) => setDashboardData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader count={3} />;

  return (
    <div className="space-y-8">
      <div className="relative rounded-[28px] glass-panel p-8 overflow-hidden border border-sky-500/20 shadow-[0_32px_70px_-34px_rgba(14,165,233,0.38)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/16 via-cyan-500/0 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/8 border border-sky-500/20 text-sky-200 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Campus Recovery Operations
            </div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Track your reported lost belongings, manage ownership claim requests, and monitor campus item recovery workflows.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/items/report-lost"
              className="px-5 py-3 rounded-2xl gradient-btn text-xs font-bold text-white flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Report Lost Item
            </Link>
            <Link
              to="/items"
              className="px-5 py-3 rounded-2xl glass-panel text-xs font-bold text-slate-200 hover:text-white border border-slate-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-sky-300" /> Search Items
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Lost Reports"
          value={dashboardData?.myReportedItemsCount || 0}
          icon={FileQuestion}
          color="indigo"
          subtitle="Items you reported lost"
        />
        <StatCard
          title="Total Claims"
          value={dashboardData?.myClaimsCount || 0}
          icon={Clock}
          color="violet"
          subtitle="Submitted ownership claims"
        />
        <StatCard
          title="Pending Review"
          value={dashboardData?.pendingClaimsCount || 0}
          icon={Clock}
          color="amber"
          subtitle="Awaiting admin verification"
        />
        <StatCard
          title="Approved Claims"
          value={dashboardData?.approvedClaimsCount || 0}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Ready for pickup"
        />
      </div>

      {/* Campus Announcements Banner */}
      {dashboardData?.announcements && dashboardData.announcements.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-indigo-950/20">
          <div className="flex items-center gap-2.5 mb-3 text-indigo-400 font-bold text-sm">
            <Megaphone className="w-5 h-5" />
            <span>Campus Notice Board</span>
          </div>
          <div className="space-y-3">
            {dashboardData.announcements.slice(0, 2).map((a) => (
              <div key={a.announcementId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-sm font-bold text-slate-200">{a.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Found Items Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Recently Turned-in Items</h2>
            <p className="text-xs text-slate-400">Items found by campus security and staff</p>
          </div>
          <Link to="/items" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
            View All ({dashboardData?.recentFoundItems?.length || 0}) →
          </Link>
        </div>

        {dashboardData?.recentFoundItems?.length === 0 ? (
          <div className="text-center py-10 glass-card rounded-2xl text-slate-400 text-xs">
            No items turned in recently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData?.recentFoundItems?.slice(0, 6).map((item) => (
              <ItemCard key={item.itemId} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Active Claims Tracker */}
      {dashboardData?.myActiveClaims && dashboardData.myActiveClaims.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold text-slate-100 mb-4">My Claim Request Tracker</h2>
          <div className="divide-y divide-slate-800/80">
            {dashboardData.myActiveClaims.map((claim) => (
              <div key={claim.claimId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">{claim.item?.title}</h4>
                  <p className="text-slate-400 mt-0.5">{claim.proofDescription}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  claim.claimStatus === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : claim.claimStatus === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {claim.claimStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
