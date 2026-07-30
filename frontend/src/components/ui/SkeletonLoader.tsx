import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass-card rounded-2xl p-5 space-y-4 animate-pulse">
          <div className="h-44 bg-slate-800/60 rounded-xl w-full"></div>
          <div className="h-4 bg-slate-800/60 rounded w-1/3"></div>
          <div className="h-5 bg-slate-800/60 rounded w-3/4"></div>
          <div className="h-3 bg-slate-800/60 rounded w-full"></div>
          <div className="h-8 bg-slate-800/60 rounded-xl w-full"></div>
        </div>
      ))}
    </div>
  );
};
