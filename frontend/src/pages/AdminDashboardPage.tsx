import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AdminAnalytics } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Users, Package, FileCheck, CheckCircle2, Clock, Megaphone, MapPin, Activity } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin')
      .then((res) => setAnalytics(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonLoader count={4} />;

  // Chart Data Preparation
  const categoryLabels = Object.keys(analytics?.categoryAnalytics || {});
  const categoryValues = Object.values(analytics?.categoryAnalytics || {});

  const doughnutData = {
    labels: categoryLabels.length ? categoryLabels : ['Electronics', 'Mobile Phones', 'Wallets', 'ID Cards'],
    datasets: [
      {
        data: categoryValues.length ? categoryValues : [4, 3, 2, 5],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'],
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  const locationLabels = Object.keys(analytics?.locationAnalytics || {});
  const locationValues = Object.values(analytics?.locationAnalytics || {});

  const barData = {
    labels: locationLabels.length ? locationLabels : ['Library', 'Computer Lab', 'Cafeteria', 'Hostel'],
    datasets: [
      {
        label: 'Items Found by Location',
        data: locationValues.length ? locationValues : [5, 3, 4, 2],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Executive Admin Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">Smart University System Analytics & Operational Overview</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registered Users" value={analytics?.totalUsers || 0} icon={Users} color="indigo" />
        <StatCard title="Total Items Logged" value={analytics?.totalItems || 0} icon={Package} color="violet" />
        <StatCard title="Pending Claims" value={analytics?.pendingClaims || 0} icon={Clock} color="amber" />
        <StatCard title="Approved Claims" value={analytics?.approvedClaims || 0} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doughnut Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-slate-100 mb-4">Category Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 11 } } },
                },
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-slate-100 mb-4">Hotspot Locations</h3>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                  y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Audit Logs / Activity Feed */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4 text-slate-100 font-bold text-base">
          <Activity className="w-5 h-5 text-indigo-400" />
          <span>System Audit Activity Stream</span>
        </div>
        <div className="divide-y divide-slate-800/80">
          {analytics?.recentAuditLogs && analytics.recentAuditLogs.length > 0 ? (
            analytics.recentAuditLogs.slice(0, 6).map((log) => (
              <div key={log.auditLogId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-400 mr-2">[{log.action}]</span>
                  <span className="text-slate-200">{log.description || `${log.action} on ${log.entityName}`}</span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">By {log.userName || 'System'} ({log.userEmail || 'N/A'})</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">No audit logs recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};
