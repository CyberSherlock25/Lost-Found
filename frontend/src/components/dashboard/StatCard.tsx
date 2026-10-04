import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color:
    | 'indigo'
    | 'emerald'
    | 'amber'
    | 'rose'
    | 'violet';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
    },
    violet: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/20',
    },
  };

  const theme = colorMap[color];

  return (
    <div
      className="
        glass-card
        flex
        min-w-0
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        border-slate-800/80
        p-5
        transition
        hover:border-slate-700
        sm:p-6
      "
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-xs sm:tracking-wider">
          {title}
        </p>

        <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
          {value}
        </h3>

        {subtitle && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          border
          shadow-inner
          sm:h-12
          sm:w-12
          ${theme.bg}
          ${theme.text}
          ${theme.border}
        `}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
    </div>
  );
};