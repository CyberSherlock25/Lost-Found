import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="glass-card p-12 rounded-3xl max-w-md border border-slate-800 space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-4xl font-black text-rose-500">403</h1>
        <h2 className="text-xl font-bold text-slate-100">Access Denied</h2>
        <p className="text-xs text-slate-400">You do not have administrative permissions to access this page.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel text-xs font-bold text-slate-200 mt-4 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Safety
        </Link>
      </div>
    </div>
  );
};
