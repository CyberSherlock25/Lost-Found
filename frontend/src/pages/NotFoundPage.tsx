import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div className="glass-card p-12 rounded-3xl max-w-md border border-slate-800 space-y-4">
        <h1 className="text-6xl font-black text-indigo-500">404</h1>
        <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
        <p className="text-xs text-slate-400">The requested resource or page does not exist on this portal.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-btn text-xs font-bold text-white mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
