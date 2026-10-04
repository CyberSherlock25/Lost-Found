import React from 'react';
import {
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'We were unable to load this information. Please try again.',
  actionLabel = 'Try Again',
  onAction,
}) => {
  return (
    <div className="mx-auto my-8 w-full max-w-lg rounded-2xl border border-rose-500/20 bg-slate-900/50 p-8 text-center shadow-xl sm:p-10">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-slate-100 sm:text-lg">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
        {description}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            gradient-btn
            mt-6
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-xl
            px-4
            py-2.5
            text-xs
            font-semibold
            text-white
            shadow-lg
            shadow-blue-500/10
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-sky-400/50
            focus:ring-offset-2
            focus:ring-offset-slate-950
          "
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};