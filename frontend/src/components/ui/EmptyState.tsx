import React from 'react';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Items Found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto border border-slate-800 my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 rounded-xl gradient-btn text-xs font-semibold text-white shadow-lg shadow-indigo-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
