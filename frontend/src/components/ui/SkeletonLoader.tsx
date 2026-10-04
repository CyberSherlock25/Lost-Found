import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'card' | 'list' | 'stat';
}

export const SkeletonLoader: React.FC<
  SkeletonLoaderProps
> = ({
  count = 6,
  variant = 'card',
}) => {
  if (variant === 'stat') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-3 w-24 rounded bg-slate-800" />
                <div className="h-8 w-16 rounded bg-slate-800" />
                <div className="h-3 w-32 rounded bg-slate-800" />
              </div>

              <div className="h-12 w-12 shrink-0 rounded-2xl bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5"
          >
            <div className="flex gap-4">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-800 sm:h-20 sm:w-20" />

              <div className="min-w-0 flex-1 space-y-3">
                <div className="h-4 w-1/3 rounded bg-slate-800" />
                <div className="h-3 w-3/4 rounded bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50"
        >
          <div className="h-44 w-full bg-slate-800/70 sm:h-48" />

          <div className="space-y-4 p-4 sm:p-5">
            <div className="h-3 w-1/3 rounded bg-slate-800" />

            <div className="h-5 w-3/4 rounded bg-slate-800" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-800" />
              <div className="h-3 w-5/6 rounded bg-slate-800" />
            </div>

            <div className="border-t border-slate-800/80 pt-3">
              <div className="h-3 w-2/3 rounded bg-slate-800" />
            </div>

            <div className="h-10 w-full rounded-xl bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
};