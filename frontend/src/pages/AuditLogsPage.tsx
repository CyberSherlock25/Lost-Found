import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Activity, Search, ShieldAlert } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then((res) => setLogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter(l =>
    `${l.action} ${l.entityName} ${l.userName} ${l.userEmail} ${l.ipAddress}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <SkeletonLoader count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100">System Security Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time immutable activity log stream across all system resources</p>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Triggered By</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((l) => (
                <tr key={l.auditLogId} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-indigo-400">{l.action}</td>
                  <td className="p-4 text-slate-200">{l.entityName} #{l.entityId || 'N/A'}</td>
                  <td className="p-4 text-slate-300 font-sans">
                    {l.userName ? `${l.userName} (${l.userEmail})` : 'Anonymous / System'}
                  </td>
                  <td className="p-4 text-slate-400">{l.ipAddress || '127.0.0.1'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      {l.actionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
